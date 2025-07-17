// store/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch all products
export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const response = await axios.get("/api/items");
  return response.data;
});

// ✅ Fetch single product by ID
export const fetchItemById = createAsyncThunk(
  "products/fetchById",
  async (id) => {
    const response = await axios.get(`/api/items/${id}`);
    return response.data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // All products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load products";
      })

      // Single product
      .addCase(fetchItemById.pending, (state) => {
        state.loading = true;
        state.selectedProduct = null;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchItemById.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load product details";
      });
  },
});

export default productsSlice.reducer;
