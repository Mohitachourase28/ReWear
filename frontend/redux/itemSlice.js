import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// ✅ Async thunk: Upload images to Cloudinary
export const uploadImagesToCloudinary = createAsyncThunk(
  "item/uploadImages",
  async (images, { rejectWithValue }) => {
    try {
      const uploadedUrls = [];

      for (const files of images) {
        const data = new FormData();
        data.append("file", files);
        data.append("upload_preset", "ReWear"); // ✅ Must be an unsigned preset

        // ✅ Axios will automatically handle correct headers for FormData
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dnp677qpf/image/upload",
          data,
          {
            withCredentials: false, // 🚨 Must be false
          }
        );

        uploadedUrls.push(res.data.secure_url);
      }

      return uploadedUrls;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      console.log("🔍 Full Cloudinary error response:", err.response?.data); // 👈 Add this line
      return rejectWithValue(
        err.response?.data?.error?.message || "Image upload failed"
      );
    }
  }
);
// Async thunk: Submit item data to backend
export const submitItem = createAsyncThunk(
  "item/submitItem",
  async ({ formData, imageUrls, uploader }, { rejectWithValue }) => {
    try {
      const payload = {
        ...formData,
        uploader,
        images: imageUrls,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      };
      console.log("📤 Sending item payload:", payload);
      const response = await axios.post("/api/items", payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Item submission failed"
      );
    }
  }
);

// Initial form state
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

// Item slice
const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    updateForm(state, action) {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    resetForm() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload to Cloudinary
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

      // Submit item to backend
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
