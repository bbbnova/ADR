const express = require('express');
const app = express();
const router = express.Router();
const excelControler = require('../../controllers/excelController')

router.get('/readSubstances', excelControler.readSubstances);

module.exports = router;