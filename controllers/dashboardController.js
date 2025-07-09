const { ReceivedFile, SentFile } = require('../models');
const { User } = require('../models'); // Adjust if you're exporting differently from index.js
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
  try {
    const [receivedCount, sentCount, userCount] = await Promise.all([
      ReceivedFile.count(),
      SentFile.count(),
      User.count()
    ]);

    res.json({
      totalFiles: receivedCount + sentCount,
      received: receivedCount,
      sent: sentCount,
      users: userCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

exports.getRecentFiles = async (req, res) => {
  try {
    const files = await ReceivedFile.findAll({
      limit: 10,
      order: [['received_on', 'DESC']]
    });

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch recent files' });
  }
};

exports.getChartData = async (req, res) => {
  try {
    const files = await ReceivedFile.findAll();

    // Pie chart: count by remarks as status (if you don’t have a separate status field)
    const pieCounts = {};
    const sectionCounts = {};

    files.forEach(file => {
      const status = file.remarks || 'Unknown';
      pieCounts[status] = (pieCounts[status] || 0) + 1;

      const section = file.received_from;
      sectionCounts[section] = (sectionCounts[section] || 0) + 1;
    });

    res.json({
      pie: pieCounts,
      bar: sectionCounts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
};
