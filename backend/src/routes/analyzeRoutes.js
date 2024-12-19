import express from 'express';
import { analyzeText } from '../controllers/analyzeController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Route protégée pour l'analyse de texte
router.post('/analyze', verifyToken, analyzeText);

export default router;
