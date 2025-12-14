const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController')

router.get('/', homeController.getHomePage);
router.get('/getSubstance/:text', homeController.getSubstance);

module.exports = router