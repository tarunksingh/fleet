import { NavLink, Outlet } from 'react-router-dom';

export default function AdminDashboardLayout() {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <NavLink to="." end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
            <NavLink to="hubs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Hubs / Terminals</NavLink>
            <NavLink to="products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Products</NavLink>
            <NavLink to="drivers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Drivers</NavLink>
            <NavLink to="vehicles" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Vehicles</NavLink>
          </nav>
        </aside>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
