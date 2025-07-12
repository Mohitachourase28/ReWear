// src/redux/adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set default config for axios to send cookies
axios.defaults.withCredentials = true;

const API = "http://localhost:7000/api/admin/users";

// Async Thunks
export const fetchPendingItems = createAsyncThunk(
  "admin/fetchPendingItems",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API}/pending-items`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const approveItem = createAsyncThunk(
  "admin/approveItem",
  async (id, thunkAPI) => {
    try {
      await axios.patch(`${API}/approve/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const rejectItem = createAsyncThunk(
  "admin/rejectItem",
  async (id, thunkAPI) => {
    try {
      await axios.patch(`${API}/reject/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API); // already http://localhost:7000/api/users
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API}/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAllListings = createAsyncThunk(
  "admin/fetchAllListings",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API}/all-items`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    pendingItems: [],
    users: [],
    allItems: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })

      // Pending Items
      .addCase(fetchPendingItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingItems.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingItems = action.payload;
      })
      .addCase(fetchPendingItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch items";
      })

      // Approve & Reject Items
      .addCase(approveItem.fulfilled, (state, action) => {
        state.pendingItems = state.pendingItems.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(rejectItem.fulfilled, (state, action) => {
        state.pendingItems = state.pendingItems.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(fetchAllListings.fulfilled, (state, action) => {
        state.allItems = action.payload;
      });
  },
});

export default adminSlice.reducer;
