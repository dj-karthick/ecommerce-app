import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/admin', label: '📊 Dashboard', end: true },
    { to: '/admin/inventory', label: '📦 Inventory' },
    { to: '/admin/orders', label: '🛒 Orders' },
  ];

  return (
    <aside className="admin-sidebar">
      <p className="admin-sidebar-title">Admin Panel</p>
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className="sidebar-link"
          style={({ isActive }) => isActive ? { color: 'var(--purple-light)', background: 'var(--purple-glow)' } : {}}
        >
          {l.label}
        </NavLink>
      ))}
      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <button className="btn btn-secondary w-full" onClick={() => { logout(); navigate('/login'); }}>
          Logout
        </button>
      </div>
    </aside>
  );
}
