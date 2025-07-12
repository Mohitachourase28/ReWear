import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Generate tokens
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Cookie settings
const accessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshCookieOptions = {
  ...accessCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Register
export const registerUser = async (req, res) => {
  try {
    const { username, password, email, fullName, address, phone } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username already taken' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, email, fullName, address, phone });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res
      .cookie('token', accessToken, accessCookieOptions)
      .cookie('refreshToken', refreshToken, refreshCookieOptions)
      .json({ user: { ...user._doc, password: undefined } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Refresh token route
export const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(decoded.id);
    res.cookie('token', newAccessToken, accessCookieOptions);
    res.json({ message: 'Access token refreshed' });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Logout
export const logoutUser = (req, res) => {
  res
    .clearCookie('token', accessCookieOptions)
    .clearCookie('refreshToken', refreshCookieOptions)
    .json({ message: 'Logged out successfully' });
};
