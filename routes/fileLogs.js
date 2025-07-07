// routes/fileLogs.js

const express = require('express');
const router = express.Router();
const fileLogController = require('../controllers/fileLogController');

router.post('/file-logs', fileLogController.createLog);
router.get('/file-logs', fileLogController.getLogs);

module.exports = router;
