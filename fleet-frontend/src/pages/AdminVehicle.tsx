import { useEffect, useState } from 'react';
import { api } from '../api';
import { Vehicle } from '../types';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorBanner from '../components/ErrorBanner';
import Toast from '../components/Toast';

export default function AdminVehicle() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [registration, setRegistration] = useState('');
  const [capacity, setCapacity] = useState(8000);
  const [type, setType] = useState('Tanker');

  useEffect(() => {
    async function loadVehicles() {
      try {
        setLoading(true);
        setVehicles(await api.getVehicles());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadVehicles();
  }, []);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  async function handleCreate() {
    if (!registration.trim()) {
      setError('Vehicle registration is required.');
      return;
    }
    try {
      setError('');
      const vehicle = await api.createVehicle({ registration, capacity, type });
      setVehicles((prev) => [...prev, vehicle]);
      setRegistration('');
      setCapacity(8000);
      showToast('Vehicle created.');
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
          <h2>Create Vehicle</h2>
          <label>Registration<input value={registration} onChange={(e) => setRegistration(e.target.value)} /></label>
          <label>Capacity<input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} /></label>
          <label>Type<input value={type} onChange={(e) => setType(e.target.value)} /></label>
          <button onClick={handleCreate}>Create Vehicle</button>
        </div>

        <div className="card">
          <h2>Vehicles</h2>
          <table className="data-table">
            <thead><tr><th>Registration</th><th>Capacity</th><th>Type</th></tr></thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}><td>{vehicle.registration}</td><td>{vehicle.capacity}</td><td>{vehicle.type}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
