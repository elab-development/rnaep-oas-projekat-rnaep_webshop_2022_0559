const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analytics.controller');

router.get('/trip/:tripId', AnalyticsController.getByTrip);
router.post('/generate', AnalyticsController.generateManual);

module.exports = router;