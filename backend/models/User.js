// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fullName: String,
  address: String,
  phone: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
});


export default mongoose.model("User", userSchema);
