const express = require('express');
const router = express.Router();
const htmlController = require('../controllers/htmlController');
const apiController = require('../controllers/apiController');
const excelController = require('../controllers/excelController');
const authorize = require('../middleware/authorize');

router.get('/', authorize.user, htmlController.getDashboardPage);

router.get('/data/export', authorize.user, htmlController.getDataPage);

router.get('/substances/', authorize.user, htmlController.getListSubstancePage);
router.get('/substances/edit/:id', authorize.user, htmlController.getEditSubstancePage);
router.get('/substances/show/:id', authorize.user, htmlController.getShowSubstancePage);
router.get('/substances/delete/:id', authorize.user, htmlController.getDeleteSubstancePage);

router.post('/api/substances/update', apiController.updateSubstanceById);
router.post('/api/substances/delete/:id', apiController.deleteSubstance);

router.get('/instructions/', authorize.user, htmlController.getListInstructionsPage);
router.get('/instructions/add', authorize.user, htmlController.getAddInstructionPage);
router.get('/instructions/edit/:id', authorize.user, htmlController.getEditInstructionPage);
router.get('/instructions/show/:id', authorize.user, htmlController.getShowInstructionPage);
router.get('/instructions/delete/:id', authorize.user, htmlController.getDeleteInstructionPage);

router.post('/api/instructions/add', apiController.addInstruction);
router.post('/api/instructions/update', apiController.updateInstructionById);

// router.post('/users/add', authorize.user, apiController.addUser);
router.post('/users/login', apiController.loginUser);

router.get('/excel/addInstructionStartup', excelController.addInstructionStartup);
router.get('/excel/readSubstances', excelController.readSubstances);
router.get('/excel/readDistances', excelController.readDistances);
router.get('/excel/readWaterReactions', excelController.readWaterReactions);
router.get('/excel/readSubstanceParameters', excelController.readSubstanceParameters);
router.get('/excel/readSubclasses', excelController.readSubclasses);
router.get('/excel/readExplosiveSubstances', excelController.readExplosiveSubstances);

module.exports = router;