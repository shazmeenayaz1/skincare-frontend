import React from 'react';
import { Search, User, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { toggleDrawer } from '../features/cartSlice';
import './Navbar.css';

const Navbar = () => {
  const { totalQuantity } = useSelector((state) => state.cart);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
            <Link to="/admin" className="action-btn" title="Account">
              <User size={24} strokeWidth={1.5} />
            </Link>
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
          <Link to="/admin" className="action-btn" title="Admin Panel">
            <LayoutDashboard size={24} strokeWidth={1.5} />
          </Link>
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
