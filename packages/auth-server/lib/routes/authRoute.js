const authController = require('../controllers/authController');

const express = require('express');
const router = express.Router();

router.get('/authorize', authController.authorize);
router.post('/token', authController.token);
router.get('/userinfo', authController.userinfo);

module.exports = router;
