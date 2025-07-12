// controllers/auditController.js

import AuditLog from "../models/AuditLog.js";
import Item from "../models/Item.js";

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'username email')
      .sort({ timestamp: -1 })
      .limit(100); // Limit to recent logs

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
};

export const approveItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    await AuditLog.create({
      admin: req.user.id,
      action: "approve",
      item: item._id,
      itemTitle: item.title,
    });

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to approve item." });
  }
};

export const rejectItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    await AuditLog.create({
      admin: req.user.id,
      action: "reject",
      item: item._id,
      itemTitle: item.title,
    });

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to reject item." });
  }
};