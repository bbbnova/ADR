const express = require('express');
const router = express.Router();
const htmlController = require('../controllers/htmlController')
const apiController = require('../controllers/apiController');

router.get('/', htmlController.getHomePage);
router.get('/search/plate', htmlController.getPlatesPage);
router.get('/search/dangerNumber', htmlController.getDangerNumbersPage);
router.get('/instruction/:id', htmlController.getPublicInstructionPage);
router.get('/login', htmlController.getLoginPage);
router.get('/legal', htmlController.getLegalPage);
router.get('/logout', apiController.logoutUser);
router.get('/getSubstanceByNameOrUnNumber/:text', apiController.getSubstanceByNameOrUnNumber);
router.get('/getInstructionById/:text', apiController.getInstructionById);

module.exports = router