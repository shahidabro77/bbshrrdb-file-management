const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { ReceivedFile, SentFile } = require('../models');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  const { file_number, subject, section } = req.query;

  try {
    const receivedResults = await ReceivedFile.findAll({
      where: {
        ...(file_number && { file_number: { [Op.like]: `%${file_number}%` } }),
        ...(subject && { file_subject: { [Op.like]: `%${subject}%` } }),
        ...(section && { sent_to: { [Op.like]: `%${section}%` } }),
      },
      raw: true,
    });

    const sentResults = await SentFile.findAll({
      where: {
        ...(file_number && { file_number: { [Op.like]: `%${file_number}%` } }),
        ...(subject && { file_subject: { [Op.like]: `%${subject}%` } }),
        ...(section && { sent_to: { [Op.like]: `%${section}%` } }),
      },
      raw: true,
    });

    const receivedTagged = receivedResults.map((file) => ({
      ...file,
      type: 'received',
      section: file.sent_to, // normalize
      subject: file.file_subject,
      status: 'Received', // custom label
      updated_at: file.updated_at || file.createdAt,
    }));

    const sentTagged = sentResults.map((file) => ({
      ...file,
      type: 'sent',
      section: file.sent_to,
      subject: file.file_subject,
      status: 'Sent', // custom label
      updated_at: file.updated_at || file.createdAt,
    }));

    const allResults = [...receivedTagged, ...sentTagged];

    res.json({ success: true, files: allResults });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


module.exports = router;
