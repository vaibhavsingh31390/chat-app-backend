const { userRegister } = require('../controllers/userController');

const router = require('express').Router();


router.post('/register', userRegister)


module.exports = router;