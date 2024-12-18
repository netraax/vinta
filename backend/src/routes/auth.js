const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Route d'inscription
router.post('/register', async (req, res) => {
    try {
        // TODO: Implémenter l'inscription
        res.status(201).json({ message: "Compte créé avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    try {
        // TODO: Implémenter la connexion
        res.json({ token: "token_temporaire" });
    } catch (error) {
        res.status(401).json({ error: "Identifiants invalides" });
    }
});

// Route de déconnexion
router.post('/logout', (req, res) => {
    res.json({ message: "Déconnecté avec succès" });
});

module.exports = router;
