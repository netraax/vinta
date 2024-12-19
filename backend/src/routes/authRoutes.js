const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes d'authentification
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify', authController.verify);

module.exports = router;
