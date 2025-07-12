import User from '../models/User.js';
import Item from '../models/Item.js';
import AuditLog from "../models/AuditLog.js";

// Get all unapproved items
export const getPendingItems = async (req, res) => {
  try {
    const items = await Item.find({ approved: false, rejected: false }).populate("uploader", "username email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

// Approve item
export const approveItem = async (req, res) => {
  try {
    await Item.findByIdAndUpdate(req.params.id, { approved: true });

    await AuditLog.create({
      userId: req.userId,
      action: "APPROVE_ITEM",
      details: `Admin approved item ${req.params.id}`
    });

    res.json({ message: "Item approved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve item" });
  }
};

// Reject item
export const rejectItem = async (req, res) => {
  try {
    await Item.findByIdAndUpdate(req.params.id, { rejected: true });
    res.json({ message: "Item rejected" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reject item" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};