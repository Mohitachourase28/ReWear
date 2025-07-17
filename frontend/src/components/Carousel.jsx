import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchItemById } from "../../redux/productSlice.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Carousel = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const scrollRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const cardWidth = container.firstChild?.offsetWidth || 280;
    const visibleCount = Math.floor(container.offsetWidth / cardWidth);
    const maxIndex = Math.max(products.length - visibleCount, 0);

    if (direction === "left" && scrollIndex > 0) {
      setScrollIndex((prev) => prev - 1);
      container.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
    if (direction === "right" && scrollIndex < maxIndex) {
      setScrollIndex((prev) => prev + 1);
      container.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!products.length)
    return <div className="text-center text-gray-500">No items found.</div>;

  return (
    <section className="relative py-10">
      <main className="max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-bold mb-6 text-center">Featured Items</h3>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-[-28px] top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:scale-105 transition"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Scrollable Card Row */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 lg:px-8 gap-4 py-4 scrollbar-hide"
            style={{
              scrollSnapType: "x mandatory",
            }}
          >
            {products.map((item, index) => (
              <div
                key={item.id || index}
                className="min-w-[240px] sm:min-w-[260px] max-w-xs rounded-xl shadow-md overflow-hidden flex flex-col bg-white"
              >
                <img
                  src={
                    item.images?.[0] ||
                    "https://via.placeholder.com/300x300?text=No+Image"
                  }
                  alt={item.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/300x300?text=Image+Unavailable";
                  }}
                />
                <div className="p-4 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {item.title}
                      </h4>
                      {item.size && (
                        <span className="text-xs text-gray-500">
                          Size: {item.size}
                        </span>
                      )}
                    </div>
                    {item.condition && (
                      <span
                        className={`
                          inline-block text-xs px-2 py-1 rounded-full mb-3
                          ${
                            item.condition === "Excellent"
                              ? "bg-blue-100 text-blue-700"
                              : item.condition === "Very Good"
                              ? "bg-purple-100 text-purple-700"
                              : item.condition === "Good"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        `}
                      >
                        {item.condition}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between gap-2 mt-auto">
                    <button className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600">
                      Swap
                    </button>
                    <Link
                      to={`/product/${item._id}`}
                      className="w-full"
                      onClick={() => dispatch(fetchItemById(item._id))} // ✅ Dispatch here
                    >
                      <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 w-full">
                        View Details
                      </button>
                    </Link>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-[-28px] top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:scale-105 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </main>
    </section>
  );
};

export default Carousel;
