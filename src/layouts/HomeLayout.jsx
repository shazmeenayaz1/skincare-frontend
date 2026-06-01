import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import CategoryBar from '../Components/CategoryBar';
import Footer from '../Components/Footer';
import { fetchCategories } from '../features/categorySlice';
import { fetchProducts } from '../features/productSlice';
import { fetchBanners } from '../features/bannerSlice';
import './HomeLayout.css';

const HomeLayout = () => {
  const dispatch = useDispatch();
  const { status: catStatus } = useSelector((state) => state.categories);
  const { status: prodStatus } = useSelector((state) => state.products);
  const { status: bannerStatus } = useSelector((state) => state.banners);

  useEffect(() => {
    document.body.classList.add('light');
    return () => {
      document.body.classList.remove('light');
    };
  }, []);

  useEffect(() => {
    if (catStatus === 'idle') dispatch(fetchCategories());
    if (prodStatus === 'idle') dispatch(fetchProducts());
    if (bannerStatus === 'idle') dispatch(fetchBanners());
  }, [dispatch, catStatus, prodStatus, bannerStatus]);

  return (
    <div className="home-layout">
      <Navbar />
      <CategoryBar />
      <main className="home-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
