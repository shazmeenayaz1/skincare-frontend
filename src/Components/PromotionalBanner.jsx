import React from 'react';
import { ArrowRight } from 'lucide-react';
import './PromotionalBanner.css';

const PromotionalBanner = () => {
  return (
    <div className="promo-banner">
      <div className="promo-container">
        <img src="/promo-banner.png" alt="Promo" className="promo-img" />
        <div className="promo-overlay">
          <div className="promo-content">
            <span className="promo-tag">Limited Time Offer</span>
            <h2 className="promo-text">
              Best Price in <span className="pakistan">Pakistan</span>
            </h2>
            <p className="promo-desc">
              Experience luxury skincare with unbeatable prices. <br />
              Top international brands now delivered to your doorstep.
            </p>
            <button className="promo-shop-btn">
              Shop the Collection <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;
