const express = require('express');
const app = express();
const router = express.Router();
const instructionController = require('../../controllers/instructionController')

router.get('/', instructionController.getListInstructionsPage);
router.get('/add', instructionController.getAddInstructionPage);
router.get('/edit/:id', instructionController.getEditInstructionPage);
router.get('/show/:id', instructionController.getShowInstructionPage);
router.get('/delete/:id', instructionController.getDeleteInstructionPage);

module.exports = router;