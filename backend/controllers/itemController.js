import Item from "../models/Item.js";

import mongoose from 'mongoose';

export const createItem = async (req, res) => {
  try {
    console.log("📦 Received item body:", req.body);
    const {
      title,
      description,
      category,
      type,
      size,
      condition,
      tags,
      uploader,
      images
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(uploader)) {
      return res.status(400).json({ error: "Invalid uploader ID" });
    }

    const newItem = new Item({
      title,
      description,
      category,
      type,
      size,
      condition,
      tags: Array.isArray(tags) ? tags.map(tag => tag.trim()) : tags.split(',').map(tag => tag.trim()),
      images,
      uploader,
      status: "available",
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("❌ Error creating item:", err);
    res.status(500).json({ error: "Failed to create item" });
  }
};


// Get item by ID
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "uploader",
      "name email"
    );
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).json({ error: "Failed to get item" });
  }
};

// ✅ Get all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).populate("uploader", "name email");
    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching all items:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};
