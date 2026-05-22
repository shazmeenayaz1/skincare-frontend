import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import './BestSellers.css'; // Reusing the same beautiful styles

const FeaturedProducts = () => {
  const { items, status } = useSelector((state) => state.products);
  
  // Show products that have a valid external image
  const displayProducts = items
    .filter(p => p.main_image && p.main_image.startsWith('http'))
    .slice(0, 16);

  if (status === 'loading') {
    return <div className="loading-shimmer">Loading products...</div>;
  }

  if (displayProducts.length === 0) return null;

  return (
    <section className="best-sellers featured-products">
      <div className="section-container">
        <h2 className="section-title">Products</h2>
        <div className="products-grid">
          {displayProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
