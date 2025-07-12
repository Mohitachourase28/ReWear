// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchCurrentUser } from "../redux/authSlice.js";

import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import UserDashboard from "../pages/UserDashboard.jsx";
import AdminPanel from "../pages/AdminPanel.jsx";
import Landing from "../pages/Landing.jsx";
import Navbar from "./components/Navbar.jsx";
import AddItemForm from "./components/AddItemForm.jsx";

function ProtectedRoute({ children, allowRoles = [] }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" />;
  if (allowRoles.length && !allowRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
}


export default function App() {
      const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser()); // 🟢 Restore user from cookie on first load
  }, [dispatch]);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/addItemForm" element={<AddItemForm/>}/>
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
