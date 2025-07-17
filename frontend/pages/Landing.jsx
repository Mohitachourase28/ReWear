import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../src/components/Spinner.jsx";
import Carousel from "../src/components/Carousel.jsx";
import { Shirt, User, Baby, Watch, Footprints, Snowflake } from "lucide-react"; // Optional: install lucide-react

export default function Landing() {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="py-10 text-center bg-gray-50">
        <main className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Welcome to <span className="text-blue-600">ReWear</span>
          </h1>
          <p className="text-lg text-gray-600 mb-1">
            {user
              ? user.role === "admin"
                ? `Welcome back, Admin ${user.name} 👑`
                : `Welcome back, ${user.name} 👋`
              : "Buy, sell, and recycle clothing with ease. Login to get started!"}
          </p>

          <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-2">
            Join the sustainable fashion movement
          </h2>
          <p className="mb-6 text-gray-600">
            Swap, browse, and give unused clothes a second life.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {!user && (
              <>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-600 transition"
                >
                  Login to Swap
                </Link>
              </>
            )}

            {user?.role === "user" && (
              <>
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 transition"
                >
                  Start Swapping
                </Link>
                <Link
                  to="/dashboard"
                  className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-600 transition"
                >
                  Browse Items
                </Link>
              </>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="bg-red-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-red-600 transition"
              >
                Go to Admin Panel
              </Link>
            )}
          </div>
        </main>
      </section>

      {/* Categories */}
      <section className="relative py-10">
        <main className="max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-bold mb-6 text-center">Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
          <CategoryCard label="Men" icon={<User />} />
          <CategoryCard label="Women" icon={<Shirt />} />
          <CategoryCard label="Kids" icon={<Baby />} />
          <CategoryCard label="Accessories" icon={<Watch />} />
          <CategoryCard label="Shoes" icon={<Footprints />} />
          <CategoryCard label="Seasonal" icon={<Snowflake />} />
        </div>
        </main>
      </section>

      {/* Featured Items */}
        <Carousel />
    </div>
  );
}

function CategoryCard({ label, icon }) {
  return (
    <div className="bg-gray-50 hover:bg-gray-100 text-center p-4 rounded-lg shadow-sm transition flex flex-col items-center">
      <div className="mb-2 text-blue-600 text-xl">{icon}</div>
      <span className="font-medium text-gray-700">{label}</span>
    </div>
  );
}
