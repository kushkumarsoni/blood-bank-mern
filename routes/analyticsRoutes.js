const express = require('express');
const authMiddleware  = require('../middlewares/authMiddleware');
const { bloodGroupAnalyticsController } = require( '../controllers/analyticsController');
const router = express.Router();

router.get('/get-bloodGroup-analytics',authMiddleware,bloodGroupAnalyticsController);

module.exports = router;