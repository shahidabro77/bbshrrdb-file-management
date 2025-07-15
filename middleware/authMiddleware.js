const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by user_id from decoded JWT
    const user = await User.findByPk(decoded.user_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach full user info to req.user if needed
    req.user = {
      id: user.user_id,           // ✅ this is correct based on your model
      full_name: user.full_name,  // ✅ available to use in response
      email: user.email,
      role: user.role
    };

    next();
  } catch (err) {
    console.error('Token validation failed:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};
