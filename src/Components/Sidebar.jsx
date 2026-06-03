import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Image, 
  Layers, 
  Package, 
  Users, 
  ShoppingCart,
  Wallet,
  User,
  Settings, 
  LogOut, 
  Home
} from 'lucide-react';
import './Sidebar.css';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const mainMenu = [
    { id: 'home', icon: <Home size={18} />, label: 'Home Page', path: '/' },
    { id: 'overview', icon: <LayoutDashboard size={18} />, label: 'Overview', path: '/admin' },
    { id: 'products', icon: <Package size={18} />, label: 'Products', path: '/admin/products' },
    { id: 'categories', icon: <Layers size={18} />, label: 'Categories', path: '/admin/categories' },
    { id: 'users', icon: <Users size={18} />, label: 'Users', path: '/admin/users' },
    { id: 'banners', icon: <Image size={18} />, label: 'Banners', path: '/admin/banners' },
    { id: 'orders', icon: <ShoppingCart size={18} />, label: 'Orders', path: '/admin/orders' },
  ];

  const systemMenu = [
    { id: 'wallet', icon: <Wallet size={18} />, label: 'Wallet', path: '/admin/wallet' },
    { id: 'profile', icon: <User size={18} />, label: 'Profile', path: '/admin/profile' },
    { id: 'settings', icon: <Settings size={18} />, label: 'Settings', path: '/admin/settings' },
  ];

  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon-wrapper">
            <span className="logo-icon-text">SC</span>
          </div>
          <div className="logo-text-wrapper">
            <span className="logo-main-text">SkinCare<span className="dot" style={{ color: 'var(--accent-pink)' }}>.</span></span>
            <span className="logo-sub-text">ADMIN PANEL</span>
          </div>
        </div>
      </div>

      <div className="sidebar-nav-container">
        <nav className="sidebar-nav">
          <div className="nav-group">
            <span className="nav-group-title">MAIN MENU</span>
            <ul>
              {mainMenu.map((item) => (
                <li key={item.id}>
                  <NavLink 
                    to={item.path} 
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    end
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav-group">
            <span className="nav-group-title">SYSTEM</span>
            <ul>
              {systemMenu.map((item) => (
                <li key={item.id}>
                  <NavLink 
                    to={item.path} 
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    end
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">
            <span className="avatar-initial">A</span>
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Admin User'}</span>
            <span className="user-role">{user?.role || 'Super Admin'}</span>
          </div>
        </div>
        <button className="logout-btn-new" onClick={logout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
