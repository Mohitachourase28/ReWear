/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/productSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductCarousel() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Autoplay slide every 4s
  useEffect(() => {
    const timer = setInterval(() => {
      if (products.length > 0) {
        setIndex((prev) => (prev + 1) % products.length);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [products]);

  const nextSlide = () => {
    if (products.length > 0)
      setIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    if (products.length > 0)
      setIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto h-64 flex items-center justify-center text-gray-400">
        Loading products...
      </div>
    );
  }

  if (error || !Array.isArray(products)) {
    return (
      <div className="w-full max-w-3xl mx-auto h-64 flex items-center justify-center text-red-500">
        {error || "Something went wrong while loading products."}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto h-64 flex items-center justify-center text-gray-500">
        No products available.
      </div>
    );
  }

  const current = products[index];

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-2xl shadow-lg">
      <AnimatePresence mode="wait">
        <motion.img
          key={current._id || index}
          src={current.imageUrl || "https://via.placeholder.com/800x400?text=No+Image"}
          alt={current.name || "Product"}
          className="w-full h-64 object-cover"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/800x400?text=Image+Unavailable";
          }}
        />
      </AnimatePresence>

      {/* Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <button
          onClick={prevSlide}
          className="bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={nextSlide}
          className="bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Caption */}
      <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-center py-2">
        <h3 className="text-lg font-semibold truncate px-2">{current.name || "Unnamed Item"}</h3>
        {current.price && (
          <p className="text-sm">{`₹${current.price}`}</p>
        )}
      </div>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {products.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
