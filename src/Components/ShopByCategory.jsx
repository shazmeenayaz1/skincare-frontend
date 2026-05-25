import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './ShopByCategory.css';

const hasValidImage = (image) =>
  image && (image.startsWith('http://') || image.startsWith('https://'));

const ShopByCategory = () => {
  const { items, status } = useSelector((state) => state.categories);
  const { items: products } = useSelector((state) => state.products);

  const categories = items
    .filter((cat) => cat.isActive !== false && hasValidImage(cat.image))
    .slice(0, 12);

  const getProductCount = (categoryId) =>
    products.filter((p) => {
      const catRef = p.category_id?._id || p.category_id;
      return catRef === categoryId;
    }).length;

  if (status === 'loading') {
    return (
      <section className="shop-by-category">
        <div className="loading-shimmer">Loading categories...</div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="shop-by-category">
      <div className="category-header">
        <h2>Shop By Category</h2>
        <Link to="/" className="view-all">
          View all
        </Link>
      </div>
      <div className="category-grid">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/?category=${cat._id}#products`}
            className="category-circle-item"
          >
            <div className="circle-wrapper">
              <img
                src={cat.image}
                alt={cat.name}
                className="cat-circle-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.style.background = 'rgba(0,0,0,0.05)';
                }}
              />
            </div>
            <span className="cat-circle-name">{cat.name}</span>
            {getProductCount(cat._id) > 0 && (
              <span className="cat-product-count">
                {getProductCount(cat._id)} items
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShopByCategory;
