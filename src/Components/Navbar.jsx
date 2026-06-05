import React, { useState } from 'react';
import { Search, User, ShoppingCart, ChevronDown } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { toggleDrawer } from '../features/cartSlice';
import { resolveImageUrl } from '../utils/imageUrl';
import './Navbar.css';

const Navbar = () => {
  const { totalQuantity } = useSelector((state) => state.cart);
  const { user, logout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.search.value.trim();
    if (q) navigate(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" className="logo-text">
            GLOWFY
          </Link>
        </div>

        <ul className="navbar-nav">
          <li>
            <NavLink to="/shop" className={({ isActive }) => (isActive ? 'active' : '')}>
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
              Contact
            </NavLink>
          </li>
        </ul>

        <form className="navbar-search" onSubmit={handleSearch}>
          <div className="search-wrapper">
            <input
              type="search"
              name="search"
              placeholder="Search products..."
              className="search-input"
            />
            <Search className="search-icon" size={20} />
          </div>
        </form>

        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user-dropdown">
              <button 
                type="button" 
                className="user-dropdown-toggle-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.image ? (
                  <img 
                    src={resolveImageUrl(user.image)} 
                    alt={user.name} 
                    className="navbar-avatar-img" 
                  />
                ) : (
                  <span className="navbar-avatar-initial">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="navbar-user-name">{user.name}</span>
                <ChevronDown size={14} />
              </button>
              
              {dropdownOpen && (
                <div className="navbar-dropdown-menu animate-fade-in">
                  <Link 
                    to="/profile" 
                    className="navbar-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Edit Profile
                  </Link>
                  <Link 
                    to="/admin" 
                    className="navbar-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Admin Panel
                  </Link>
                  <button 
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }} 
                    className="navbar-dropdown-item logout-btn-nav"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-auth-link">
                Login
              </Link>
              <Link to="/register" className="nav-auth-link register">
                Register
              </Link>
            </>
          )}

          <button
            type="button"
            className="action-btn cart-btn"
            onClick={() => dispatch(toggleDrawer())}
          >
            <ShoppingCart size={24} strokeWidth={1.5} />
            {totalQuantity > 0 && (
              <span className="cart-badge">{totalQuantity}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
