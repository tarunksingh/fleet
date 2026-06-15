import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { Allocation, Driver, Hub, Order, Vehicle, VehiclePosition } from '../types';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorBanner from '../components/ErrorBanner';
import MapPanel from '../components/MapPanel';
import Toast from '../components/Toast';

function DriverInterface() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [positions, setPositions] = useState<Record<string, VehiclePosition>>({});
  const [selectedDriverId, setSelectedDriverId] = useState('driver-1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: 40.7138, lng: -74.0030 });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [driversRes, ordersRes, allocationsRes, vehiclesRes, hubsRes, positionsRes] = await Promise.all([
          api.getDrivers(),
          api.getOrders(),
          api.getAllocations(),
          api.getVehicles(),
          api.getHubs(),
          api.getPositions()
        ]);
        setDrivers(driversRes);
        setOrders(ordersRes);
        setAllocations(allocationsRes);
        setVehicles(vehiclesRes);
        setHubs(hubsRes);
        setPositions(positionsRes);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const driver = drivers.find((d) => d.id === selectedDriverId);
  const driverAllocation = allocations.find((allocation) => allocation.driverId === selectedDriverId && allocation.date === new Date().toISOString().slice(0, 10));
  const driverVehicle = vehicles.find((v) => v.id === driverAllocation?.vehicleId);
  const assignedOrders = orders.filter((order) => order.assignedDriverId === selectedDriverId && order.status !== 'completed' && order.status !== 'failed');
  const historyOrders = orders.filter((order) => order.assignedDriverId === selectedDriverId && (order.status === 'completed' || order.status === 'failed'));

  const markers = useMemo(() => {
    const orderMarkers = assignedOrders.map((order) => {
      const destination = hubs.find((hub) => hub.id === order.destinationId);
      return destination ? { id: order.id, position: [destination.coordinates.lat, destination.coordinates.lng] as [number, number], label: destination.name, detail: `${order.product} • ${order.quantity}` } : null;
    }).filter(Boolean) as Array<{ id: string; position: [number, number]; label: string; detail?: string }>;

    const vehiclePosition = driverVehicle ? positions[driverVehicle.id] : null;
    const currentMarker = vehiclePosition && driverVehicle ? { id: 'current', position: [vehiclePosition.lat, vehiclePosition.lng] as [number, number], label: driverVehicle.registration, detail: driver?.name } : null;

    return currentMarker ? [currentMarker, ...orderMarkers] : orderMarkers;
  }, [assignedOrders, driverVehicle, drivers, hubs, positions, driver]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  async function sendGpsUpdate() {
    if (!driverVehicle) {
      setError('No vehicle allocation for today.');
      return;
    }
    try {
      setError('');
      const nextLat = currentLocation.lat + 0.001;
      const nextLng = currentLocation.lng + 0.001;
      setCurrentLocation({ lat: nextLat, lng: nextLng });
      await api.updatePosition(driverVehicle.id, nextLat, nextLng);
      showToast('GPS location updated.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function completeDelivery(orderId: string) {
    try {
      setError('');
      await api.completeOrder(orderId);
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: 'completed' } : order)));
      showToast('Delivery completed.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function failDelivery(orderId: string) {
    const reason = window.prompt('Reason for failure');
    if (!reason) return;
    try {
      setError('');
      await api.failOrder(orderId, reason);
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: 'failed', failureReason: reason } : order)));
      showToast('Delivery marked failed.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (loading) return <LoadingIndicator />;

  return (
    <div className="driver-interface">
      <h1>Driver Interface</h1>
      {error && <ErrorBanner message={error} />}
      {toast && <Toast message={toast} type="success" />}

      <div className="toolbar-row">
        <label>Driver<select value={selectedDriverId} onChange={(e) => setSelectedDriverId(e.target.value)}>{drivers.map((driverItem) => (<option key={driverItem.id} value={driverItem.id}>{driverItem.name}</option>))}</select></label>
      </div>

      <section className="card driver-summary-card">
        <h2>Today's Shift</h2>
        <p><strong>Driver:</strong> {driver?.name}</p>
        <p><strong>Assigned Vehicle:</strong> {driverVehicle?.registration || 'No allocation'}</p>
        <p><strong>Shift Date:</strong> {new Date().toISOString().slice(0, 10)}</p>
        <button disabled={!driverVehicle} onClick={() => showToast('Shift started')}>Start Shift</button>
      </section>

      <section className="card">
        <h2>Deliveries</h2>
        <table className="data-table">
          <thead><tr><th>Order</th><th>Destination</th><th>Product</th><th>Qty</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {assignedOrders.map((order) => {
              const destination = hubs.find((hub) => hub.id === order.destinationId);
              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{destination?.name || order.destinationId}</td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td>{order.status}</td>
                  <td>
                    <button onClick={() => completeDelivery(order.id)}>Complete</button>
                    <button onClick={() => failDelivery(order.id)}>Fail</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="driver-map-section">
        <h2>Live Map</h2>
        <button onClick={sendGpsUpdate} disabled={!driverVehicle}>Send GPS Update</button>
        <MapPanel center={[currentLocation.lat, currentLocation.lng]} markers={markers} />
      </section>

      <section className="card">
        <h2>Shift History</h2>
        <table className="data-table">
          <thead><tr><th>Order</th><th>Destination</th><th>Product</th><th>Qty</th><th>Status</th></tr></thead>
          <tbody>
            {historyOrders.map((order) => (
              <tr key={order.id}><td>{order.id}</td><td>{hubs.find((hub) => hub.id === order.destinationId)?.name || order.destinationId}</td><td>{order.product}</td><td>{order.quantity}</td><td>{order.status}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default DriverInterface;
