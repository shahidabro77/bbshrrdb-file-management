const User = require('../models/userModel');

// GET all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin' || req.user.role !== 'secretary bbshrrdb') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find().select('-password'); // exclude password
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers
};
