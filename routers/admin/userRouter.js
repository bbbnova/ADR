const express = require('express');
const app = express();
const router = express.Router();
const adminController = require('../../controllers/adminController');

router.post('/adduser', adminController.addUser);

module.exports = router;