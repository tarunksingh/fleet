import { NavLink } from 'react-router-dom';

export default function AdminHome() {
  return (
    <div className="admin-dashboard-main">
      <p>Use the links below to manage fleet master data.</p>
      <div className="card-grid admin-home-grid">
        <NavLink to="hubs" className="card admin-card-link">
          <h3>Create Hub / Terminal</h3>
          <p>Manage hub and terminal locations, addresses, and inventory.</p>
        </NavLink>
        <NavLink to="products" className="card admin-card-link">
          <h3>Create Product</h3>
          <p>Keep the product catalog up to date with fuel and lubricant items.</p>
        </NavLink>
        <NavLink to="drivers" className="card admin-card-link">
          <h3>Create Driver</h3>
          <p>Add drivers with license numbers and contact details.</p>
        </NavLink>
        <NavLink to="vehicles" className="card admin-card-link">
          <h3>Create Vehicle</h3>
          <p>Register vehicles, capacities, and vehicle types.</p>
        </NavLink>
      </div>
    </div>
  );
}
