const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  // Save file info in DB if needed
  res.json({ message: 'File uploaded', file: req.file });
});
