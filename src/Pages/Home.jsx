import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PromotionalBanner from '../Components/PromotionalBanner';
import FeaturedProducts from '../Components/FeaturedProducts';
import CustomerReviews from '../Components/CustomerReviews';
import './Home.css';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash, location.search]);

  return (
    <div className="home-page">
      <PromotionalBanner />
      <FeaturedProducts />
      <CustomerReviews />
    </div>
  );
};

export default Home;
