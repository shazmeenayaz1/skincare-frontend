import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { 
    name, 
    main_image: image, 
    price: originalPrice, 
    discount_price: discountPrice,
  } = product;

  // Temporary random values for UI consistency
  const rating = 4.8;
  const reviews = Math.floor(Math.random() * 500) + 50;
  const discount = discountPrice ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100) : null;
  const payNowPrice = Math.round((discountPrice || originalPrice) * 0.4); 
  const hasOptions = false;

  return (
    <div className="product-card">
      <div className="card-image-wrapper">
        <img src={image} alt={name} className="product-image" />
        {discount && <span className="discount-badge">{discount}%</span>}
        
        {hasOptions ? (
          <button className="choose-options-btn">Choose options</button>
        ) : (
          <button className="add-to-cart-icon-btn">
            <ShoppingBag size={18} fill="white" />
          </button>
        )}
      </div>

      <div className="card-info">
        <h3 className="product-name">{name}</h3>
        
        <div className="rating-row">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                fill={i < Math.floor(rating) ? "#ffb703" : "none"} 
                color={i < Math.floor(rating) ? "#ffb703" : "#ccc"} 
              />
            ))}
          </div>
          <span className="review-count">({reviews}) Reviews</span>
        </div>

        <div className="price-row">
          <span className="original-price">Rs.{originalPrice}</span>
          <span className="discount-price">From Rs.{discountPrice}</span>
        </div>

        <div className="pay-now-badge">
          <div className="b-logo">b</div>
          <span className="pay-now-text">Pay only <strong>Rs.{payNowPrice}</strong> now</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
