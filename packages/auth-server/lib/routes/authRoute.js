const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/auth', authController.auth);
router.get('/callback', authController.callback);

module.exports = router;
