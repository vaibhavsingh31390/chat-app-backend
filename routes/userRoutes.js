const { userRegister, userLogin, userSetAvatar } = require('../controllers/userController');

const router = require('express').Router();


router.post('/register', userRegister)
router.post('/login', userLogin)
router.post('/set-Avatar', userSetAvatar)


module.exports = router;