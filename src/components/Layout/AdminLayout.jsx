import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiPackage, FiPlus, FiLogOut } from 'react-icons/fi';
import { FaLaptop } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import '../../pages/admin/Admin.css';

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  const menu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiPackage /> },
    { name: 'Add Product', path: '/admin/products/new', icon: <FiPlus /> },
    { name: 'Storefront', path: '/', icon: <FiHome /> }
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div>
            <h3 style={{ textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>ONLINE COMPUTERS SIRSA</h3>
            <span className="admin-user" style={{ color: 'var(--accent)' }}>Admin Panel</span>
          </div>
        </div>
        <nav className="admin-nav">
          {menu.map(item => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`admin-nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="admin-icon">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          <button onClick={handleSignOut} className="admin-nav-link logout-btn">
            <span className="admin-icon"><FiLogOut /></span>
            Logout
          </button>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
