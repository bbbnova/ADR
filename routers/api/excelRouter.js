const express = require('express');
const app = express();
const router = express.Router();
const excelControler = require('../../controllers/excelController')

router.get('/readSubstances', excelControler.readSubstances);
router.get('/readDistances', excelControler.readDistances);
router.get('/readWaterReactions', excelControler.readWaterReactions);
router.get('/readSubstanceParameters', excelControler.readSubstanceParameters);
router.get('/readSubclasses', excelControler.readSubclasses);
router.get('/readExplosiveSubstances', excelControler.readExplosiveSubstances);

module.exports = router;