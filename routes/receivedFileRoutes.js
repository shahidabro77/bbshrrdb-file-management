const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const { ReceivedFile } = require('../models');
const { authMiddleware } = require('../middleware/authMiddleware');

// Ensure upload directory exists
const uploadDir = 'uploads/received_files';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) cb(null, true);
    else cb(new Error('Only documents and images are allowed'));
  }
});

// ✅ Create a received file
router.post('/', authMiddleware, upload.array('attachments'), async (req, res) => {
  try {
    const {
      file_number,
      file_subject,
      file_description,
      received_on,
      received_from,
      sent_to,
      sent_on,
      remarks
    } = req.body;

    if (!file_number || !file_subject || !received_on || !received_from) {
      return res.status(400).json({ success: false, error: 'Required fields missing' });
    }

    const files = req.files?.map(file => file.filename) || [];

    // Use values from frontend if provided, else fill from backend
    const finalSentTo = sent_to || req.user.role || req.user.full_name || 'unknown';
    const finalSentOn = sent_on || new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const newFile = await ReceivedFile.create({
      file_number,
      file_subject,
      file_description,
      received_on,
      received_from: received_from || req.user.full_name || req.user.role,
      sent_to: finalSentTo,
      sent_on: finalSentOn,
      remarks,
      attachments: JSON.stringify(files), // Store as JSON string
      created_by: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'File successfully received',
      data: newFile
    });
  } catch (err) {
    console.error('Create Received File Error:', err.message);
    res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// ✅ Get received files based on user role
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userRole = req.user.role?.toLowerCase();

    const whereClause = (userRole === 'secretary bbshrrdb')
      ? {} // Admins get everything
      : {
        [Op.or]: [
          { sent_to: userRole },
          { received_from: userRole }
        ]
      };

    const files = await ReceivedFile.findAll({
      where: whereClause,
      order: [['id', 'DESC']]
    });

    res.json({ success: true, data: files });
  } catch (err) {
    console.error('Get Received Files Error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch received files' });
  }
});

module.exports = router;
