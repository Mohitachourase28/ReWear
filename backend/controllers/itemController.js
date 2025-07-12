import Item from '../models/Item.js';

// Create a new item
export const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      size,
      condition,
      tags,
      uploaderId
    } = req.body;

    const imageUrls = req.files.map(file => file.path); // Cloudinary URLs

    const newItem = new Item({
      title,
      description,
      category,
      type,
      size,
      condition,
      tags: tags.split(',').map(tag => tag.trim()),
      images: imageUrls,
      uploader: uploaderId,
      status: 'available'
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: 'Failed to create item' });
  }
};

// Get item by ID
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('uploader', 'name email');
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    console.error('Error fetching item:', err);
    res.status(500).json({ error: 'Failed to get item' });
  }
};
