import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api('/categories/get');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create category
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const data = await api('/categories/create', {
        method: 'POST',
        body: categoryData,
      });
      return data.category;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const data = await api(`/categories/update/${id}`, {
        method: 'PUT',
        body: categoryData,
      });
      return data.category;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await api(`/categories/delete/${id}`, {
        method: 'DELETE',
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
