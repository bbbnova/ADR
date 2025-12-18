const express = require('express');
const app = express();
const router = express.Router();
const substanceController = require('../../controllers/substanceController')

router.get('/', substanceController.getListSubstancePage);

router.get('/edit/:id', substanceController.getEditSubstancePage);
router.get('/show/:id', substanceController.getShowSubstancePage);
router.get('/delete/:id', substanceController.getDeleteSubstancePage);

module.exports = router;