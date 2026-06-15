import { Route, Routes, NavLink, Navigate } from 'react-router-dom';
import AdminDashboardLayout from './pages/AdminDashboardLayout';
import AdminHome from './pages/AdminHome';
import AdminHubTerminal from './pages/AdminHubTerminal';
import AdminProduct from './pages/AdminProduct';
import AdminDriver from './pages/AdminDriver';
import AdminVehicle from './pages/AdminVehicle';
import DriverInterface from './pages/DriverInterface';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Fleet Tracker</div>
        <nav>
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Admin</NavLink>
          <NavLink to="/driver" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Driver</NavLink>
        </nav>
      </header>

      <main className="app-content">
        <Routes>
          <Route path="/admin" element={<AdminDashboardLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="hubs" element={<AdminHubTerminal />} />
            <Route path="products" element={<AdminProduct />} />
            <Route path="drivers" element={<AdminDriver />} />
            <Route path="vehicles" element={<AdminVehicle />} />
          </Route>
          <Route path="/driver" element={<DriverInterface />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
