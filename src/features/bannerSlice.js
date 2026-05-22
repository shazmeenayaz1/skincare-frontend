import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Fetch all banners
export const fetchBanners = createAsyncThunk(
  'banners/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api('/banners/get');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create banner
export const createBanner = createAsyncThunk(
  'banners/createBanner',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await api('/banners/post', {
        method: 'POST',
        body: formData,
      });
      return data.banner;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update banner
export const updateBanner = createAsyncThunk(
  'banners/updateBanner',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const data = await api(`/banners/update/${id}`, {
        method: 'PUT',
        body: formData,
      });
      return data.banner;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete banner
export const deleteBanner = createAsyncThunk(
  'banners/deleteBanner',
  async (id, { rejectWithValue }) => {
    try {
      await api(`/banners/delete/${id}`, {
        method: 'DELETE',
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bannerSlice = createSlice({
  name: 'banners',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Banners
      .addCase(fetchBanners.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create Banner
      .addCase(createBanner.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update Banner
      .addCase(updateBanner.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Banner
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default bannerSlice.reducer;
