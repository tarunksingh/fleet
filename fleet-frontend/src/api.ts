import { Allocation, Driver, Hub, Order, Product, Vehicle, VehiclePosition } from './types';

const baseUrl = '/api';

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || res.statusText);
  }
  return res.json();
}

export const api = {
  getProducts: () => fetchJson<Product[]>(`${baseUrl}/products`),
  getHubs: () => fetchJson<Hub[]>(`${baseUrl}/hubs`),
  getDrivers: () => fetchJson<Driver[]>(`${baseUrl}/drivers`),
  getVehicles: () => fetchJson<Vehicle[]>(`${baseUrl}/vehicles`),
  getOrders: () => fetchJson<Order[]>(`${baseUrl}/orders`),
  getAllocations: () => fetchJson<Allocation[]>(`${baseUrl}/allocations`),
  getPositions: () => fetchJson<Record<string, VehiclePosition>>(`${baseUrl}/positions`),
  createHub: (payload: Omit<Hub, 'id' | 'inventory'>) => fetchJson<Hub>(`${baseUrl}/hubs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  createProduct: (payload: Omit<Product, 'id'>) => fetchJson<Product>(`${baseUrl}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  createDriver: (payload: Omit<Driver, 'id'>) => fetchJson<Driver>(`${baseUrl}/drivers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  createVehicle: (payload: Omit<Vehicle, 'id'>) => fetchJson<Vehicle>(`${baseUrl}/vehicles`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  createOrder: (payload: Omit<Order, 'id' | 'status' | 'failureReason'>) => fetchJson<Order>(`${baseUrl}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  createAllocation: (payload: Omit<Allocation, 'id'>) => fetchJson<Allocation>(`${baseUrl}/allocations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  updateOrder: (id: string, payload: Partial<Order>) => fetchJson<Order>(`${baseUrl}/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  updatePosition: (vehicleId: string, lat: number, lng: number) => fetchJson<VehiclePosition>(`${baseUrl}/positions/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ vehicleId, lat, lng }) }),
  completeOrder: (id: string) => fetchJson<Order>(`${baseUrl}/complete-order/${id}`, { method: 'POST' }),
  failOrder: (id: string, reason: string) => fetchJson<Order>(`${baseUrl}/fail-order/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) })
};
