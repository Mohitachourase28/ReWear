// routes/userRoutes.js
import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getUserProfile,
  updateUserProfile,
  uploadItem,
  getUserItems,
} from '../controllers/userController.js';

const router = express.Router();

router.use(verifyToken); // All routes require authentication

// Get user profile info
router.get('/profile', getUserProfile);

// Update user profile
router.put('/profile', updateUserProfile);

// Upload a new clothing item
router.post('/upload', uploadItem);

// Get user's uploaded items
router.get('/my-items', getUserItems);

export default router;
