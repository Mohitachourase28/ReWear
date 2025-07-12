/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingItems,
  approveItem,
  rejectItem,
  fetchUsers,
  deleteUser,
  fetchAllListings,
} from "../redux/adminSlice";

export default function AdminPanel() {
  const dispatch = useDispatch();
  const { pendingItems, users, loading, allItems } = useSelector(
    (state) => state.admin
  );
  const [activeTab, setActiveTab] = useState("users");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    dispatch(fetchPendingItems());
    dispatch(fetchUsers());
    dispatch(fetchAllListings());
  }, [dispatch]);

  const renderStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold inline-block";
    if (status === "pending") return `${base} bg-yellow-100 text-yellow-700`;
    if (status === "approved") return `${base} bg-green-100 text-green-700`;
    if (status === "rejected") return `${base} bg-red-100 text-red-700`;
    return `${base} bg-gray-100 text-gray-700`;
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Admin Panel
      </h1>

      {/* TAB SWITCH */}
      <div className="flex justify-center gap-4 mb-8">
        {["users", "orders", "listings", "allListings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded shadow-sm text-sm font-medium capitalize transition-colors duration-200 ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {tab === "allListings" ? "All Listings" : `Manage ${tab}`}
          </button>
        ))}
      </div>

      {/* USERS TAB */}
      {activeTab === "users" && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
          <div className="grid grid-cols-1 gap-6">
            {users.map((u) => (
              <div
                key={u._id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200" />
                  <div>
                    <p className="font-semibold text-gray-800">{u.username}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                    <p className="text-xs text-gray-400 capitalize">{u.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {u.role !== "admin" && (
                    <button
                      onClick={() => {
                        if (confirm("Delete this user?")) dispatch(deleteUser(u._id));
                      }}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LISTINGS TAB */}
      {activeTab === "listings" && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Pending Listings</h2>
          {pendingItems.length === 0 ? (
            <p className="text-gray-600">No pending items.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingItems.map((item) => (
                <div
                  key={item._id}
                  className="p-4 bg-white shadow rounded hover:shadow-md transition space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-800">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        By: {item.uploader?.username || "Unknown"}
                      </p>
                    </div>
                    <span className={renderStatusBadge(item.status)}>
                      {item.status || "pending"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        setActionLoading(item._id);
                        await dispatch(approveItem(item._id));
                        setActionLoading(null);
                      }}
                      disabled={actionLoading === item._id}
                      className={`px-3 py-1 rounded text-white ${
                        actionLoading === item._id
                          ? "bg-green-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {actionLoading === item._id ? "Approving..." : "Approve"}
                    </button>
                    <button
                      onClick={async () => {
                        setActionLoading(item._id);
                        await dispatch(rejectItem(item._id));
                        setActionLoading(null);
                      }}
                      disabled={actionLoading === item._id}
                      className={`px-3 py-1 rounded text-white ${
                        actionLoading === item._id
                          ? "bg-red-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {actionLoading === item._id ? "Rejecting..." : "Reject"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ALL LISTINGS TAB */}
      {activeTab === "allListings" && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">All Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allItems.map((item) => (
              <div key={item._id} className="p-4 bg-white rounded shadow">
                <h3 className="font-bold text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-sm text-gray-400 mt-1">
                  By: {item.uploader?.username || "Unknown"}
                </p>
                <span className={renderStatusBadge(item.status)}>{item.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <div className="text-center text-gray-400">Orders module coming soon 🚧</div>
      )}
    </div>
  );
}