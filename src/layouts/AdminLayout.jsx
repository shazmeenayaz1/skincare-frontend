import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import { Search, Bell, Sun, Moon, ChevronDown } from 'lucide-react';
import { resolveImageUrl } from '../utils/imageUrl';
import './AdminLayout.css';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (user.urole !== 'admin') {
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0b', color: 'white' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!user || user.urole !== 'admin') {
    return null;
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const getPageDetails = () => {
    const path = location.pathname;
    if (path.endsWith('/products')) {
      return { title: 'Products', breadcrumb: 'ADMIN > PRODUCTS' };
    } else if (path.endsWith('/categories')) {
      return { title: 'Categories', breadcrumb: 'ADMIN > CATEGORIES' };
    } else if (path.endsWith('/users')) {
      return { title: 'Users', breadcrumb: 'ADMIN > USERS' };
    } else if (path.endsWith('/banners')) {
      return { title: 'Banners', breadcrumb: 'ADMIN > BANNERS' };
    } else if (path.endsWith('/orders')) {
      return { title: 'Orders', breadcrumb: 'ADMIN > ORDERS' };
    } else if (path.endsWith('/profile')) {
      return { title: 'Profile', breadcrumb: 'ADMIN > PROFILE' };
    } else if (path.endsWith('/wallet')) {
      return { title: 'Wallet', breadcrumb: 'ADMIN > WALLET' };
    } else if (path.endsWith('/settings')) {
      return { title: 'Settings', breadcrumb: 'ADMIN > SETTINGS' };
    }
    return { title: 'Overview', breadcrumb: 'ADMIN > OVERVIEW' };
  };

  const { title, breadcrumb } = getPageDetails();

  return (
    <div className={`admin-layout ${theme}`}>
      <Sidebar />
      <main className="main-wrapper">
        <header className="top-header-new">
          <div className="header-left">
            <h1 className="header-page-title">{title}</h1>
            <span className="header-breadcrumb">{breadcrumb}</span>
          </div>
          
          <div className="header-right">
            <div className="header-search-new">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search dashboard..." />
            </div>

            <button className="theme-toggle-btn-new" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="icon-btn-new" title="Notifications">
              <Bell size={18} />
              <span className="notification-dot-new"></span>
            </button>

            <div className="profile-pill">
              <div className="profile-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user?.image ? (
                  <img src={resolveImageUrl(user.image)} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="profile-avatar-text">{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
                )}
              </div>
              <span className="profile-name">{user?.name || 'Alessandro'}</span>
              <ChevronDown size={14} className="profile-chevron" />
            </div>
          </div>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
