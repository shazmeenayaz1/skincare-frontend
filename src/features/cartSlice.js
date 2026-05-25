import { createSlice } from '@reduxjs/toolkit';
import {
  calcCartTotals,
  loadCartFromStorage,
  saveCartToStorage,
} from '../utils/cartUtils';

const stored = loadCartFromStorage();

const initialState = {
  items: stored.items,
  totalQuantity: stored.totalQuantity,
  subtotal: stored.subtotal,
  isDrawerOpen: false,
};

const persist = (state) => {
  saveCartToStorage(state.items);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const incoming = action.payload;
      const qty = Math.max(1, incoming.quantity || 1);
      const maxStock = incoming.maxStock ?? 99;
      const existingItem = state.items.find((item) => item.id === incoming.id);

      if (existingItem) {
        const newQty = Math.min(existingItem.quantity + qty, maxStock);
        const added = newQty - existingItem.quantity;
        if (added > 0) {
          existingItem.quantity = newQty;
          state.totalQuantity += added;
          state.subtotal += existingItem.price * added;
        }
      } else {
        const finalQty = Math.min(qty, maxStock);
        if (finalQty > 0) {
          state.items.push({ ...incoming, quantity: finalQty });
          state.totalQuantity += finalQty;
          state.subtotal += incoming.price * finalQty;
        }
      }

      state.isDrawerOpen = true;
      persist(state);
    },
    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.subtotal -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter((item) => item.id !== id);
        persist(state);
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (!existingItem) return;

      const maxStock = existingItem.maxStock ?? 99;

      if (quantity <= 0) {
        state.totalQuantity -= existingItem.quantity;
        state.subtotal -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        const cappedQty = Math.min(quantity, maxStock);
        const diff = cappedQty - existingItem.quantity;
        if (diff !== 0) {
          existingItem.quantity = cappedQty;
          state.totalQuantity += diff;
          state.subtotal += existingItem.price * diff;
        }
      }
      persist(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.subtotal = 0;
      persist(state);
    },
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    openDrawer: (state) => {
      state.isDrawerOpen = true;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  toggleDrawer,
  closeDrawer,
  openDrawer,
} = cartSlice.actions;

export const selectCartItemCount = (state) => state.cart.totalQuantity;
export const selectCartSubtotal = (state) => state.cart.subtotal;
export const selectIsInCart = (id) => (state) =>
  state.cart.items.some((item) => item.id === id);

export default cartSlice.reducer;
