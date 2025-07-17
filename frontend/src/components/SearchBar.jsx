import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchItemById } from "../redux/productSlice";
import { Search } from "lucide-react";

const SearchBar = ({ productList }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() === "") {
        setFiltered([]);
        return;
      }

      const result = productList.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFiltered(result);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, productList]);

  const handleSelect = (item) => {
    setQuery(item.name);
    setFiltered([]);
    setSelectedIndex(-1);
    dispatch(fetchItemById(item._id));
  };

  const handleKeyDown = (e) => {
    if (filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) =>
        prev <= 0 ? filtered.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleSelect(filtered[selectedIndex]);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto mt-4 px-4">
      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm">
        <Search className="text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="ml-3 w-full outline-none bg-transparent text-gray-800"
        />
      </div>

      {filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow max-h-60 overflow-y-auto"
        >
          {filtered.map((item, index) => (
            <li
              key={item._id}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selectedIndex === index ? "bg-gray-100" : ""
              }`}
              onClick={() => handleSelect(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
