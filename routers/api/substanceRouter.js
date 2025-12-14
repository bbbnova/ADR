const express = require('express');
const app = express();
const router = express.Router();
const apiSubstanceController = require('../../controllers/apiSubstanceController')
const homeController = require('../../controllers/homeController')

router.post('/update', apiSubstanceController.updateSubstance);
router.post('/delete/:id', apiSubstanceController.deleteSubstance);

module.exports = router;