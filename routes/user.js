// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');

// // ✅ Multer Storage Config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
// });
// const upload = multer({ storage });

// // ✅ Format CNIC: 12345-1234567-1
// const formatCNIC = (cnic) => {
//   const digits = cnic.replace(/\D/g, '');
//   return digits.length === 13
//     ? `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
//     : null;
// };

// // ✅ Email Format Validator
// const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// // ✅ Create User (POST /api/users)
// router.post('/', upload.single('photo'), async (req, res) => {
//   try {
//     const {
//       username, email, password, first_name, last_name,
//       designation, department, cnic, mobile, contact,
//       dob, joining_date, role, role_id, gender, address
//     } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ error: 'Username, email, and password are required.' });
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

//     const user = await User.create({
//       username,
//       email,
//       password_hash: hashedPassword,
//       first_name,
//       last_name,
//       designation,
//       department,
//       cnic: formattedCnic,
//       mobile,
//       contact,
//       dob: dob ? new Date(dob) : null,
//       joining_date: joining_date ? new Date(joining_date) : null,
//       role,
//       role_id: parseInt(role_id) || 2,
//       gender,
//       address,
//       photo: req.file ? req.file.filename : null
//     });

//     res.status(201).json({
//       message: 'User created successfully',
//       user: {
//         id: user.user_id,
//         username: user.username,
//         email: user.email,
//         role_id: user.role_id,
//         photo: user.photo
//       }
//     });

//   } catch (error) {
//     console.error('🚨 Error creating user:', error);
//     res.status(500).json({ error: 'Failed to create user. Please try again later.' });
//   }
// });

// // ✅ Get All Users (GET /api/users)
// router.get('/', async (req, res) => {
//   try {
//     const users = await User.findAll({
//       attributes: ['user_id', 'username', 'email', 'role_id', 'photo']
//     });

//     res.status(200).json({ users });
//   } catch (error) {
//     console.error('🚨 Error fetching users:', error);
//     res.status(500).json({ error: 'Failed to fetch users.' });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ✅ Multer Config (in case of future file uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// ✅ Format CNIC: 12345-1234567-1
const formatCNIC = (cnic) => {
  const digits = cnic.replace(/\D/g, '');
  return digits.length === 13
    ? `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
    : null;
};

// ✅ Validate Email Format
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ✅ Create User
router.post('/', upload.none(), async (req, res) => {
  try {
    const { full_name, cnic, email, mobile, password, role } = req.body;

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

    // Check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      cnic: formattedCnic,
      email,
      mobile,
      password: hashedPassword,
      role: role || 'user',
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
router.get('/', async (req, res) => {
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

// ✅ Toggle User Status
router.put('/:id/status', async (req, res) => {
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

module.exports = router;
