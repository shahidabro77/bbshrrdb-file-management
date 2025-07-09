// routes/userAdminRoutes.js
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authMiddleware } = require('../middleware/authMiddleware');

// Middleware to check admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' || req.user.role !== 'secretary bbshrrdb') return res.status(403).json({ success: false, error: 'Forbidden' });
  next();
};

// Activate user
router.put('/:id/activate', authMiddleware, isAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  user.is_active = true;
  await user.save();

  res.json({ success: true, user });
});

// Deactivate user
router.put('/:id/deactivate', authMiddleware, isAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  user.is_active = false;
  await user.save();

  res.json({ success: true, user });
});

module.exports = router;
