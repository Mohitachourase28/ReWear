// routes/authRoutes.js
import express from 'express';
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  refreshAccessToken
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getCurrentUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken); // ⬅️ refresh endpoint

export default router;
