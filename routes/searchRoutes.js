const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { ReceivedFile, SentFile } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  const query = req.query.q || '';

  try {
    const receivedResults = await ReceivedFile.findAll({
      where: {
        [Op.or]: [
          { file_number: { [Op.like]: `%${query}%` } },
          { file_subject: { [Op.like]: `%${query}%` } },
          { received_from: { [Op.like]: `%${query}%` } },
          { sent_to: { [Op.like]: `%${query}%` } },
          { remarks: { [Op.like]: `%${query}%` } }
        ]
      },
      raw: true
    });

    const sentResults = await SentFile.findAll({
      where: {
        [Op.or]: [
          { file_number: { [Op.like]: `%${query}%` } },
          { file_subject: { [Op.like]: `%${query}%` } },
          { sent_by: { [Op.like]: `%${query}%` } },
          { sent_to: { [Op.like]: `%${query}%` } },
          { remarks: { [Op.like]: `%${query}%` } }
        ]
      },
      raw: true
    });

    // Add type to each record
    const receivedTagged = receivedResults.map(file => ({ ...file, type: 'received' }));
    const sentTagged = sentResults.map(file => ({ ...file, type: 'sent' }));

    const allResults = [...receivedTagged, ...sentTagged];

    res.json({ success: true, results: allResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
