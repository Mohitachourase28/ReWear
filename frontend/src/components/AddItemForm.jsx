/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateForm,
  resetForm,
  uploadImagesToCloudinary,
  submitItem,
} from "../../redux/itemSlice.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddItemForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { formData, uploading, submitting } = useSelector(
    (state) => state.item
  );

  const [images, setImages] = useState([]); // ✅ Local image state

  const uploader = user?._id; // Replace with actual logged-in user ID

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateForm({ name, value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files); // ✅ Save locally
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!images.length) {
      toast.error("❌ Please select at least one image.");
      return;
    }

    try {
      const uploadedUrls = await dispatch(
        uploadImagesToCloudinary(images)
      ).unwrap();
      await dispatch(
        submitItem({ formData, imageUrls: uploadedUrls, uploader })
      ).unwrap();
      toast.success("✅ Item uploaded!");
      dispatch(resetForm());
      setImages([]); // ✅ Clear local image state
    } catch (err) {
      toast.error(`❌ Upload failed: ${err}`);
    }
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="p-8 mt-10 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          🧺 Add New Item
        </h2>

        <div className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Title"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Description"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Type"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="Size"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              placeholder="Condition"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Tags (comma-separated)"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md file:bg-blue-600 file:text-white file:border-none file:px-4 file:py-2 file:mr-4 file:rounded file:cursor-pointer"
              required
            />
          </div>

          <button
            type="submit"
            disabled={uploading || submitting}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md text-lg font-semibold shadow hover:bg-blue-700 disabled:bg-gray-400 transition-all"
          >
            {uploading || submitting ? "Uploading..." : "Submit"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddItemForm;
