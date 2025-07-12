import express from "express";
import {
  getAllUsers,
  deleteUser,
} from "../../controllers/adminController.js";
import { verifyToken, isAdmin } from "../../middleware/authMiddleware.js";

import { getAuditLogs } from '../../controllers/auditController.js';

const router = express.Router();

router.use(verifyToken, isAdmin); // protect all routes

router.get("/", getAllUsers);
router.delete("/:id", deleteUser);

// ✅ Audit logs route
router.get('/audit-logs', getAuditLogs);

export default router;
