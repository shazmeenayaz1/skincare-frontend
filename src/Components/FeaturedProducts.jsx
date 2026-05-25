import React from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import './BestSellers.css';

const FeaturedProducts = () => {
  const { items, status } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');

  const activeCategory = categories.find((c) => c._id === categoryId);

  const displayProducts = items
    .filter((p) => p.main_image && p.main_image.startsWith('http'))
    .filter((p) => {
      if (!categoryId) return true;
      const catRef = p.category_id?._id || p.category_id;
      return catRef === categoryId;
    });

  if (status === 'loading') {
    return (
      <section id="products" className="best-sellers featured-products">
        <div className="section-container">
          <div className="section-header-centered">
            <h2 className="section-title section-title-center">Best Selling Products</h2>
          </div>
          <div className="loading-shimmer loading-centered">Loading products...</div>
        </div>
      </section>
    );
  }

  if (displayProducts.length === 0) {
    return (
      <section id="products" className="best-sellers featured-products">
        <div className="section-container">
          <div className="section-header-centered">
            <h2 className="section-title section-title-center">Best Selling Products</h2>
          </div>
          <p className="no-products-msg">
            No products found in this category.{' '}
            <Link to="/">View all products</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="best-sellers featured-products">
      <div className="section-container">
        <div className="section-header-centered">
          <h2 className="section-title section-title-center">Best Selling Products</h2>
          {categoryId && activeCategory && (
            <p className="section-filter-note">
              Showing: <strong>{activeCategory.name}</strong>
              {' · '}
              <Link to="/" className="clear-filter-link">
                View all
              </Link>
            </p>
          )}
        </div>
        <div className="products-grid">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
