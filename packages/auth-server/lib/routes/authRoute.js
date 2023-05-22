const AuthController = require('auth-server/lib/controllers/authController');

const express = require('express');

const router = express.Router();
const authController =  AuthController.getInstance();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/authorize', authController.authorize);
router.post('/token', authController.token);
router.get('/userinfo', authController.userInfo);

module.exports = router;
