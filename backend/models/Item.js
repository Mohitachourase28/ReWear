import { Schema, model } from 'mongoose';

const itemSchema = new Schema({
  title: String,
  description: String,
  category: String,
  type: String,
  size: String,
  condition: String,
  tags: [String],
  images: [String],
  uploader: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'available' }, // available, swapped, redeemed
}, { timestamps: true });

export default model('Item', itemSchema);
