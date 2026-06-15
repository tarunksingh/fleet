const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const products = [
  { id: 'diesel', name: 'Diesel' },
  { id: 'petrol', name: 'Petrol' },
  { id: 'lubricant', name: 'Lubricant' }
];

const hubs = [
  {
    id: 'hub-1',
    name: 'Downtown Distribution Hub',
    type: 'hub',
    address: '123 Main St, City',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    inventory: { diesel: 15000, petrol: 12000, lubricant: 8000 }
  },
  {
    id: 'terminal-1',
    name: 'North Terminal',
    type: 'terminal',
    address: '456 North Ave, City',
    coordinates: { lat: 40.7306, lng: -73.9352 },
    inventory: { diesel: 6000, petrol: 7000, lubricant: 3000 }
  },
  {
    id: 'terminal-2',
    name: 'East Terminal',
    type: 'terminal',
    address: '789 East Rd, City',
    coordinates: { lat: 40.7122, lng: -73.9799 },
    inventory: { diesel: 4500, petrol: 5500, lubricant: 2000 }
  },
  {
    id: 'terminal-3',
    name: 'West Terminal',
    type: 'terminal',
    address: '101 West Blvd, City',
    coordinates: { lat: 40.7359, lng: -74.0031 },
    inventory: { diesel: 9000, petrol: 5000, lubricant: 1500 }
  },
  {
    id: 'terminal-4',
    name: 'South Terminal',
    type: 'terminal',
    address: '202 South St, City',
    coordinates: { lat: 40.7009, lng: -74.0123 },
    inventory: { diesel: 3000, petrol: 2000, lubricant: 1200 }
  }
];

const drivers = [
  { id: 'driver-1', name: 'John Smith', license: 'DL-123456', phone: '+1-555-0100' },
  { id: 'driver-2', name: 'Priya Desai', license: 'DL-234567', phone: '+1-555-0101' },
  { id: 'driver-3', name: 'Luis Martinez', license: 'DL-345678', phone: '+1-555-0102' },
  { id: 'driver-4', name: 'Amina Okafor', license: 'DL-456789', phone: '+1-555-0103' }
];

const vehicles = [
  { id: 'vehicle-1', registration: 'TRK-101', capacity: 8000, type: 'Tanker' },
  { id: 'vehicle-2', registration: 'TRK-102', capacity: 10000, type: 'Tanker' },
  { id: 'vehicle-3', registration: 'TRK-103', capacity: 5000, type: 'Pickup' },
  { id: 'vehicle-4', registration: 'TRK-104', capacity: 7000, type: 'Tanker' }
];

const allocations = [
  { id: 'allocation-1', driverId: 'driver-1', vehicleId: 'vehicle-1', date: '2025-11-24' },
  { id: 'allocation-2', driverId: 'driver-2', vehicleId: 'vehicle-2', date: '2025-11-24' }
];

const orders = [
  {
    id: 'order-1',
    destinationId: 'terminal-1',
    product: 'diesel',
    quantity: 5000,
    deliveryDate: '2025-11-24',
    assignedDriverId: 'driver-1',
    assignedVehicleId: 'vehicle-1',
    status: 'assigned'
  },
  {
    id: 'order-2',
    destinationId: 'terminal-2',
    product: 'petrol',
    quantity: 4000,
    deliveryDate: '2025-11-25',
    assignedDriverId: 'driver-2',
    assignedVehicleId: 'vehicle-2',
    status: 'assigned'
  },
  {
    id: 'order-3',
    destinationId: 'terminal-3',
    product: 'lubricant',
    quantity: 1500,
    deliveryDate: '2025-11-26',
    assignedDriverId: null,
    assignedVehicleId: null,
    status: 'pending'
  }
];

const vehiclePositions = {
  'vehicle-1': { lat: 40.7138, lng: -74.0030, driverId: 'driver-1' },
  'vehicle-2': { lat: 40.7250, lng: -73.9800, driverId: 'driver-2' },
  'vehicle-3': { lat: 40.7220, lng: -73.9900, driverId: null },
  'vehicle-4': { lat: 40.7050, lng: -74.0100, driverId: null }
};

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

app.get('/api/products', (req, res) => res.json(products));
app.get('/api/hubs', (req, res) => res.json(hubs));
app.get('/api/drivers', (req, res) => res.json(drivers));
app.get('/api/vehicles', (req, res) => res.json(vehicles));
app.get('/api/orders', (req, res) => res.json(orders));
app.get('/api/allocations', (req, res) => res.json(allocations));
app.get('/api/positions', (req, res) => res.json(vehiclePositions));

app.post('/api/products', (req, res) => {
  const item = { id: createId('product'), ...req.body };
  products.push(item);
  res.status(201).json(item);
});

app.post('/api/hubs', (req, res) => {
  const item = { id: createId('hub'), inventory: { diesel: 0, petrol: 0, lubricant: 0 }, ...req.body };
  hubs.push(item);
  res.status(201).json(item);
});

app.post('/api/drivers', (req, res) => {
  const item = { id: createId('driver'), ...req.body };
  drivers.push(item);
  res.status(201).json(item);
});

app.post('/api/vehicles', (req, res) => {
  const item = { id: createId('vehicle'), ...req.body };
  vehicles.push(item);
  res.status(201).json(item);
});

app.post('/api/orders', (req, res) => {
  const item = { id: createId('order'), status: 'pending', ...req.body };
  orders.push(item);
  res.status(201).json(item);
});

app.post('/api/allocations', (req, res) => {
  const { driverId, vehicleId, date } = req.body;
  const conflict = allocations.find(a => a.vehicleId === vehicleId && a.date === date);
  if (conflict) {
    return res.status(409).json({ error: 'Vehicle already allocated for this date.' });
  }
  const item = { id: createId('allocation'), driverId, vehicleId, date };
  allocations.push(item);
  res.status(201).json(item);
});

app.put('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  Object.assign(order, req.body);
  res.json(order);
});

app.post('/api/positions/update', (req, res) => {
  const { vehicleId, lat, lng } = req.body;
  if (!vehiclePositions[vehicleId]) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  vehiclePositions[vehicleId] = { lat, lng, driverId: vehiclePositions[vehicleId].driverId };
  res.json(vehiclePositions[vehicleId]);
});

app.post('/api/complete-order/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = 'completed';
  const destination = hubs.find(h => h.id === order.destinationId);
  if (destination) {
    destination.inventory[order.product] = Math.max(0, destination.inventory[order.product] - order.quantity);
  }
  res.json(order);
});

app.post('/api/fail-order/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = 'failed';
  order.failureReason = req.body.reason;
  res.json(order);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Fleet backend running on http://localhost:${port}`);
});
