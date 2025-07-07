// controllers/fileLogController.js

const db = require('../models');
const FileLog = db.FileLog;

exports.createLog = async (req, res) => {
  try {
    const { file_id, source, section, status } = req.body;

    if (!file_id || !source || !section) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const newLog = await FileLog.create({ file_id, source, section, status });
    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const filters = {};
    const { file_id, source } = req.query;

    if (file_id) filters.file_id = file_id;
    if (source) filters.source = source;

    const logs = await FileLog.findAll({
      where: filters,
      order: [['updated_at', 'DESC']],
    });

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch logs' });
  }
};
