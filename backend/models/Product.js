// models/Product.js
import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  title: String,
  description: String,
  images: [String], // URLs from Cloudinary
  category: String,
  size: String,
  condition: String,
  tags: [String],
  points: Number,
  availability: { type: String, enum: ['Available', 'Swapped'], default: 'Available' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default model('Product', productSchema);
