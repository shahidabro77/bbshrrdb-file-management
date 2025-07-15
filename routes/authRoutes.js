const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register Route
router.post('/register', async (req, res) => {
  try {
    const {
      full_name,
      cnic,
      email,       // matches <input name="email" />
      mobile,
      password,
      role
    } = req.body;

    console.log(req.body);


    if (!full_name || !cnic || !email || !mobile || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      cnic,
      email,
      mobile,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});




// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Block inactive users
    if (!user.is_active) {
      return res.status(403).json({ message: 'Your account is inactive. Please contact admin.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token with user info
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        full_name: user.full_name
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Clean user object for frontend (omit password, etc.)
    const safeUser = {
      id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      cnic: user.cnic,
      is_active: user.is_active
    };

    // Success response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: safeUser
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, async (req, res) => {
  try {
    // Find user by user_id
    const user = await User.findByPk(req.user.id, {
      attributes: ['user_id', 'full_name', 'email', 'mobile', 'role', 'is_active', 'photo']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('GET /me error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



// Protected Route Example
// const { authMiddleware } = require('../middleware/authMiddleware');
router.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.json({ user });
});

module.exports = router;
