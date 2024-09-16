const express = require('express');
const TestController = require('../controllers/TestController');
const router = express.Router()

router.get('/', TestController.index);
router.post('/push-noti', TestController.pushNotification);

module.exports = router;