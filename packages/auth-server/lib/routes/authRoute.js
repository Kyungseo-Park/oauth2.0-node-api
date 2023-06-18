const AuthController = require('auth-server/lib/controllers/authController');

const {Router} = require('express');

const router = Router();
const authController =  AuthController.getInstance();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/authorize', authController.authorize);
router.post('/token', authController.token);

module.exports = router;
