const { userRegister, userLogin, userSetAvatar, userGetUsers } = require('../controllers/userController');

const router = require('express').Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/set-Avatar', userSetAvatar);
router.get('/contacts', userGetUsers);


module.exports = router;