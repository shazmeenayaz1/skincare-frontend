import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import CategoryBar from '../Components/CategoryBar';
import Footer from '../Components/Footer';
import './HomeLayout.css';

const HomeLayout = () => {
  useEffect(() => {
    document.body.classList.add('light');
    return () => {
      document.body.classList.remove('light');
    };
  }, []);

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
