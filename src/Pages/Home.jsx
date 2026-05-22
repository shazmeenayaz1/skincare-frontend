import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCategories } from '../features/categorySlice';
import { fetchProducts } from '../features/productSlice';
import PromotionalBanner from '../Components/PromotionalBanner';
import ShopByCategory from '../Components/ShopByCategory';
import FeaturedProducts from '../Components/FeaturedProducts';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="home-page">
      {/* Promotional Banner */}
      <PromotionalBanner />

      {/* Shop By Category */}
      <ShopByCategory />

      {/* New Arrivals Section */}
      <FeaturedProducts />
    </div>
  );
};

export default Home;
