const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/', dashboardController.getStats);
router.get('/files', dashboardController.getRecentFiles);
router.get('/charts', dashboardController.getChartData);

module.exports = router;
