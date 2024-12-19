import express from 'express';
import { register, login, verify } from '../controllers/authController.js';

const router = express.Router();

// Routes d'authentification
router.post('/register', register);
router.post('/login', login);
router.get('/verify', verify);

export default router;
