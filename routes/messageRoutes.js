const { sendMessage } = require('../controllers/messageController');

const router = require('express').Router();

router.post('/send-message', sendMessage);
router.get('/get-messages', sendMessage);

module.exports = router;