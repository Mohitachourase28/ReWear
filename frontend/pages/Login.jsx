// src/pages/Login.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await dispatch(loginUser(credentials)).unwrap();
      if (user) {
        navigate("/");
      } 
    } catch (err) {
      console.error("Login error:", err);
      alert(err?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Login to ReWear</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border border-gray-300 rounded"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
