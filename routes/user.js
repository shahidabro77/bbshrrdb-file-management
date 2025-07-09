const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { authMiddleware } = require('../middleware/authMiddleware');
const { Role } = require('../models');


// ✅ Admin Check Middleware
const isAdmin = (req, res, next) => {
  console.log('req.user.role ', req.user.role)
  if (req.user.role !== 'admin' || req.user.role !== 'secretary bbshrrdb') return res.status(403).json({ error: 'Forbidden. Admins only.' });
  next();
};

// ✅ Multer Setup
const upload = multer({ dest: 'uploads/' });

// ✅ CNIC Formatter
const formatCNIC = (cnic) => {
  const digits = cnic.replace(/\D/g, '');
  return digits.length === 13
    ? `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
    : null;
};

// ✅ Email Validator
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ✅ Create User
// router.post('/', upload.none(), async (req, res) => {
//   try {
//     const { full_name, cnic, email, mobile, password, role } = req.body;

//     if (!full_name || !email || !password || !mobile || !cnic) {
//       return res.status(400).json({ error: 'All fields are required.' });
//     }

//     if (!isValidEmail(email)) {
//       return res.status(400).json({ error: 'Invalid email format.' });
//     }

//     const formattedCnic = formatCNIC(cnic);
//     if (!formattedCnic) {
//       return res.status(400).json({ error: 'Invalid CNIC. Must be 13 digits.' });
//     }

//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(409).json({ error: 'Email already registered.' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Normalize role
//     const normalizedRole = role?.trim().toLowerCase();

//     // Validate against allowed roles (optional but good practice)
//     const validRole = await Role.findOne({ where: { name: normalizedRole } });
//     if (!validRole) {
//       return res.status(400).json({ error: 'Invalid role provided' });
//     }

//     // Save normalized role
//     const user = await User.create({
//       full_name,
//       cnic: formattedCnic,
//       email,
//       mobile,
//       password: hashedPassword,
//       role: normalizedRole,
//       is_active: false
//     });

//     // const user = await User.create({
//     //   full_name,
//     //   cnic: formattedCnic,
//     //   email,
//     //   mobile,
//     //   password: hashedPassword,
//     //   role: role || 'user',
//     //   is_active: true
//     // });

//     res.status(201).json({
//       message: 'User created successfully',
//       user: {
//         user_id: user.user_id,
//         full_name: user.full_name,
//         email: user.email,
//         role: user.role,
//         is_active: user.is_active
//       }
//     });

//   } catch (error) {
//     console.error('🚨 Error creating user:', error);
//     res.status(500).json({ error: 'Failed to create user.' });
//   }
// });

router.post('/', upload.none(), async (req, res) => {
  try {
    const { full_name, cnic, email, mobile, password, role } = req.body;

    // Validate fields
    if (!full_name || !email || !password || !mobile || !cnic) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    const formattedCnic = formatCNIC(cnic);
    if (!formattedCnic) {
      return res.status(400).json({ error: 'Invalid CNIC. Must be 13 digits.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Get normalized role or default
    const roleName = (role || 'public sector').toLowerCase();
    const matchedRole = await Role.findOne({ where: { name: roleName } });

    if (!matchedRole) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.create({
      full_name,
      cnic: formattedCnic,
      email,
      mobile,
      password: hashedPassword,
      role: matchedRole.name, // or use role_id if using FK
      is_active: true
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      }
    });

  } catch (error) {
    console.error('🚨 Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});


// ✅ Get All Users
router.get('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['user_id', 'full_name', 'email', 'role', 'is_active']
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('🚨 Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// ✅ Toggle User Status (Activate/Deactivate)
router.put('/:id/status', authMiddleware, isAdmin, async (req, res) => {
  const userId = req.params.id;
  const { is_active } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.is_active = is_active;
    await user.save();

    res.status(200).json({ message: 'User status updated', is_active: user.is_active });
  } catch (error) {
    console.error('🚨 Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// ✅ User Settings (Get Current User Info)
router.get('/settings', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: ['user_id', 'full_name', 'email', 'mobile', 'role', 'is_active', 'photo']
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user settings' });
  }
});

// ✅ Update User Profile
router.put('/settings', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { full_name, email, password } = req.body;

    if (email && !isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (full_name) user.full_name = full_name;
    if (email) user.email = email;
    if (password && password.length >= 8) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      user.photo = req.file.filename; F
    }

    await user.save();
    res.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('🚨 Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});




module.exports = router;
