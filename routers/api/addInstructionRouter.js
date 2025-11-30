const express = require('express');
const app = express();
const router = express.Router();
const apiInstructionControler = require('../../controlers/apiInstructionControler')

router.post('/addInstruction', apiInstructionControler.addInstruction);
router.post('/updateInstruction', apiInstructionControler.updateInstruction);

module.exports = router;