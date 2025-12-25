const express = require('express');
const app = express();
const router = express.Router();
const instructionController = require('../../controllers/instructionController')
const authorize = require('../../middleware/authorize');

router.get('/', authorize.user, instructionController.getListInstructionsPage);
router.get('/add', authorize.user, instructionController.getAddInstructionPage);
router.get('/edit/:id', authorize.user, instructionController.getEditInstructionPage);
router.get('/show/:id', authorize.user, instructionController.getShowInstructionPage);
router.get('/delete/:id', authorize.user, instructionController.getDeleteInstructionPage);

module.exports = router;