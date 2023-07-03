const { userRegister, userLogin } = require('../controllers/userController');

const router = require('express').Router();


router.post('/register', userRegister)
router.post('/login', userLogin)


module.exports = router;