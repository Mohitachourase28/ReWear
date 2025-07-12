import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify token from cookies or headers
export const verifyToken = async (req, res, next) => {
  let token = req.cookies?.token;

  // Fallback: Try Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  // Reject if token not found
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure user exists
    const user = await User.findById(decoded.id).select('_id role');
    if (!user) {
      return res.status(401).json({ error: 'User not found or deleted' });
    }

    // Attach to request for further use
    req.userId = user._id;
    req.userRole = user.role;

    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to restrict route to admins
export const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};
