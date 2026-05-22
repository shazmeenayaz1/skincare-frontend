import React from 'react';
import { Phone, Mail, MapPin, RefreshCw, ShieldCheck, Truck } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Trust Badges */}
      <div className="footer-badges">
        <div className="badge-item">
          <div className="badge-icon purple"><RefreshCw size={24} /></div>
          <div className="badge-info">
            <h4>Easy Returns</h4>
            <p>7 day Return & Exchange Policy</p>
          </div>
        </div>
        <div className="badge-item">
          <div className="badge-icon purple"><ShieldCheck size={24} /></div>
          <div className="badge-info">
            <h4>100% Authentic</h4>
            <p>Products Sourced Directly from Brands</p>
          </div>
        </div>
        <div className="badge-item">
          <div className="badge-icon purple"><Truck size={24} /></div>
          <div className="badge-info">
            <h4>Fast Delivery</h4>
            <p>Delivering in 48-72 hours nationwide</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-main">
        <div className="footer-column">
          <h3>Contact Us</h3>
          <ul className="contact-info">
            <li><Phone size={16} /> +92 328 4418502</li>
            <li><Phone size={16} /> (021) 111 444 439</li>
            <li><Mail size={16} /> support@highfy.pk</li>
            <li className="address">
              <MapPin size={16} /> 
              <span>Khaliq-uz-Zaman Rd, Block 8 Clifton, Karachi, Sindh 75600.</span>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Policies</h3>
          <ul>
            <li><a href="#">FAQ's</a></li>
            <li><a href="#">Return & Exchange</a></li>
            <li><a href="#">Privacy & Cookies Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Track Your Order</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Our Company</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Authenticity Verifications</a></li>
            <li><a href="#">Blogs</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Categories</h3>
          <ul>
            <li><a href="#">Skincare</a></li>
            <li><a href="#">Makeup</a></li>
            <li><a href="#">Haircare</a></li>
            <li><a href="#">Fragrance</a></li>
            <li><a href="#">Personal Care</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Top 5 Brands</h3>
          <ul>
            <li><a href="#">Maybelline</a></li>
            <li><a href="#">Onestep</a></li>
            <li><a href="#">Vaseline</a></li>
            <li><a href="#">Axis-Y</a></li>
            <li><a href="#">J.</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Work With Us</h3>
          <ul>
            <li><a href="#">Highfy Affiliate</a></li>
            <li><a href="#">Brand Partnership Form</a></li>
          </ul>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
