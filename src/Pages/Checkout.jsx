import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronRight, ArrowLeft, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/cartUtils';
import './Checkout.css';

const Checkout = () => {
  const { items, subtotal } = useSelector((state) => state.cart);
  const shipping = items.length > 0 ? 250 : 0;
  const total = subtotal + shipping;

  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  // Card details state for premium interactive experience
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'number') {
      // Keep only digits and insert space every 4 digits
      const digits = value.replace(/\D/g, '');
      formattedValue = digits.substring(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (name === 'expiry') {
      // Format MM/YY
      const digits = value.replace(/\D/g, '');
      if (digits.length >= 2) {
        formattedValue = `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
      } else {
        formattedValue = digits;
      }
    } else if (name === 'cvv') {
      // Max 3 digits for CVV
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }
    
    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

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
          </div>
        </header>

        <div className="checkout-grid">
          {/* Step 1: Shipping Address */}
          <section className="checkout-section shipping-address animate-fade-in">
            <div className="section-title">
              <span className="step-number">1</span>
              <h2>Shipping Details</h2>
            </div>
            <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" placeholder="e.g. Ayesha Khan" required />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" placeholder="e.g. 03001234567" required />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" placeholder="e.g. ayesha@email.com" required />
                </div>
              </div>

              <div className="form-group">
                <label>Complete Address *</label>
                <input type="text" placeholder="House/Apartment #, Street, Block, Area" required />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input type="text" placeholder="e.g. Karachi, Lahore, Islamabad" required />
              </div>
            </form>
          </section>

          {/* Step 2: Payment Method */}
          <section className="checkout-section payment-method animate-fade-in">
            <div className="section-title">
              <span className="step-number">2</span>
              <h2>Payment Method</h2>
            </div>
            <div className="options-list">
              <label className={`option-item ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod" 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => setPaymentMethod('cod')} 
                />
                <div className="option-details">
                  <span className="option-name">Cash on Delivery (COD)</span>
                  <span className="option-desc">Pay with cash upon delivery of your parcel</span>
                </div>
              </label>

              <label className={`option-item ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="card" 
                  checked={paymentMethod === 'card'} 
                  onChange={() => setPaymentMethod('card')} 
                />
                <div className="option-details">
                  <span className="option-name">Debit / Credit Card</span>
                  <span className="option-desc">Pay securely online via Visa/Mastercard</span>
                </div>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-input-form animate-fade-in">
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Name on Card" 
                    value={cardDetails.name}
                    onChange={handleCardInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <div className="input-with-icon">
                    <input 
                      type="text" 
                      name="number" 
                      placeholder="0000 0000 0000 0000" 
                      value={cardDetails.number}
                      onChange={handleCardInputChange}
                      maxLength={19} 
                    />
                    <CreditCard size={18} className="input-icon" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input 
                      type="text" 
                      name="expiry" 
                      placeholder="MM/YY" 
                      value={cardDetails.expiry}
                      onChange={handleCardInputChange}
                      maxLength={5} 
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV / CVC</label>
                    <input 
                      type="password" 
                      name="cvv" 
                      placeholder="123" 
                      value={cardDetails.cvv}
                      onChange={handleCardInputChange}
                      maxLength={3} 
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Step 3: Order Summary */}
          <section className="checkout-section order-summary animate-fade-in">
            <div className="section-title">
              <span className="step-number">3</span>
              <h2>Order Summary</h2>
            </div>
            
            <div className="items-in-cart">
              <div className="summary-items-header">
                <span>{items.length} ITEMS IN CART</span>
              </div>
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
                        <span>Qty: {item.quantity}</span>
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
