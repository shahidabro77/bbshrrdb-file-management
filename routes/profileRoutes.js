// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get profile
router.get('/', authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ['id', 'name', 'email', 'role', 'is_active', 'createdAt']
  });

  res.json({ success: true, user });
});

// Update profile
router.put('/', authMiddleware, async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findByPk(req.user.id);

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
  }

  await user.save();

  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
});

module.exports = router;
