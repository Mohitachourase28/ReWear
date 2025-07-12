import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems } from '../redux/itemSlice';
import { ProductCard } from '../components/ProductCard';

export default function ItemListing() {
  const dispatch = useDispatch();
  const { allItems, status } = useSelector((state) => state.items);

  useEffect(() => {
    dispatch(fetchItems());
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-900">Item Listing</h1>
        <input type="text" placeholder="Search..." className="p-2 rounded-lg border border-gray-300 w-60" />
      </header>
      {status === 'loading' ? (
        <p>Loading items...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allItems.map((item) => (
            <ProductCard
              key={item._id}
              image={item.imageUrl}
              name={item.name}
              description={item.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}
