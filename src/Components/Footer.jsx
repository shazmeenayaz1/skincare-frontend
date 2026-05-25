import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Phone, Mail, MapPin, RefreshCw, ShieldCheck, Truck } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const { items: categories } = useSelector((state) => state.categories);
  const activeCategories = categories.filter((c) => c.isActive !== false).slice(0, 6);

  return (
    <footer className="footer">
      <div className="footer-badges">
        <div className="badge-item">
          <div className="badge-icon purple">
            <RefreshCw size={24} />
          </div>
          <div className="badge-info">
            <h4>Easy Returns</h4>
            <p>7 day Return & Exchange Policy</p>
          </div>
        </div>
        <div className="badge-item">
          <div className="badge-icon purple">
            <ShieldCheck size={24} />
          </div>
          <div className="badge-info">
            <h4>100% Authentic</h4>
            <p>Products Sourced Directly from Brands</p>
          </div>
        </div>
        <div className="badge-item">
          <div className="badge-icon purple">
            <Truck size={24} />
          </div>
          <div className="badge-info">
            <h4>Fast Delivery</h4>
            <p>Delivering in 48-72 hours nationwide</p>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-column">
          <h3>Contact Us</h3>
          <ul className="contact-info">
            <li>
              <Phone size={16} /> +92 328 4418502
            </li>
            <li>
              <Phone size={16} /> (021) 111 444 439
            </li>
            <li>
              <Mail size={16} /> support@glowfy.pk
            </li>
            <li className="address">
              <MapPin size={16} />
              <span>
                Khaliq-uz-Zaman Rd, Block 8 Clifton, Karachi, Sindh 75600.
              </span>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Categories</h3>
          <ul>
            {activeCategories.length > 0 ? (
              activeCategories.map((cat) => (
                <li key={cat._id}>
                  <Link to={`/shop?category=${cat._id}`}>{cat.name}</Link>
                </li>
              ))
            ) : (
              <>
                <li>
                  <Link to="/shop">Skincare</Link>
                </li>
                <li>
                  <Link to="/shop">View All</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="footer-column">
          <h3>Reviews</h3>
          <ul>
            <li>
              <Link to="/#reviews">Customer Reviews</Link>
            </li>
            <li>
              <Link to="/about">About GLOWFY</Link>
            </li>
            <li>
              <Link to="/shop">Shop All</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} GLOWFY. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
