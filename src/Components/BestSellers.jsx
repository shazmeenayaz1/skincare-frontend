import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import './BestSellers.css';

const BestSellers = () => {
  const { items, status } = useSelector((state) => state.products);
  
  // Only show products that have a valid external image
  const displayProducts = items.filter(p => p.main_image && p.main_image.startsWith('http')).slice(0, 8);

  if (status === 'loading') {
    return <div className="loading-shimmer">Loading best sellers...</div>;
  }

  return (
    <section className="best-sellers">
      <div className="section-container">
        <h2 className="section-title">Best Sellers</h2>
        <div className="products-grid">
          {displayProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
