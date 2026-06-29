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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // FormData is non-serializable — ignore it in banner thunk actions
        ignoredActions: [
          'banners/createBanner/pending',
          'banners/createBanner/fulfilled',
          'banners/createBanner/rejected',
          'banners/updateBanner/pending',
          'banners/updateBanner/fulfilled',
          'banners/updateBanner/rejected',
        ],
      },
    }),
});
