const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController')

router.get('/', homeController.getHomePage);
router.get('/login', homeController.getLoginPage);
router.get('/logout', homeController.logoutUser);
router.get('/getSubstance/:text', homeController.getSubstance);
router.get('/getInstruction/:text', homeController.getInstruction);

module.exports = router