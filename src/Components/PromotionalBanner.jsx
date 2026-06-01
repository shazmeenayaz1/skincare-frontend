import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchBanners } from '../features/bannerSlice';
import './PromotionalBanner.css';

const FALLBACK_BANNER = {
  _id: 'fallback',
  title: 'Best Price in Pakistan',
  description:
    'Experience luxury skincare with unbeatable prices. Top international brands now delivered to your doorstep.',
  image: '/promo-banner.png',
  tag: 'Limited Time Offer',
};

const renderTitle = (title) => {
  if (title.includes('Pakistan')) {
    const parts = title.split('Pakistan');
    return (
      <>
        {parts[0]}
        <span className="pakistan">Pakistan</span>
        {parts[1] || ''}
      </>
    );
  }
  return title;
};

const PromotionalBanner = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.banners);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchBanners());
  }, [dispatch, status]);

  const apiBanners = items.filter(
    (b) => b.image && (b.image.startsWith('http') || b.image.startsWith('/'))
  );

  const banners = apiBanners.length > 0 ? apiBanners : [FALLBACK_BANNER];

  const goTo = useCallback(
    (index) => {
      setActiveIndex((index + banners.length) % banners.length);
    },
    [banners.length]
  );

  useEffect(() => {
    if (banners.length <= 1) return undefined;
    const timer = setInterval(() => goTo(activeIndex + 1), 5000);
    return () => clearInterval(timer);
  }, [banners.length, activeIndex, goTo]);

  if (status === 'loading' && apiBanners.length === 0) {
    return (
      <div className="promo-banner">
        <div className="promo-container promo-loading">
          <span>Loading banner...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="promo-banner">
      <div className="promo-container">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`promo-slide ${index === activeIndex ? 'active' : ''}`}
          >
            <img src={banner.image} alt={banner.title} className="promo-img" />
            <div className="promo-overlay">
              <div className="promo-content">
                <span className="promo-tag">
                  {banner.tag || 'Limited Time Offer'}
                </span>
                <h2 className="promo-text">{renderTitle(banner.title)}</h2>
                <p className="promo-desc">{banner.description}</p>
                <Link to="/shop" className="promo-shop-btn">
                  Shop the Collection <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {banners.length > 1 && (
          <>
            <button
              type="button"
              className="promo-nav promo-nav-prev"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous banner"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              className="promo-nav promo-nav-next"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next banner"
            >
              <ChevronRight size={24} />
            </button>
            <div className="promo-dots">
              {banners.map((banner, index) => (
                <button
                  key={banner._id}
                  type="button"
                  className={`promo-dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PromotionalBanner;
