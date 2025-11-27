const express = require('express');
const app = express();
const router = express.Router();
const htmlHomeControler = require('../../controlers/htmlHomeControler')

router.get('/', htmlHomeControler.getHomePage);
router.get('/getAddInstructionPage', htmlHomeControler.getAddInstructionPage);

module.exports = router;