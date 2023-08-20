const { sendMessage } = require('../controllers/messageController');

const router = require('express').Router();

router.post('/send-message', sendMessage);

module.exports = router;