// redux/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_BASE = "http://localhost:7000/api/user";

// GET USER PROFILE
export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_BASE}/profile`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed to fetch profile");
    }
  }
);

// UPDATE USER PROFILE
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (profileData, thunkAPI) => {
    try {
      const res = await axios.put(`${API_BASE}/profile`, profileData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed to update profile");
    }
  }
);

// UPLOAD ITEM
export const uploadItem = createAsyncThunk(
  "user/uploadItem",
  async (itemData, thunkAPI) => {
    try {
      const formData = new FormData();
      Object.entries(itemData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed to upload item");
    }
  }
);

// GET USER'S UPLOADED ITEMS
export const getUserItems = createAsyncThunk(
  "user/getUserItems",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_BASE}/my-items`);
      return res.data.items;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed to fetch items");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUserState: (state) => {
      state.profile = null;
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload Item
      .addCase(uploadItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload.item); // assuming `item` in response
      })
      .addCase(uploadItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Items
      .addCase(getUserItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getUserItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
