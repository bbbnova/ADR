const express = require('express');
const app = express();
const router = express.Router();
const adminController = require('../../controllers/adminController');

router.get('/', adminController.getDataPage);

module.exports = router;