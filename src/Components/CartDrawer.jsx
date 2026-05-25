import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { closeDrawer, updateQuantity, removeItem } from '../features/cartSlice';
import { formatPrice } from '../utils/cartUtils';
import './CartDrawer.css';

const CartDrawer = () => {
  const { items, subtotal, isDrawerOpen, totalQuantity } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => dispatch(closeDrawer());

  const handleCheckout = () => {
    dispatch(closeDrawer());
    navigate('/checkout');
  };

  if (!isDrawerOpen) return null;

  return (
    <div
      className={`cart-drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
      onClick={handleClose}
    >
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        <header className="drawer-header">
          <h2>Your Cart ({totalQuantity})</h2>
          <button type="button" className="close-drawer-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </header>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="empty-drawer">
              <ShoppingBag size={48} />
              <p>Your cart is empty</p>
              <Link to="/" className="empty-cart-link" onClick={handleClose}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="drawer-items">
              {items.map((item) => (
                <div key={item.id} className="drawer-item">
                  <Link
                    to={`/product/${item.id}`}
                    className="drawer-item-img"
                    onClick={handleClose}
                  >
                    <img src={item.image} alt={item.name} />
                  </Link>
                  <div className="drawer-item-info">
                    <Link
                      to={`/product/${item.id}`}
                      className="drawer-item-name"
                      onClick={handleClose}
                    >
                      {item.name}
                    </Link>
                    {item.description && (
                      <p className="item-desc">{item.description}</p>
                    )}
                    <p className="item-price">{formatPrice(item.price)}</p>
                    <div className="drawer-quantity">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        disabled={item.quantity >= (item.maxStock ?? 99)}
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="item-line-total">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="drawer-remove"
                    onClick={() => dispatch(removeItem(item.id))}
                    aria-label="Remove item"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="drawer-footer">
          <div className="drawer-subtotal">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="shipping-note">Shipping calculated at checkout</p>
          <button
            type="button"
            className="drawer-checkout-btn"
            disabled={items.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </button>
          <button type="button" className="drawer-continue-btn" onClick={handleClose}>
            Continue Shopping
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CartDrawer;
