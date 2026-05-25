import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ShoppingBag, Star, Minus, Plus } from 'lucide-react';
import { fetchProductById } from '../features/productSlice';
import { addItem } from '../features/cartSlice';
import { productToCartItem } from '../utils/cartUtils';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: product, currentProductStatus: status } = useSelector(
    (state) => state.products
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.main_image) {
      setActiveImage(product.main_image);
    }
  }, [product]);

  if (status === 'loading') {
    return (
      <div className="product-detail-page">
        <div className="product-detail-loading">Loading product...</div>
      </div>
    );
  }

  if (status === 'failed' || !product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-error">
          <p>Product not found.</p>
          <Link to="/" className="back-to-store">
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const {
    name,
    brand,
    description,
    short_description,
    price,
    discount_price,
    main_image,
    gallery_images = [],
    stock_quantity,
    benefits,
    ingredients,
    how_to_use,
    skin_type = [],
    concerns = [],
    category_id,
  } = product;

  const salePrice = discount_price || price;
  const discount =
    discount_price && price > discount_price
      ? Math.round(((price - discount_price) / price) * 100)
      : null;

  const allImages = [main_image, ...gallery_images.filter((img) => img !== main_image)];

  const handleAddToCart = () => {
    dispatch(addItem(productToCartItem(product, quantity)));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <Link to="/" className="back-to-store">
          <ArrowLeft size={16} /> Back to Store
        </Link>

        <div className="product-detail-grid">
          <div className="product-gallery">
            <div className="main-image-box">
              {discount && <span className="detail-discount-badge">{discount}% OFF</span>}
              <img src={activeImage || main_image} alt={name} />
            </div>
            {allImages.length > 1 && (
              <div className="thumbnail-row">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`thumbnail ${activeImage === img ? 'active' : ''}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} alt={`${name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info-panel">
            {category_id?.name && (
              <span className="product-category-tag">{category_id.name}</span>
            )}
            <h1 className="product-detail-title">{name}</h1>
            {brand && <p className="product-brand">{brand}</p>}

            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#ffb703" color="#ffb703" />
                ))}
              </div>
              <span>(128 Reviews)</span>
            </div>

            <div className="product-pricing">
              {discount_price && (
                <span className="detail-original-price">Rs.{price}</span>
              )}
              <span className="detail-sale-price">Rs.{salePrice}</span>
            </div>

            {short_description && (
              <p className="product-short-desc">{short_description}</p>
            )}

            <div className="quantity-row">
              <span className="qty-label">Quantity</span>
              <div className="quantity-controls">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(stock_quantity || 99, q + 1))}
                  disabled={quantity >= (stock_quantity || 99)}
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="stock-info">
                {stock_quantity > 0 ? `${stock_quantity} in stock` : 'Out of stock'}
              </span>
            </div>

            <button
              type="button"
              className={`add-to-cart-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={!stock_quantity}
            >
              <ShoppingBag size={20} />
              {added ? 'Added to Cart!' : stock_quantity ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {skin_type.length > 0 && (
              <div className="product-tags">
                <span className="tags-label">Skin Type:</span>
                {skin_type.map((type) => (
                  <span key={type} className="tag">
                    {type}
                  </span>
                ))}
              </div>
            )}

            {concerns.length > 0 && (
              <div className="product-tags">
                <span className="tags-label">Concerns:</span>
                {concerns.map((c) => (
                  <span key={c} className="tag">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="product-detail-tabs">
          {description && (
            <section className="detail-section">
              <h2>Description</h2>
              <p>{description}</p>
            </section>
          )}
          {benefits && (
            <section className="detail-section">
              <h2>Benefits</h2>
              <p>{benefits}</p>
            </section>
          )}
          {ingredients && (
            <section className="detail-section">
              <h2>Ingredients</h2>
              <p>{ingredients}</p>
            </section>
          )}
          {how_to_use && (
            <section className="detail-section">
              <h2>How to Use</h2>
              <p>{how_to_use}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
