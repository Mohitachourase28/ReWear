/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchItemById } from "../redux/itemSlice";
import axios from "axios";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedItem } = useSelector((state) => state.items);

  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    dispatch(fetchItemById(id));
  }, [id]);

  useEffect(() => {
    if (selectedItem) {
      setDescription(selectedItem.description);
      setAvailable(selectedItem.available);
      setImagePreview(selectedItem.imageUrl);
    }
  }, [selectedItem]);

  const handleImageUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post("/api/items/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Optional: Update Redux or local preview
      const uploadedUrl = res.data.imageUrl;
      setImagePreview(uploadedUrl);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleToggleAvailability = async () => {
    try {
      const res = await axios.patch(`/api/items/${id}/availability`, {
        available: !available,
      });
      setAvailable(res.data.available);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-900">
          Product Detail Page
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <label className="block font-semibold mb-2 text-gray-700">
            Add Images
          </label>
          <button
            onClick={handleImageUpload}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upload Image
          </button>

          <input type="file" onChange={handleImageChange} className="mb-4" />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="h-40 object-cover rounded-lg"
            />
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4">
          <label className="block font-semibold mb-2 text-gray-700">
            Edit Product Description
          </label>
          <textarea
            className="w-full h-40 p-2 border border-gray-300 rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={handleToggleAvailability}
            className={`mt-4 px-4 py-2 rounded-lg text-white ${
              available
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            {available ? "Available" : "Swapped"}
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-green-800 mt-8 mb-2">
        Previous Listings
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="h-32 bg-white rounded-2xl shadow-inner"></div>
        <div className="h-32 bg-white rounded-2xl shadow-inner"></div>
        <div className="h-32 bg-white rounded-2xl shadow-inner"></div>
        <div className="h-32 bg-white rounded-2xl shadow-inner"></div>
      </div>
    </div>
  );
}
