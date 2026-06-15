export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Hub {
  id: string;
  name: string;
  type: 'hub' | 'terminal';
  address: string;
  coordinates: Coordinates;
  inventory: Record<string, number>;
}

export interface Product {
  id: string;
  name: string;
}

export interface Driver {
  id: string;
  name: string;
  license: string;
  phone: string;
}

export interface Vehicle {
  id: string;
  registration: string;
  capacity: number;
  type: string;
}

export interface Order {
  id: string;
  destinationId: string;
  product: string;
  quantity: number;
  deliveryDate: string;
  assignedDriverId: string | null;
  assignedVehicleId: string | null;
  status: 'pending' | 'assigned' | 'completed' | 'failed';
  failureReason?: string;
}

export interface Allocation {
  id: string;
  driverId: string;
  vehicleId: string;
  date: string;
}

export interface VehiclePosition {
  lat: number;
  lng: number;
  driverId: string | null;
}
