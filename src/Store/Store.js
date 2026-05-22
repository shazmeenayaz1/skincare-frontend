import { configureStore } from '@reduxjs/toolkit';
import bannerReducer from '../features/bannerSlice';
import categoryReducer from '../features/categorySlice';
import productReducer from '../features/productSlice';
import cartReducer from '../features/cartSlice';

export const store = configureStore({
  reducer: {
    banners: bannerReducer,
    categories: categoryReducer,
    products: productReducer,
    cart: cartReducer,
  },
});
