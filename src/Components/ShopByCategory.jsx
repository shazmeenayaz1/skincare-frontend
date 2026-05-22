import React from 'react';
import { useSelector } from 'react-redux';
import './ShopByCategory.css';

const ShopByCategory = () => {
  const { items, status } = useSelector((state) => state.categories);
  
  // Only show categories that have a valid external image
  const categories = items.filter(cat => cat.image && cat.image.startsWith('http')).slice(0, 12);

  if (status === 'loading') {
    return <div className="loading-shimmer">Loading categories...</div>;
  }

  return (
    <section className="shop-by-category">
      <div className="category-header">
        <h2>Shop By Category</h2>
        <a href="#" className="view-all">View all</a>
      </div>
      <div className="category-grid">
        {categories.map((cat, index) => (
          <div key={index} className="category-circle-item" id={`cat-${cat._id}`}>
            <div className="circle-wrapper">
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="cat-circle-img" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.style.background = 'rgba(0,0,0,0.05)';
                  // Optionally hide the whole item if image fails
                  // document.getElementById(`cat-${cat._id}`).style.display = 'none';
                }}
              />
            </div>
            <span className="cat-circle-name">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopByCategory;
