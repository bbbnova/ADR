const express = require('express');
const app = express();
const router = express.Router();
const apiSubstanceController = require('../../controllers/apiSubstanceController')

router.post('/update', apiSubstanceController.updateSubstance);

module.exports = router;