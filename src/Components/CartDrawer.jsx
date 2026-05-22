import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { closeDrawer, updateQuantity, removeItem } from '../features/cartSlice';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css';

const CartDrawer = () => {
  const { items, subtotal, isDrawerOpen, totalQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => dispatch(closeDrawer());
  
  const handleCheckout = () => {
    dispatch(closeDrawer());
    navigate('/checkout');
  };

  if (!isDrawerOpen) return null;

  return (
    <div className={`cart-drawer-overlay ${isDrawerOpen ? 'open' : ''}`} onClick={handleClose}>
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        <header className="drawer-header">
          <h2>Your Cart ({totalQuantity})</h2>
          <button className="close-drawer-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </header>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="empty-drawer">
              <ShoppingBag size={48} />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="drawer-items">
              {items.map((item) => (
                <div key={item.id} className="drawer-item">
                  <div className="drawer-item-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="drawer-item-info">
                    <h3>{item.name}</h3>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                    <div className="drawer-quantity">
                      <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button className="drawer-remove" onClick={() => dispatch(removeItem(item.id))}>
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
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <p className="shipping-note">Shipping & taxes calculated at checkout</p>
          <button 
            className="drawer-checkout-btn" 
            disabled={items.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </button>
          <button className="drawer-continue-btn" onClick={handleClose}>
            Continue Shopping
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CartDrawer;
