import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { fetchCategories } from '../features/categorySlice';
import { fetchProducts } from '../features/productSlice';
import './StoreLayout.css';

const StoreLayout = () => {
  const dispatch = useDispatch();
  const { status: catStatus } = useSelector((state) => state.categories);
  const { status: prodStatus } = useSelector((state) => state.products);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme;
  }, []);

  useEffect(() => {
    if (catStatus === 'idle') dispatch(fetchCategories());
    if (prodStatus === 'idle') dispatch(fetchProducts());
  }, [dispatch, catStatus, prodStatus]);

  return (
    <div className="store-layout">
      <Navbar />
      <main className="store-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default StoreLayout;
