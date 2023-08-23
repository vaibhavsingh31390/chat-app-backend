const { sendMessage, getMessages } = require('../controllers/messageController');

const router = require('express').Router();

router.post('/send-message', sendMessage);
router.get('/get-messages', getMessages);

module.exports = router;