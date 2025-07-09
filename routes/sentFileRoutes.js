const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { SentFile } = require('../models');
const { authMiddleware } = require('../middleware/authMiddleware');

// Ensure upload directory exists
const uploadDir = 'uploads/sent_files';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage & file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only documents and images are allowed'));
    }
  }
});

// ✅ Create sent file
router.post('/', authMiddleware, upload.array('attachments'), async (req, res) => {
  try {
    const {
      file_number, file_subject, file_description,
      sent_on, sent_to, remarks, reference_number
    } = req.body;

    if (!file_number || !file_subject || !sent_on || !sent_to) {
      return res.status(400).json({ success: false, error: 'Required fields missing' });
    }

    const files = req.files ? req.files.map(file => file.filename) : [];

    const newFile = await SentFile.create({
      file_number,
      file_subject,
      file_description,
      sent_on,
      sent_to,
      remarks,
      reference_number,
      sent_by: req.user.id,
      attachments: files
    });

    res.status(201).json({
      success: true,
      message: 'File successfully sent',
      data: newFile
    });
  } catch (err) {
    console.error('Create Sent File Error:', err.message);
    res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// // ✅ Get all sent files
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     const files = await SentFile.findAll({ order: [['id', 'DESC']] });
//     res.json({ success: true, data: files });
//   } catch (err) {
//     console.error('Get Sent Files Error:', err.message);
//     res.status(500).json({ success: false, error: 'Failed to fetch sent files' });
//   }
// });

const { Op } = require('sequelize');

// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     const userRole = req.user.role;

//     const isSecretary = userRole === 'Secretary bbshrrdb';

//     const whereClause = isSecretary
//       ? {} // no filter for admin
//       : { sent_to: userRole };

//     const files = await SentFile.findAll({
//       where: whereClause,
//       order: [['id', 'DESC']]
//     });

//     res.json({ success: true, data: files });
//   } catch (err) {
//     console.error('Get Sent Files Error:', err.message);
//     res.status(500).json({ success: false, error: 'Failed to fetch sent files' });
//   }
// });

router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = {};
    const userRole = req.user.role?.toLowerCase();

    if (userRole !== 'secretary bbshrrdb') {
      query = {
        where: {
          [Op.or]: [
            { sent_to: userRole },
            { received_from: userRole }
          ]
        }
      };
    }

    const files = await SentFile.findAll({
      ...query,
      order: [['id', 'DESC']]
    });

    res.json({ success: true, data: files });
  } catch (err) {
    console.error('Get Sent Files Error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch sent files' });
  }
});



module.exports = router;
