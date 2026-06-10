import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatPrice } from '../../utils/cartUtils';
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  MapPin, 
  CreditCard, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  ArrowRight,
  Info
} from 'lucide-react';
import './MyOrders.css';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        setError('');
        // Request orders filtered by the logged-in user's email
        const data = await api(`/orders/get?email=${encodeURIComponent(user.email)}`);
        setOrders(data);
        // Pre-expand the most recent order if available
        if (data && data.length > 0) {
          setExpandedOrderId(data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
        setError('Could not retrieve your orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate]);

  const toggleExpandOrder = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  // Helper to determine the active step of tracking progress
  // Steps: 0: Placed, 1: Out for Delivery, 2: Delivered, -1: Cancelled
  const getTrackingStep = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Out for Delivery': return 1;
      case 'Delivered': return 2;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  if (!user) return null;

  return (
    <div className="my-orders-page animate-fade-in">
      <div className="my-orders-container">
        
        {/* Breadcrumbs / Header */}
        <div className="my-orders-header">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <ArrowRight size={12} />
            <span>My Orders</span>
          </div>
          <h1>My Orders & Tracking</h1>
          <p className="subtitle">Track active orders, view past purchases, and manage shipments.</p>
        </div>

        {error && (
          <div className="error-alert">
            <Info size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="orders-loading-state">
            <Loader2 size={40} className="animate-spin spin-icon" />
            <p>Retrieving your order details...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders-state glass-card">
            <div className="empty-icon-wrapper">
              <ShoppingBag size={48} />
            </div>
            <h2>No Orders Found</h2>
            <p>It looks like you haven't placed any orders yet. Explore our premium skincare products to begin your beauty journey!</p>
            <Link to="/shop" className="shop-btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              const step = getTrackingStep(order.status);
              
              return (
                <div key={order._id} className={`order-card glass-card ${isExpanded ? 'expanded' : ''}`}>
                  
                  {/* Order Summary Header (Always Visible) */}
                  <div className="order-summary-header" onClick={() => toggleExpandOrder(order._id)}>
                    <div className="summary-left">
                      <div className="order-main-info">
                        <span className="order-lbl">Order ID</span>
                        <span className="order-val-id">{order.orderId}</span>
                      </div>
                      <div className="order-sub-info">
                        <span className="info-pill date-pill">
                          <Calendar size={12} />
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="info-pill price-pill">
                          Total: <strong>{formatPrice(order.total)}</strong>
                        </span>
                      </div>
                    </div>
                    
                    <div className="summary-right">
                      <span className={`status-badge-my-orders badge-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {order.status}
                      </span>
                      <button className="collapse-toggle-btn" type="button">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content: Tracking & Product Details */}
                  {isExpanded && (
                    <div className="order-expanded-details animate-fade-in">
                      
                      {/* Tracking Section */}
                      <div className="tracking-section">
                        <h3>Track My Order</h3>
                        {step === -1 ? (
                          <div className="cancelled-tracking-alert">
                            <XCircle size={24} />
                            <div>
                              <h4>Order Cancelled</h4>
                              <p>This order has been cancelled and is no longer being processed.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="tracking-timeline-stepper">
                            
                            {/* Step 1: Placed */}
                            <div className={`stepper-step ${step >= 0 ? 'completed' : ''} ${step === 0 ? 'active' : ''}`}>
                              <div className="step-icon-outer">
                                <Package size={18} />
                              </div>
                              <div className="step-info">
                                <span className="step-title">Order Placed</span>
                                <span className="step-desc">Received & processing</span>
                              </div>
                            </div>

                            {/* Connecting Line 1 */}
                            <div className={`stepper-line ${step >= 1 ? 'completed' : ''}`}></div>

                            {/* Step 2: Out for Delivery */}
                            <div className={`stepper-step ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>
                              <div className="step-icon-outer">
                                <Truck size={18} />
                              </div>
                              <div className="step-info">
                                <span className="step-title">Out for Delivery</span>
                                <span className="step-desc">Shipped with courier</span>
                              </div>
                            </div>

                            {/* Connecting Line 2 */}
                            <div className={`stepper-line ${step >= 2 ? 'completed' : ''}`}></div>

                            {/* Step 3: Delivered */}
                            <div className={`stepper-step ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>
                              <div className="step-icon-outer">
                                <CheckCircle size={18} />
                              </div>
                              <div className="step-info">
                                <span className="step-title">Delivered</span>
                                <span className="step-desc">Arrival & drop-off</span>
                              </div>
                            </div>

                          </div>
                        )}
                      </div>

                      {/* Info & Summary Split Grid */}
                      <div className="order-details-grid">
                        
                        {/* Delivery Info */}
                        <div className="details-card-sub delivery-info-card">
                          <h4><MapPin size={16} /> Shipping Details</h4>
                          <div className="meta-lines">
                            <p><strong>Recipient:</strong> {order.customer?.name}</p>
                            <p><strong>Phone:</strong> {order.customer?.phone}</p>
                            <p><strong>Email:</strong> {order.customer?.email}</p>
                            <p><strong>Address:</strong> {order.customer?.address}</p>
                            <p><strong>City:</strong> {order.customer?.city}</p>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="details-card-sub payment-info-card">
                          <h4><CreditCard size={16} /> Payment Information</h4>
                          <div className="meta-lines">
                            <p>
                              <strong>Method:</strong>{' '}
                              <span className="pay-method-txt">
                                {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Credit / Debit Card'}
                              </span>
                            </p>
                            {order.paymentMethod === 'card' && (
                              <>
                                {order.paymentStatus === 'paid' && (
                                  <p><strong>Status:</strong> <span style={{ color: '#16a34a' }}>Paid via Stripe</span></p>
                                )}
                                {order.cardDetails && (
                                  <p>
                                    <strong>Card:</strong> {order.cardDetails.name} ({order.cardDetails.number})
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* Items Details List */}
                      <div className="order-items-listing">
                        <h4>Items Ordered</h4>
                        <div className="items-list-container">
                          {order.items?.map((item, index) => (
                            <div key={index} className="item-row">
                              <div className="item-image-wrapper">
                                <img 
                                  src={item.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150'} 
                                  alt={item.name} 
                                />
                              </div>
                              <div className="item-description">
                                <span className="item-name">{item.name}</span>
                                <span className="item-pricing">
                                  {formatPrice(item.price)} × {item.quantity}
                                </span>
                              </div>
                              <div className="item-total-cost">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Financial summary calculations */}
                      <div className="financial-summary-box">
                        <div className="row-fin">
                          <span>Subtotal</span>
                          <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="row-fin">
                          <span>Shipping</span>
                          <span>{formatPrice(order.shipping)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="row-fin discount-row">
                            <span>Discount ({order.couponCode || 'Promo'})</span>
                            <span>-{formatPrice(order.discount)}</span>
                          </div>
                        )}
                        <div className="row-fin grand-total-fin">
                          <span>Grand Total</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrders;
