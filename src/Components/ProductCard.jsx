import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingBag, Star } from 'lucide-react';
import { addItem } from '../features/cartSlice';
import { productToCartItem } from '../utils/cartUtils';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const {
    _id,
    name,
    main_image: image,
    price: originalPrice,
    discount_price: discountPrice,
    stock_quantity,
  } = product;

  const rating = 4.8;
  const reviews = Math.floor(Math.random() * 500) + 50;
  const discount = discountPrice
    ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
    : null;
  const salePrice = discountPrice || originalPrice;
  const payNowPrice = Math.round(salePrice * 0.4);

  const outOfStock = stock_quantity !== undefined && stock_quantity <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    dispatch(addItem(productToCartItem(product)));
  };

  return (
    <div className="product-card">
      <div className="card-image-wrapper">
        <Link to={`/product/${_id}`} className="product-card-image-link">
          <img src={image} alt={name} className="product-image" />
          {discount && <span className="discount-badge">{discount}%</span>}
        </Link>
        <button
          type="button"
          className="add-to-cart-icon-btn"
          onClick={handleAddToCart}
          disabled={outOfStock}
          aria-label={outOfStock ? 'Out of stock' : 'Add to cart'}
          title={outOfStock ? 'Out of stock' : 'Add to cart'}
        >
          <ShoppingBag size={18} fill="white" />
        </button>
      </div>

      <Link to={`/product/${_id}`} className="product-card-link">
        <div className="card-info">
          <h3 className="product-name">{name}</h3>

          <div className="rating-row">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < Math.floor(rating) ? '#ffb703' : 'none'}
                  color={i < Math.floor(rating) ? '#ffb703' : '#ccc'}
                />
              ))}
            </div>
            <span className="review-count">({reviews}) Reviews</span>
          </div>

          <div className="price-row">
            {discountPrice && (
              <span className="original-price">Rs.{originalPrice}</span>
            )}
            <span className="discount-price">
              {discountPrice ? `From Rs.${discountPrice}` : `Rs.${originalPrice}`}
            </span>
          </div>

          <div className="pay-now-badge">
            <div className="b-logo">b</div>
            <span className="pay-now-text">
              Pay only <strong>Rs.{payNowPrice}</strong> now
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
