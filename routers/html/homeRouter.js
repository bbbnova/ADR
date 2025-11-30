const express = require('express');
const app = express();
const router = express.Router();
const htmlHomeControler = require('../../controlers/htmlHomeControler')

router.get('/', htmlHomeControler.getHomePage);
router.get('/getListInstructionsPage', htmlHomeControler.getListInstructionsPage);
router.get('/getAddInstructionPage', htmlHomeControler.getAddInstructionPage);
router.get('/getEditInstructionPage/:id', htmlHomeControler.getEditInstructionPage);
router.get('/getShowInstructionPage/:id', htmlHomeControler.getShowInstructionPage);

module.exports = router;