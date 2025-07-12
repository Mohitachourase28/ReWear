// models/auditLogModel.js
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, enum: ["approve", "reject"], required: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  itemTitle: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("AuditLog", auditLogSchema);
