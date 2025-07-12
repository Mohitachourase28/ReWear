import express from "express";
import {
  getPendingItems,
  approveItem,
  rejectItem,
} from "../../controllers/adminController.js";
import { verifyToken, isAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken, isAdmin); // protect all routes

router.get("/pending-items", getPendingItems);
router.patch("/approve/:id", approveItem);
router.patch("/reject/:id", rejectItem);

export default router;
