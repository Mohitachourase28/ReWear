// controllers/userController.js
import User from '../models/User.js';
import Item from '../models/Item.js';

// Get logged-in user's profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch {
    res.status(500).json({ error: "Could not fetch profile" });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
};

// Upload item
export const uploadItem = async (req, res) => {
  try {
    const newItem = new Item({ ...req.body, uploader: req.userId });
    await newItem.save();
    res.status(201).json({ message: "Item uploaded", item: newItem });
  } catch {
    res.status(500).json({ error: "Item upload failed" });
  }
};

// Get user’s uploaded items
export const getUserItems = async (req, res) => {
  try {
    const items = await Item.find({ uploader: req.userId });
    res.json(items);
  } catch {
    res.status(500).json({ error: "Failed to retrieve items" });
  }
};
