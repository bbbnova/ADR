const express = require('express');
const app = express();
const router = express.Router();
const excelControler = require('../../controlers/excelControler')

router.get('/readSubstances', excelControler.readSubstances);

module.exports = router;