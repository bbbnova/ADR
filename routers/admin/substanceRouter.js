const express = require('express');
const app = express();
const router = express.Router();
const substanceController = require('../../controllers/substanceController')
const authorize = require('../../middleware/authorize');

router.get('/', authorize.user, substanceController.getListSubstancePage);

router.get('/edit/:id', authorize.user, substanceController.getEditSubstancePage);
router.get('/show/:id', authorize.user, substanceController.getShowSubstancePage);
router.get('/delete/:id', authorize.user, substanceController.getDeleteSubstancePage);

module.exports = router;