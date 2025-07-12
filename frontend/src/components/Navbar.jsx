import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import {
  Home,
  LogIn,
  UserPlus,
  LayoutDashboard,
  PlusSquare,
  Shield,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const linkStyle =
    "flex items-center gap-1 text-gray-700 hover:text-blue-600 transition duration-200 font-medium";

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">ReWear</h1>
        <nav className="flex items-center space-x-6">
          <Link to="/" className={linkStyle}>
            <Home size={18} />
            Home
          </Link>

          {!user && (
            <>
              <Link to="/login" className={linkStyle}>
                <LogIn size={18} />
                Login
              </Link>
              <Link to="/register" className={linkStyle}>
                <UserPlus size={18} />
                Sign Up
              </Link>
            </>
          )}

          {user?.role === "user" && (
            <>
              <Link to="/dashboard" className={linkStyle}>
                <LayoutDashboard size={18} />
                My Dashboard
              </Link>
              <Link to="/addItemForm" className={linkStyle}>
                <PlusSquare size={18} />
                Add Item
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" className={linkStyle}>
              <Shield size={18} />
              Admin Panel
            </Link>
          )}

          {user && (
            <button
              onClick={() => dispatch(logout())}
              className={linkStyle}
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
