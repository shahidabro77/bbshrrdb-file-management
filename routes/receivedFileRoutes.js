const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { ReceivedFile } = require('../models/');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/received_files'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// ✅ Create received file
router.post('/', authMiddleware, upload.array('attachments'), async (req, res) => {
  try {
    const {
      file_number, file_subject, file_description,
      received_on, received_from, sent_to,
      sent_on, remarks
    } = req.body;

    const files = req.files.map(file => file.filename);

    const newFile = await ReceivedFile.create({
      file_number,
      file_subject,
      file_description,
      received_on,
      received_from,
      sent_to,
      sent_on,
      remarks,
      attachments: files,
      created_by: req.user.id
    });

    res.status(201).json({ success: true, file: newFile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ✅ Get all received files
router.get('/', authMiddleware, async (req, res) => {
  const files = await ReceivedFile.findAll({ order: [['id', 'DESC']] });
  res.json({ success: true, files });
});

module.exports = router;