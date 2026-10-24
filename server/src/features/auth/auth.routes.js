const express = require('express');
const requireAuth = require('../../middleware/requireAuth');
const authController = require('./auth.controller');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', requireAuth, authController.getCurrentUser);

module.exports = router;
