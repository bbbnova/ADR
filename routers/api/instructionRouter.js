const express = require('express');
const app = express();
const router = express.Router();
const apiInstructionControler = require('../../controllers/apiInstructionController')

router.post('/add', apiInstructionControler.addInstruction);
router.post('/update', apiInstructionControler.updateInstruction);

module.exports = router;