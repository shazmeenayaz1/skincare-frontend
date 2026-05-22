import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Users, 
  ShoppingCart, 
  Wallet, 
  Settings,
  Image,
  ChevronRight,
  LogOut,
  UserCircle,
  Home
} from 'lucide-react';
import './Sidebar.css';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const menuItems = [
    { id: 'home', icon: <Home size={20} />, label: 'Home Page', path: '/' },
    { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/admin' },
    { id: 'products', icon: <Package size={20} />, label: 'Products', path: '/admin/products' },
    { id: 'categories', icon: <Layers size={20} />, label: 'Categories', path: '/admin/categories' },
    { id: 'users', icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
    { id: 'banners', icon: <Image size={20} />, label: 'Banners', path: '/admin/banners' },
    { id: 'orders', icon: <ShoppingCart size={20} />, label: 'Orders', path: '/admin/orders' },

    { id: 'wallet', icon: <Wallet size={20} />, label: 'Wallet', path: '/admin/wallet' },
    { id: 'profile', icon: <UserCircle size={20} />, label: 'Profile', path: '/admin/profile' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
  ];

  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-glow"></div>
          <span className="logo-text">SkinCare<span className="dot">.</span></span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                end
              >
                <div className="nav-icon-wrapper">
                  {item.icon}
                </div>
                <span className="nav-label">{item.label}</span>
                {item.id === 'overview' && <div className="active-glow"></div>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Guest'}`} alt="User Avatar" />
            <div className="status-indicator"></div>
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Loading...'}</span>
            <span className="user-role">{user?.role || 'Guest'}</span>
          </div>
          <button className="logout-btn" onClick={logout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
