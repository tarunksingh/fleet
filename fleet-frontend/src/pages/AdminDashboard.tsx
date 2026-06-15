import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { Allocation, Driver, Hub, Order, Product, Vehicle } from '../types';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorBanner from '../components/ErrorBanner';
import MapPanel from '../components/MapPanel';
import Toast from '../components/Toast';

const today = new Date().toISOString().slice(0, 10);

function AdminDashboard() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [positions, setPositions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const [newHubName, setNewHubName] = useState('');
  const [newHubAddress, setNewHubAddress] = useState('');
  const [newHubType, setNewHubType] = useState<'hub' | 'terminal'>('hub');
  const [newHubLat, setNewHubLat] = useState('40.7128');
  const [newHubLng, setNewHubLng] = useState('-74.0060');

  const [newProductName, setNewProductName] = useState('');
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverLicense, setNewDriverLicense] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [newVehicleRegistration, setNewVehicleRegistration] = useState('');
  const [newVehicleCapacity, setNewVehicleCapacity] = useState(8000);
  const [newVehicleType, setNewVehicleType] = useState('Tanker');

  const [orderDestination, setOrderDestination] = useState('terminal-1');
  const [orderProduct, setOrderProduct] = useState('diesel');
  const [orderQuantity, setOrderQuantity] = useState(1000);
  const [orderDate, setOrderDate] = useState(today);
  const [orderDriver, setOrderDriver] = useState('driver-1');
  const [orderVehicle, setOrderVehicle] = useState('vehicle-1');

  const [allocationDriver, setAllocationDriver] = useState('driver-1');
  const [allocationVehicle, setAllocationVehicle] = useState('vehicle-1');
  const [allocationDate, setAllocationDate] = useState(today);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [hubsRes, productsRes, driversRes, vehiclesRes, ordersRes, allocationsRes, positionsRes] = await Promise.all([
          api.getHubs(),
          api.getProducts(),
          api.getDrivers(),
          api.getVehicles(),
          api.getOrders(),
          api.getAllocations(),
          api.getPositions()
        ]);
        setHubs(hubsRes);
        setProducts(productsRes);
        setDrivers(driversRes);
        setVehicles(vehiclesRes);
        setOrders(ordersRes);
        setAllocations(allocationsRes);
        setPositions(positionsRes);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesSearch = [order.product, order.id].some((term) => term.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  const inventoryList = useMemo(() => {
    const items = hubs.filter((hub) => {
      if (inventoryFilter === 'low') {
        return Object.values(hub.inventory).some((qty) => qty < 5000);
      }
      return true;
    });
    return items;
  }, [hubs, inventoryFilter]);

  const mapMarkers = useMemo(() => {
    return Object.entries(positions).map(([vehicleId, position]) => {
      const vehicle = vehicles.find((v) => v.id === vehicleId);
      const driver = drivers.find((d) => d.id === position.driverId);
      return {
        id: vehicleId,
        position: [position.lat, position.lng] as [number, number],
        label: vehicle ? `${vehicle.registration}` : vehicleId,
        detail: driver ? `${driver.name} • ${vehicle?.type}` : undefined
      };
    });
  }, [positions, vehicles, drivers]);

  const center = [40.72, -74.0] as [number, number];

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  async function createHub() {
    if (!newHubName.trim() || !newHubAddress.trim()) {
      setError('Name and address are required.');
      return;
    }
    try {
      setError('');
      const payload = {
        name: newHubName,
        type: newHubType,
        address: newHubAddress,
        coordinates: { lat: Number(newHubLat), lng: Number(newHubLng) }
      };
      const hub = await api.createHub(payload);
      setHubs((prev) => [...prev, hub]);
      setNewHubName('');
      showToast('Hub created.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function createProduct() {
    if (!newProductName.trim()) {
      setError('Product name is required.');
      return;
    }
    try {
      setError('');
      const product = await api.createProduct({ name: newProductName });
      setProducts((prev) => [...prev, product]);
      setNewProductName('');
      showToast('Product created.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function createDriver() {
    if (!newDriverName.trim() || !newDriverLicense.trim() || !newDriverPhone.trim()) {
      setError('All driver fields are required.');
      return;
    }
    try {
      setError('');
      const driver = await api.createDriver({ name: newDriverName, license: newDriverLicense, phone: newDriverPhone });
      setDrivers((prev) => [...prev, driver]);
      setNewDriverName('');
      setNewDriverLicense('');
      setNewDriverPhone('');
      showToast('Driver created.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function createVehicle() {
    if (!newVehicleRegistration.trim()) {
      setError('Vehicle registration is required.');
      return;
    }
    try {
      setError('');
      const vehicle = await api.createVehicle({ registration: newVehicleRegistration, capacity: newVehicleCapacity, type: newVehicleType });
      setVehicles((prev) => [...prev, vehicle]);
      setNewVehicleRegistration('');
      showToast('Vehicle created.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function createOrder() {
    if (orderQuantity <= 0) {
      setError('Quantity must be greater than zero.');
      return;
    }
    try {
      setError('');
      const order = await api.createOrder({ destinationId: orderDestination, product: orderProduct, quantity: orderQuantity, deliveryDate: orderDate, assignedDriverId: orderDriver, assignedVehicleId: orderVehicle });
      setOrders((prev) => [...prev, order]);
      showToast('Order created.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function createAllocation() {
    try {
      setError('');
      const allocation = await api.createAllocation({ driverId: allocationDriver, vehicleId: allocationVehicle, date: allocationDate });
      setAllocations((prev) => [...prev, allocation]);
      showToast('Vehicle allocated.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function refreshPositions() {
    try {
      setError('');
      const positionsRes = await api.getPositions();
      setPositions(positionsRes);
      showToast('Map refreshed.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (loading) return <LoadingIndicator />;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {error && <ErrorBanner message={error} />}
      {toast && <Toast message={toast} type="success" />}

      <section className="admin-section">
        <h2>Master Data</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Create Hub / Terminal</h3>
            <label>Name<input value={newHubName} onChange={(e) => setNewHubName(e.target.value)} /></label>
            <label>Address<input value={newHubAddress} onChange={(e) => setNewHubAddress(e.target.value)} /></label>
            <label>Type<select value={newHubType} onChange={(e) => setNewHubType(e.target.value as 'hub' | 'terminal')}><option value="hub">Hub</option><option value="terminal">Terminal</option></select></label>
            <label>Latitude<input value={newHubLat} onChange={(e) => setNewHubLat(e.target.value)} /></label>
            <label>Longitude<input value={newHubLng} onChange={(e) => setNewHubLng(e.target.value)} /></label>
            <button onClick={createHub}>Create Hub</button>
          </div>

          <div className="card">
            <h3>Create Product</h3>
            <label>Name<input value={newProductName} onChange={(e) => setNewProductName(e.target.value)} /></label>
            <button onClick={createProduct}>Create Product</button>
          </div>

          <div className="card">
            <h3>Create Driver</h3>
            <label>Name<input value={newDriverName} onChange={(e) => setNewDriverName(e.target.value)} /></label>
            <label>License<input value={newDriverLicense} onChange={(e) => setNewDriverLicense(e.target.value)} /></label>
            <label>Phone<input value={newDriverPhone} onChange={(e) => setNewDriverPhone(e.target.value)} /></label>
            <button onClick={createDriver}>Create Driver</button>
          </div>

          <div className="card">
            <h3>Create Vehicle</h3>
            <label>Registration<input value={newVehicleRegistration} onChange={(e) => setNewVehicleRegistration(e.target.value)} /></label>
            <label>Capacity<input type="number" value={newVehicleCapacity} onChange={(e) => setNewVehicleCapacity(Number(e.target.value))} /></label>
            <label>Type<input value={newVehicleType} onChange={(e) => setNewVehicleType(e.target.value)} /></label>
            <button onClick={createVehicle}>Create Vehicle</button>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2>Order Management</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Create Order</h3>
            <label>Destination<select value={orderDestination} onChange={(e) => setOrderDestination(e.target.value)}>{hubs.map((hub) => (<option key={hub.id} value={hub.id}>{hub.name}</option>))}</select></label>
            <label>Product<select value={orderProduct} onChange={(e) => setOrderProduct(e.target.value)}>{products.map((product) => (<option key={product.id} value={product.id}>{product.name}</option>))}</select></label>
            <label>Quantity<input type="number" value={orderQuantity} onChange={(e) => setOrderQuantity(Number(e.target.value))} /></label>
            <label>Date<input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} /></label>
            <label>Driver<select value={orderDriver} onChange={(e) => setOrderDriver(e.target.value)}>{drivers.map((driver) => (<option key={driver.id} value={driver.id}>{driver.name}</option>))}</select></label>
            <label>Vehicle<select value={orderVehicle} onChange={(e) => setOrderVehicle(e.target.value)}>{vehicles.map((vehicle) => (<option key={vehicle.id} value={vehicle.id}>{vehicle.registration}</option>))}</select></label>
            <button onClick={createOrder}>Create Order</button>
          </div>

          <div className="card">
            <h3>Allocate Vehicle</h3>
            <label>Driver<select value={allocationDriver} onChange={(e) => setAllocationDriver(e.target.value)}>{drivers.map((driver) => (<option key={driver.id} value={driver.id}>{driver.name}</option>))}</select></label>
            <label>Vehicle<select value={allocationVehicle} onChange={(e) => setAllocationVehicle(e.target.value)}>{vehicles.map((vehicle) => (<option key={vehicle.id} value={vehicle.id}>{vehicle.registration}</option>))}</select></label>
            <label>Date<input type="date" value={allocationDate} onChange={(e) => setAllocationDate(e.target.value)} /></label>
            <button onClick={createAllocation}>Allocate Vehicle</button>
          </div>
        </div>

        <div className="search-row">
          <input placeholder="Search orders" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Destination</th><th>Product</th><th>Qty</th><th>Date</th><th>Driver</th><th>Vehicle</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{hubs.find((hub) => hub.id === order.destinationId)?.name || order.destinationId}</td>
                <td>{order.product}</td>
                <td>{order.quantity}</td>
                <td>{order.deliveryDate}</td>
                <td>{drivers.find((driver) => driver.id === order.assignedDriverId)?.name || '-'}</td>
                <td>{vehicles.find((vehicle) => vehicle.id === order.assignedVehicleId)?.registration || '-'}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="admin-section">
        <h2>Fleet Map</h2>
        <div className="toolbar-row">
          <button onClick={refreshPositions}>Refresh Map</button>
        </div>
        <MapPanel center={center} markers={mapMarkers} />
      </section>

      <section className="admin-section">
        <h2>Inventory</h2>
        <div className="toolbar-row">
          <label>Filter<select value={inventoryFilter} onChange={(e) => setInventoryFilter(e.target.value)}><option value="all">All</option><option value="low">Low stock</option></select></label>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Type</th><th>Diesel</th><th>Petrol</th><th>Lubricant</th></tr>
          </thead>
          <tbody>
            {inventoryList.map((hub) => (
              <tr key={hub.id} className={Object.values(hub.inventory).some((qty) => qty < 5000) ? 'low-stock' : ''}>
                <td>{hub.name}</td>
                <td>{hub.type}</td>
                <td>{hub.inventory.diesel}</td>
                <td>{hub.inventory.petrol}</td>
                <td>{hub.inventory.lubricant}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AdminDashboard;
