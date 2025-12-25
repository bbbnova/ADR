const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');
const authorize = require('../../middleware/authorize');

router.get('/', authorize.user, adminController.getDashboardPage);

module.exports = router;