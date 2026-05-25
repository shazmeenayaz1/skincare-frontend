import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Overview from './Pages/Overview';
import Products from './Pages/Products/Products';
import Categories from './Pages/Categories/Categories';
import Users from './Pages/Users/Users';
import Banners from './Pages/Banners/Banners';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import ResetPassword from './Pages/Auth/ResetPassword';
import Profile from './Pages/Users/Profile';
import { AuthProvider } from './context/AuthContext';


// Placeholder components for other links
const Orders = () => <div className="animate-fade-in"><h1>Orders</h1><p className="text-secondary">Order management coming soon...</p></div>;
const Wallet = () => <div className="animate-fade-in"><h1>Wallet</h1><p className="text-secondary">Financial overview coming soon...</p></div>;
const Settings = () => <div className="animate-fade-in"><h1>Settings</h1><p className="text-secondary">System configurations coming soon...</p></div>;

import HomeLayout from './layouts/HomeLayout';
import StoreLayout from './layouts/StoreLayout';
import Home from './Pages/Home';
import Checkout from './Pages/Checkout';
import ProductDetail from './Pages/ProductDetail';
import Shop from './Pages/Shop';
import About from './Pages/About';
import Contact from './Pages/Contact';
import CartDrawer from './Components/CartDrawer';
import ScrollToTop from './Components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartDrawer />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="product/:id" element={<ProductDetail />} />
          </Route>

          {/* Auth Routes — same store theme + navbar */}
          <Route element={<StoreLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="users" element={<Users />} />
            <Route path="banners" element={<Banners />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
