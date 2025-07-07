const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { SentFile } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/sent_files'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// ✅ Create sent file
router.post('/', authMiddleware, upload.array('attachments'), async (req, res) => {
  try {
    const {
      file_number, file_subject, file_description,
      sent_on, sent_to, remarks,
      reference_number
    } = req.body;

    const files = req.files.map(file => file.filename);

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

    res.status(201).json({ success: true, file: newFile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ✅ Get all sent files
router.get('/', authMiddleware, async (req, res) => {
  const files = await SentFile.findAll({ order: [['id', 'DESC']] });
  res.json({ success: true, files });
});

module.exports = router;