const express = require('express');
const app = express();
const router = express.Router();
const adminController = require('../../controllers/adminController');
const authorize = require('../../middleware/authorize');

router.get('/export', authorize.user, adminController.getDataPage);

module.exports = router;