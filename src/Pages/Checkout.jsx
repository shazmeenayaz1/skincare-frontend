import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { formatPrice } from '../utils/cartUtils';
import { clearCart } from '../features/cartSlice';
import { useAuth } from '../context/AuthContext';
import StripeCardPayment from '../Components/StripeCardPayment';
import api from '../utils/api';
import './Checkout.css';

const Checkout = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, subtotal } = useSelector((state) => state.cart);
  const shipping = items.length > 0 ? 250 : 0;

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const total = Math.max(0, subtotal - discount + shipping);

  const { user } = useAuth();

  const [customer, setCustomer] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: ''
  });

  useEffect(() => {
    if (user) {
      setCustomer(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    const handleRedirectResult = async () => {
      const paymentIntentId = searchParams.get('payment_intent');
      const redirectStatus = searchParams.get('redirect_status');

      if (paymentIntentId && redirectStatus === 'succeeded') {
        const savedDataStr = sessionStorage.getItem('pending_checkout_data');
        if (savedDataStr) {
          try {
            setLoading(true);
            const savedData = JSON.parse(savedDataStr);
            
            const payload = {
              customer: savedData.customer,
              items: savedData.items,
              paymentMethod: 'card',
              stripePaymentIntentId: paymentIntentId,
              subtotal: savedData.subtotal,
              shipping: savedData.shipping,
              discount: savedData.discount,
              couponCode: savedData.appliedCoupon || undefined,
              total: savedData.total
            };

            const response = await api('/orders/post', {
              method: 'POST',
              body: payload
            });

            if (response.success) {
              setPlacedOrder(response.order);
              dispatch(clearCart());
              sessionStorage.removeItem('pending_checkout_data');
              setSearchParams({}, { replace: true });
            } else {
              setError(response.message || 'Failed to place order. Please contact support.');
            }
          } catch (err) {
            console.error('Error processing redirected order:', err);
            setError('An error occurred while placing your order after payment.');
          } finally {
            setLoading(false);
          }
        } else {
          setError('Payment details were found but checkout information was missing. Please contact support.');
        }
      } else if (redirectStatus && redirectStatus !== 'succeeded') {
        setError('Payment was not successful. Please try again.');
        sessionStorage.removeItem('pending_checkout_data');
        setSearchParams({}, { replace: true });
      }
    };

    handleRedirectResult();
  }, [searchParams, setSearchParams, dispatch]);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (code === 'GLOW10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      setAppliedCoupon(code);
      setCouponSuccess(`Coupon 'GLOW10' applied! You saved 10% (${formatPrice(disc)}).`);
    } else if (code === 'GLOW20') {
      const disc = Math.round(subtotal * 0.2);
      setDiscount(disc);
      setAppliedCoupon(code);
      setCouponSuccess(`Coupon 'GLOW20' applied! You saved 20% (${formatPrice(disc)}).`);
    } else if (code === 'FREE500') {
      const disc = Math.min(subtotal, 500);
      setDiscount(disc);
      setAppliedCoupon(code);
      setCouponSuccess(`Coupon 'FREE500' applied! You saved flat ${formatPrice(disc)}.`);
    } else {
      setCouponError('Invalid coupon code. Try GLOW10, GLOW20, or FREE500.');
      setDiscount(0);
      setAppliedCoupon('');
    }
  };

  const validateShipping = () => {
    if (!customer.name || !customer.phone || !customer.email || !customer.address || !customer.city) {
      setError('Please fill in all shipping details.');
      return false;
    }
    return true;
  };

  const submitOrder = useCallback(async (stripePaymentIntentId = null) => {
    const orderItems = items.map(item => ({
      product: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    const payload = {
      customer,
      items: orderItems,
      paymentMethod,
      stripePaymentIntentId: paymentMethod === 'card' ? stripePaymentIntentId : undefined,
      subtotal,
      shipping,
      discount,
      couponCode: appliedCoupon || undefined,
      total
    };

    const response = await api('/orders/post', {
      method: 'POST',
      body: payload
    });

    if (response.success) {
      setPlacedOrder(response.order);
      dispatch(clearCart());
      sessionStorage.removeItem('pending_checkout_data');
    } else {
      setError(response.message || 'Failed to place order. Please try again.');
    }
  }, [items, customer, paymentMethod, subtotal, shipping, discount, appliedCoupon, total, dispatch]);

  const handleStripePaymentSuccess = async (paymentIntentId) => {
    try {
      await submitOrder(paymentIntentId);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Payment succeeded but order creation failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateShipping()) {
      return;
    }

    if (paymentMethod === 'card') {
      setLoading(true);
      // Save checkout details to sessionStorage in case Stripe redirects
      sessionStorage.setItem('pending_checkout_data', JSON.stringify({
        customer,
        items: items.map(item => ({
          product: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        paymentMethod: 'card',
        subtotal,
        shipping,
        discount,
        appliedCoupon,
        total
      }));

      const stripeForm = document.getElementById('stripe-payment-form');
      if (stripeForm) {
        stripeForm.requestSubmit();
      } else {
        setError('Payment form is still loading. Please wait a moment.');
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      await submitOrder();
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while placing your order.');
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="checkout-page animate-fade-in">
        <div className="checkout-success-container">
          <div className="success-icon-wrapper">
            <Check size={40} />
          </div>
          <h1>Order Placed!</h1>
          <p>Thank you for shopping with us. Your order is being processed.</p>

          <div className="success-details-card">
            <div className="success-detail-row">
              <span>Order Number:</span>
              <strong>{placedOrder.orderId}</strong>
            </div>
            <div className="success-detail-row">
              <span>Customer Name:</span>
              <strong>{placedOrder.customer?.name}</strong>
            </div>
            <div className="success-detail-row">
              <span>Delivery Address:</span>
              <strong>{placedOrder.customer?.address}, {placedOrder.customer?.city}</strong>
            </div>
            <div className="success-detail-row">
              <span>Payment Method:</span>
              <strong>{placedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card (Stripe)'}</strong>
            </div>
            {placedOrder.paymentMethod === 'card' && placedOrder.paymentStatus === 'paid' && (
              <div className="success-detail-row">
                <span>Payment Status:</span>
                <strong style={{ color: '#16a34a' }}>Paid</strong>
              </div>
            )}
            <div className="success-detail-row">
              <span>Total Amount:</span>
              <strong>{formatPrice(placedOrder.total)}</strong>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/" className="primary-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1.5px solid #ef4444',
            color: '#ef4444',
            padding: '1rem',
            borderRadius: 'var(--store-radius)',
            marginBottom: '2rem',
            fontWeight: 500,
            fontSize: '0.95rem'
          }} className="animate-fade-in">
            {error}
          </div>
        )}

        <form className="checkout-grid" onSubmit={handlePlaceOrder}>
          <section className="checkout-section shipping-address animate-fade-in">
            <div className="section-title">
              <span className="step-number">1</span>
              <h2>Shipping Details</h2>
            </div>
            <div className="checkout-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Ayesha Khan"
                  value={customer.name}
                  onChange={handleCustomerChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g. 03001234567"
                    value={customer.phone}
                    onChange={handleCustomerChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. ayesha@email.com"
                    value={customer.email}
                    onChange={handleCustomerChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Complete Address *</label>
                <input
                  type="text"
                  name="address"
                  placeholder="House/Apartment #, Street, Block, Area"
                  value={customer.address}
                  onChange={handleCustomerChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Karachi, Lahore, Islamabad"
                  value={customer.city}
                  onChange={handleCustomerChange}
                  required
                />
              </div>
            </div>
          </section>

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
                  <span className="option-desc">Pay securely online via Stripe (Visa/Mastercard)</span>
                </div>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-input-form stripe-payment-wrapper animate-fade-in">
                <p className="stripe-secure-note">Your card details are processed securely by Stripe.</p>
                <StripeCardPayment
                  amount={total}
                  email={customer.email}
                  onPaymentSuccess={handleStripePaymentSuccess}
                  onError={setError}
                  loading={loading}
                  setLoading={setLoading}
                />
              </div>
            )}
          </section>

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

            <div className="coupon-section" style={{
              background: 'rgba(255, 255, 255, 0.5)',
              border: '1.5px dashed var(--store-border)',
              padding: '1.25rem',
              borderRadius: 'var(--store-radius)',
              marginBottom: '1.5rem',
              marginTop: '1.5rem'
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--store-text)' }}>Have a Promo Code?</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="e.g. GLOW10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1.5px solid var(--store-border)',
                    borderRadius: 'var(--store-radius)',
                    outline: 'none',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    backgroundColor: 'white'
                  }}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  style={{
                    backgroundColor: 'var(--store-primary)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 'var(--store-radius)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Apply
                </button>
              </div>
              {couponError && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.4rem', fontWeight: 500 }}>{couponError}</p>}
              {couponSuccess && <p style={{ color: '#16a34a', fontSize: '0.75rem', marginTop: '0.4rem', fontWeight: 500 }}>{couponSuccess}</p>}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Cart Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="total-row discount-row" style={{ color: '#16a34a', fontWeight: 500 }}>
                  <span>Discount ({appliedCoupon})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
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

            <button
              type="submit"
              className="place-order-btn"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading
                ? 'Processing...'
                : paymentMethod === 'card'
                  ? `Pay ${formatPrice(total)}`
                  : 'Place Order'}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
