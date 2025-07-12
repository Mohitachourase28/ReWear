/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk: Upload images to Cloudinary
export const uploadImagesToCloudinary = createAsyncThunk(
  "item/uploadImages",
  async (images, { rejectWithValue }) => {
    try {
      const uploadedUrls = [];

      for (const file of images) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "ReWear");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dnp677qpf/image/upload",
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            // ❌ Do NOT include withCredentials: true unless you know you need it
          }
        );

        uploadedUrls.push(res.data.secure_url);
      }

      return uploadedUrls;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || "Upload failed");
    }
  }
);

// Async thunk: Submit item to backend
export const submitItem = createAsyncThunk(
  "item/submitItem",
  async ({ formData, imageUrls, uploader }, { rejectWithValue }) => {
    try {
      const payload = {
        ...formData,
        uploader,
        images: imageUrls,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const response = await axios.post("/api/items", payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Submission failed");
    }
  }
);

// Initial state
const initialState = {
  formData: {
    title: "",
    description: "",
    category: "",
    type: "",
    size: "",
    condition: "",
    tags: "",
  },
  imageUrls: [],
  uploading: false,
  submitting: false,
  error: null,
  success: false,
};

// Slice
const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    updateForm(state, action) {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    // Removed setImages to avoid storing File objects in Redux
    resetForm(state) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImagesToCloudinary.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadImagesToCloudinary.fulfilled, (state, action) => {
        state.uploading = false;
        state.imageUrls = action.payload;
      })
      .addCase(uploadImagesToCloudinary.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload || "Image upload failed";
      })

      .addCase(submitItem.pending, (state) => {
        state.submitting = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitItem.fulfilled, (state) => {
        state.submitting = false;
        state.success = true;
      })
      .addCase(submitItem.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Item submission failed";
      });
  },
});

export const { updateForm, resetForm } = itemSlice.actions;
export default itemSlice.reducer;
