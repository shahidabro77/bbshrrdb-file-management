// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { SentFile, ReceivedFile, User } = require('../models');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [sentCount, receivedCount] = await Promise.all([
      SentFile.count({ where: { sent_by: userId } }),
      ReceivedFile.count({ where: { created_by: userId } }),
    ]);

    const [recentSent, recentReceived] = await Promise.all([
      SentFile.findAll({
        where: { sent_by: userId },
        limit: 5,
        order: [['createdAt', 'DESC']],
      }),
      ReceivedFile.findAll({
        where: { created_by: userId },
        limit: 5,
        order: [['createdAt', 'DESC']],
      }),
    ]);

    res.json({
      success: true,
      data: {
        user: req.user,
        sentCount,
        receivedCount,
        recentSent,
        recentReceived,
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


module.exports = router;
