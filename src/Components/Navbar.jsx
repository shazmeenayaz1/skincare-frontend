import React from 'react';
import { Search, User, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDrawer } from '../features/cartSlice';
import './Navbar.css';

const Navbar = () => {
  const { totalQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <Link to="/" className="logo-text">GLOWFY</Link>
        </div>

        {/* Search Bar Section */}
        <div className="navbar-search">
          <div className="search-wrapper">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="search-input"
            />
            <Search className="search-icon" size={20} />
          </div>
        </div>

        {/* Icons Section */}
        <div className="navbar-actions">
          <Link to="/admin" className="action-btn" title="Admin Panel">
            <LayoutDashboard size={24} strokeWidth={1.5} />
          </Link>
          <button className="action-btn">
            <User size={24} strokeWidth={1.5} />
          </button>
          <button className="action-btn cart-btn" onClick={() => dispatch(toggleDrawer())}>
            <ShoppingCart size={24} strokeWidth={1.5} />
            <span className="cart-badge">{totalQuantity}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
