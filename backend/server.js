import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from "cors";
import userRoutes from "./routes/authRoutes.js";
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

import userAdminRoutes from "./routes/admin/userAdminRoutes.js";
import moderationRoutes from "./routes/admin/moderationRoutes.js";

import {uploadLimiter, generalLimiter, loginLimiter } from './middleware/rateLimiter.js';

import cookieParser from 'cookie-parser';

dotenv.config(); // Load environment variables from .env

connectDB(); // Connect to MongoDB

const app = express();
app.use(cookieParser()); // needed to read cookies
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Middleware, routes, etc.
app.use("/api/auth", authRoutes, loginLimiter);
app.use('/api/', generalLimiter);
app.use('/api/users/upload', uploadLimiter)
app.use("/api/user", userRoutes);
app.use('/api/items', itemRoutes);

// Admin
app.use("/api/admin/users", userAdminRoutes);
app.use("/api/admin/moderation", moderationRoutes);

app.get('/', (req, res) => {
  res.send('🎉 ReWear API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
