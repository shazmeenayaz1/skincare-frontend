import React from 'react';
import { useSelector } from 'react-redux';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/cartUtils';
import './Checkout.css';

const Checkout = () => {
  const { items, subtotal } = useSelector((state) => state.cart);
  const shipping = items.length > 0 ? 250 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h1>Your cart is empty</h1>
          <p>Add some products before checking out.</p>
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <header className="checkout-header">
          <div className="header-left">
            <h1>Checkout</h1>
          </div>
          <div className="header-right">
            <Link to="/" className="back-link">
              <ArrowLeft size={16} /> Back to Store
            </Link>
            <button className="sign-in-btn">Sign In</button>
          </div>
        </header>

        <div className="checkout-grid">
          {/* 1. Shipping Address */}
          <section className="checkout-section shipping-address">
            <div className="section-title">
              <span className="step-number">1</span>
              <h2>Shipping Address</h2>
            </div>
            <form className="checkout-form">
              <div className="form-group full">
                <label>Email Address *</label>
                <input type="email" placeholder="stan@firecheckout.net" />
              </div>
              
              <div className="checkbox-group">
                <input type="checkbox" id="create-account" />
                <label htmlFor="create-account">Create an Account</label>
              </div>
              
              <div className="checkbox-group">
                <input type="checkbox" id="subscribe" />
                <label htmlFor="subscribe">Subscribe to Newsletter</label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input type="text" />
                </div>
              </div>

              <div className="form-group full">
                <label>Street Address: Line 1 *</label>
                <input type="text" />
              </div>

              <div className="form-group full">
                <label>Street Address: Line 2</label>
                <input type="text" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Country *</label>
                  <select>
                    <option>United States</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>State/Province *</label>
                  <select>
                    <option>California</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label>Zip/Postal Code *</label>
                  <input type="text" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" />
                </div>
                <div className="form-group">
                  <label>VAT Number</label>
                  <input type="text" />
                </div>
              </div>
            </form>
          </section>

          <div className="checkout-middle-col">
            {/* 2. Shipping Methods */}
            <section className="checkout-section shipping-methods">
              <div className="section-title">
                <span className="step-number">2</span>
                <h2>Shipping Methods</h2>
              </div>
              <div className="options-list">
                <label className="option-item">
                  <input type="radio" name="shipping" value="0" />
                  <div className="option-details">
                    <span className="option-price">$0.00</span>
                    <span className="option-name">Table Rate</span>
                    <span className="option-desc">Best Way</span>
                  </div>
                </label>
                <label className="option-item">
                  <input type="radio" name="shipping" value="10" defaultChecked />
                  <div className="option-details">
                    <span className="option-price">$10.00</span>
                    <span className="option-name">Fixed</span>
                    <span className="option-desc">Flat Rate</span>
                  </div>
                </label>
              </div>
              <div className="delivery-date-picker">
                <label>Delivery Date</label>
                <input type="date" />
              </div>
            </section>

            {/* 3. Payment Method */}
            <section className="checkout-section payment-method">
              <div className="section-title">
                <span className="step-number">3</span>
                <h2>Payment Method</h2>
              </div>
              <div className="options-list">
                <label className="option-item">
                  <input type="radio" name="payment" value="check" defaultChecked />
                  <div className="option-details">
                    <span className="option-name">Check / Money order</span>
                  </div>
                </label>
                <label className="option-item">
                  <input type="radio" name="payment" value="po" />
                  <div className="option-details">
                    <span className="option-name">Purchase Order</span>
                  </div>
                </label>
                <label className="option-item">
                  <input type="radio" name="payment" value="cod" />
                  <div className="option-details">
                    <span className="option-name">Cash On Delivery</span>
                  </div>
                </label>
                <label className="option-item paypal">
                  <input type="radio" name="payment" value="paypal" />
                  <div className="option-details">
                    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" />
                    <span className="option-name">PayPal Express Checkout</span>
                  </div>
                </label>
              </div>
              <div className="extra-options">
                <button className="extra-btn">APPLY DISCOUNT CODE <ChevronRight size={14} /></button>
                <button className="extra-btn">ATTACHMENTS <ChevronRight size={14} /></button>
                <button className="extra-btn">GIFT OPTIONS <ChevronRight size={14} /></button>
              </div>
            </section>
          </div>

          {/* 4. Order Summary */}
          <section className="checkout-section order-summary">
            <div className="section-title">
              <span className="step-number">4</span>
              <h2>Order Summary</h2>
            </div>
            
            <div className="items-in-cart">
              <button className="toggle-items">{items.length} ITEMS IN CART <ChevronRight size={14} /></button>
              <div className="summary-items-list">
                {items.map(item => (
                  <div key={item.id} className="summary-item">
                    <div className="summary-item-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="summary-item-info">
                      <h3>{item.name}</h3>
                      {item.sku && (
                        <p className="summary-item-sku">SKU: {item.sku}</p>
                      )}
                      <div className="summary-item-qty">
                        <span>{item.quantity}</span>
                        <div className="qty-arrows">
                          <ChevronRight size={12} className="up" />
                          <ChevronRight size={12} className="down" />
                        </div>
                      </div>
                      <p className="summary-item-price">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Cart Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="total-row">
                <span>Shipping <small>Flat Rate</small></span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="total-row grand-total">
                <div className="grand-label">
                  <strong>Order Total</strong>
                </div>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>

            <button className="place-order-btn">Place Order</button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
