const express = require('express');
const app = express();
const router = express.Router();
const excelControler = require('../../controlers/excelControler')

router.get('/read', excelControler.readExcel); 

module.exports = router;