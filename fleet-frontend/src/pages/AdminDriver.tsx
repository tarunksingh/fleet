import { useEffect, useState } from 'react';
import { api } from '../api';
import { Driver } from '../types';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorBanner from '../components/ErrorBanner';
import Toast from '../components/Toast';

export default function AdminDriver() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [license, setLicense] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    async function loadDrivers() {
      try {
        setLoading(true);
        setDrivers(await api.getDrivers());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadDrivers();
  }, []);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  async function handleCreate() {
    if (!name.trim() || !license.trim() || !phone.trim()) {
      setError('All driver fields are required.');
      return;
    }
    try {
      setError('');
      const driver = await api.createDriver({ name, license, phone });
      setDrivers((prev) => [...prev, driver]);
      setName('');
      setLicense('');
      setPhone('');
      showToast('Driver created.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (loading) return <LoadingIndicator />;

  return (
    <div className="admin-dashboard-main">
      {error && <ErrorBanner message={error} />}
      {toast && <Toast message={toast} type="success" />}

      <div className="card-grid">
        <div className="card">
          <h2>Create Driver</h2>
          <label>Name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label>License<input value={license} onChange={(e) => setLicense(e.target.value)} /></label>
          <label>Phone<input value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          <button onClick={handleCreate}>Create Driver</button>
        </div>

        <div className="card">
          <h2>Drivers</h2>
          <table className="data-table">
            <thead><tr><th>Name</th><th>License</th><th>Phone</th></tr></thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id}><td>{driver.name}</td><td>{driver.license}</td><td>{driver.phone}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
