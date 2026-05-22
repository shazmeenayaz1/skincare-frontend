import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 1,
      name: 'Organic Face Serum',
      description: 'Vitamin C & Hyaluronic Acid',
      price: 49.99,
      quantity: 1,
      image: '/serum1.png'
    },
    {
      id: 2,
      name: 'Hydrating Face Cream',
      description: 'Daily Moisturizer for All Skin Types',
      price: 34.99,
      quantity: 2,
      image: '/cream.png'
    }
  ],
  totalQuantity: 3,
  subtotal: 119.97,
  isDrawerOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      if (!existingItem) {
        state.items.push({ ...newItem, quantity: 1 });
      } else {
        existingItem.quantity++;
      }
      state.totalQuantity++;
      state.subtotal += newItem.price;
      state.isDrawerOpen = true; // Automatically open drawer when item added
    },
    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.subtotal -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter(item => item.id !== id);
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem && quantity > 0) {
        const diff = quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        state.totalQuantity += diff;
        state.subtotal += existingItem.price * diff;
      }
    },
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    openDrawer: (state) => {
      state.isDrawerOpen = true;
    }
  }
});

export const { addItem, removeItem, updateQuantity, toggleDrawer, closeDrawer, openDrawer } = cartSlice.actions;
export default cartSlice.reducer;
