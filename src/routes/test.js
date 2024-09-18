const express = require('express');
const TestController = require('../controllers/TestController');
const router = express.Router()

router.get('/', TestController.index);
router.post('/push-noti', TestController.pushNotification);
router.post('/save-noti', TestController.saveToken);

module.exports = router;