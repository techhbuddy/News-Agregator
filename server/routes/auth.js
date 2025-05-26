// routes/auth.js
import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController.js';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' }); // Logout is handled client-side
});

export default router;