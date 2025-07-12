/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_BASE = "http://localhost:7000/api/auth";

// REGISTER USER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post(`${API_BASE}/register`, userData, {
        withCredentials: true,
      });
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Registration failed"
      );
    }
  }
);

// LOGIN USER
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const res = await axios.post(`${API_BASE}/login`, credentials, {
        withCredentials: true,
      });
      console.log("Login response data:", res.data);

      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Login failed"
      );
    }
  }
);

// GET CURRENT USER
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_BASE}/me`);
      return res.data.user;
    } catch (err) {
      // Try refresh token if 401
      if (err.response?.status === 401) {
        try {
          await thunkAPI.dispatch(refreshToken()).unwrap();
          const retryRes = await axios.get(`${API_BASE}/me`);
          return retryRes.data.user;
        } catch (refreshErr) {
          return thunkAPI.rejectWithValue(
            "Session expired. Please log in again."
          );
        }
      }
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch user"
      );
    }
  }
);

// REFRESH TOKEN
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    try {
      await axios.post(`${API_BASE}/refresh`, {}, { withCredentials: true });
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue("Token refresh failed");
    }
  }
);

// SLICE
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH CURRENT USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })

      // REFRESH TOKEN
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
