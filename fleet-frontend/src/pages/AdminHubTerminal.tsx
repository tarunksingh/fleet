import { useEffect, useState } from 'react';
import { api } from '../api';
import { Hub } from '../types';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorBanner from '../components/ErrorBanner';
import Toast from '../components/Toast';

export default function AdminHubTerminal() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<'hub' | 'terminal'>('hub');
  const [lat, setLat] = useState('40.7128');
  const [lng, setLng] = useState('-74.0060');

  useEffect(() => {
    async function loadHubs() {
      try {
        setLoading(true);
        setHubs(await api.getHubs());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadHubs();
  }, []);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  async function handleCreate() {
    if (!name.trim() || !address.trim()) {
      setError('Name and address are required.');
      return;
    }
    try {
      setError('');
      const newHub = await api.createHub({ name, type, address, coordinates: { lat: Number(lat), lng: Number(lng) } });
      setHubs((previous) => [...previous, newHub]);
      setName('');
      setAddress('');
      showToast('Hub/terminal created.');
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
          <h2>Create Hub / Terminal</h2>
          <label>Name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label>Address<input value={address} onChange={(e) => setAddress(e.target.value)} /></label>
          <label>Type<select value={type} onChange={(e) => setType(e.target.value as 'hub' | 'terminal')}><option value="hub">Hub</option><option value="terminal">Terminal</option></select></label>
          <label>Latitude<input value={lat} onChange={(e) => setLat(e.target.value)} /></label>
          <label>Longitude<input value={lng} onChange={(e) => setLng(e.target.value)} /></label>
          <button onClick={handleCreate}>Create Hub / Terminal</button>
        </div>

        <div className="card">
          <h2>Existing Hubs & Terminals</h2>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Type</th><th>Address</th><th>Inventory</th></tr></thead>
            <tbody>
              {hubs.map((hub) => (
                <tr key={hub.id}>
                  <td>{hub.name}</td>
                  <td>{hub.type}</td>
                  <td>{hub.address}</td>
                  <td>{Object.entries(hub.inventory).map(([key, value]) => `${key}: ${value}`).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
