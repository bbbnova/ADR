const express = require('express');
const app = express();
const router = express.Router();
const excelControler = require('../../controllers/excelController')

router.get('/readSubstances', excelControler.readSubstances);
router.get('/readDistances', excelControler.readDistances);
router.get('/readWaterReactions', excelControler.readeWaterReactions);

module.exports = router;