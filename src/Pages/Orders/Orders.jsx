import React, { useState, useEffect } from 'react';
import { Search, Eye, X, Loader2, Calendar, MapPin, Phone, Mail, User, CreditCard } from 'lucide-react';
import api from '../../utils/api';
import { formatPrice } from '../../utils/cartUtils';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal details state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // Load orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api('/orders/get');
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatusId(orderId);
      const response = await api(`/orders/update-status/${orderId}`, {
        method: 'PUT',
        body: { status: newStatus }
      });

      if (response.success) {
        // Update local state
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        // If the updated order is currently viewed in detail modal, update that too
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        alert(response.message || 'Failed to update order status.');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'An error occurred while updating status.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Filter & Search logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.phone?.includes(searchQuery);

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get status class for style binding
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'badge-pending';
      case 'Out for Delivery': return 'badge-out';
      case 'Delivered': return 'badge-delivered';
      case 'Cancelled': return 'badge-cancelled';
      default: return '';
    }
  };

  return (
    <div className="orders-page animate-fade-in">
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1.5px solid #ef4444',
          color: '#ef4444',
          padding: '1rem',
          borderRadius: '12px',
          fontWeight: 500
        }}>
          {error}
        </div>
      )}

      {/* Toolbar: Search and status filters */}
      <div className="orders-toolbar">
        <div className="toolbar-left">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon-inside" />
            <input 
              type="text" 
              placeholder="Search by Order ID, customer, phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="orders-search-input"
            />
          </div>
        </div>
        <div className="toolbar-right">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter-select"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Table view */}
      <div className="orders-table-card">
        {loading ? (
          <div style={{ display: 'flex', minHeight: '350px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
            <Loader2 size={36} className="animate-spin" style={{ color: 'var(--accent-pink)' }} />
            <span style={{ color: 'var(--text-muted)' }}>Loading orders from database...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ display: 'flex', minHeight: '250px', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>CUSTOMER</th>
                  <th>DATE</th>
                  <th>CITY</th>
                  <th>TOTAL</th>
                  <th>PAYMENT</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <span className="order-id-txt">{order.orderId}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.customer?.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.customer?.phone}</div>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td>{order.customer?.city}</td>
                    <td>
                      <span className="total-txt">{formatPrice(order.total)}</span>
                    </td>
                    <td style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600 }}>
                      {order.paymentMethod}
                    </td>
                    <td>
                      {updatingStatusId === order._id ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Loader2 size={14} className="animate-spin" />
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Saving...</span>
                        </div>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`orders-status-select ${getStatusClass(order.status)}`}
                        >
                          <option value="Pending">PENDING</option>
                          <option value="Out for Delivery">OUT FOR DELIVERY</option>
                          <option value="Delivered">DELIVERED</option>
                          <option value="Cancelled">CANCELLED</option>
                        </select>
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="btn-details"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal Overlay */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header-section">
              <div className="modal-title-left">
                <h3>Order {selectedOrder.orderId} Details</h3>
                <span>Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="btn-close-modal">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body-scrollable">
              {/* Customer and Payment Info cards */}
              <div className="modal-grid-2">
                <div className="info-block-card">
                  <h4>Shipping Information</h4>
                  <div className="info-details-list">
                    <div className="info-detail-item">
                      <span className="info-label"><User size={10} style={{ marginRight: '4px' }} /> Name</span>
                      <span className="info-val">{selectedOrder.customer?.name}</span>
                    </div>
                    <div className="info-detail-item">
                      <span className="info-label"><Phone size={10} style={{ marginRight: '4px' }} /> Phone</span>
                      <span className="info-val">{selectedOrder.customer?.phone}</span>
                    </div>
                    <div className="info-detail-item">
                      <span className="info-label"><Mail size={10} style={{ marginRight: '4px' }} /> Email</span>
                      <span className="info-val">{selectedOrder.customer?.email}</span>
                    </div>
                    <div className="info-detail-item">
                      <span className="info-label"><MapPin size={10} style={{ marginRight: '4px' }} /> Address</span>
                      <span className="info-val">
                        {selectedOrder.customer?.address}, {selectedOrder.customer?.city}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="info-block-card">
                  <h4>Transaction & Order Status</h4>
                  <div className="info-details-list">
                    <div className="info-detail-item">
                      <span className="info-label"><CreditCard size={10} style={{ marginRight: '4px' }} /> Payment Method</span>
                      <span className="info-val" style={{ textTransform: 'uppercase' }}>
                        {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Credit Card'}
                      </span>
                    </div>
                    {selectedOrder.paymentMethod === 'card' && (
                      <>
                        {selectedOrder.paymentStatus === 'paid' && (
                          <div className="info-detail-item">
                            <span className="info-label">Payment Status</span>
                            <span className="info-val" style={{ color: '#16a34a' }}>Paid via Stripe</span>
                          </div>
                        )}
                        {selectedOrder.cardDetails && (
                          <div className="info-detail-item">
                            <span className="info-label">Card Details</span>
                            <span className="info-val">
                              {selectedOrder.cardDetails.name} ({selectedOrder.cardDetails.number})
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="info-detail-item" style={{ marginTop: '8px' }}>
                      <span className="info-label">Order Status</span>
                      <div style={{ marginTop: '4px' }}>
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                          className={`orders-status-select ${getStatusClass(selectedOrder.status)}`}
                          style={{ fontSize: '0.85rem' }}
                        >
                          <option value="Pending">PENDING</option>
                          <option value="Out for Delivery">OUT FOR DELIVERY</option>
                          <option value="Delivered">DELIVERED</option>
                          <option value="Cancelled">CANCELLED</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Ordered List */}
              <div className="order-items-summary">
                <h4>Items Ordered ({selectedOrder.items?.length || 0})</h4>
                <div className="items-rows-container">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="item-detail-row">
                      <div className="item-img-pill">
                        <img src={item.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150'} alt={item.name} />
                      </div>
                      <div className="item-main-desc">
                        <span className="item-title-txt">{item.name}</span>
                        <span className="item-meta-txt">
                          {formatPrice(item.price)} × {item.quantity}
                        </span>
                      </div>
                      <div className="item-pricing-txt">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost summaries */}
              <div className="cost-breakdown-card">
                <div className="cost-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="cost-row">
                  <span>Shipping Fee:</span>
                  <span>{formatPrice(selectedOrder.shipping)}</span>
                </div>
                <div className="cost-row grand-total">
                  <span>Grand Total:</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer-section">
              <button onClick={() => setSelectedOrder(null)} className="btn-secondary">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
