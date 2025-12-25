const express = require('express');
const app = express();
const router = express.Router();
const adminController = require('../../controllers/adminController');
const authorize = require('../../middleware/authorize');

router.post('/adduser', authorize.user, adminController.addUser);
router.post('/login', adminController.lognInUser);

module.exports = router;