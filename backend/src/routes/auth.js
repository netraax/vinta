const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Route d'inscription
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Vérification des champs requis
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Tous les champs sont requis" });
        }

        // Création de l'utilisateur
        const userId = await User.create({ username, email, password });
        
        res.status(201).json({ 
            message: "Compte créé avec succès",
            userId 
        });
    } catch (error) {
        if (error.message === 'Username ou email déjà utilisé') {
            return res.status(400).json({ error: error.message });
        }
        console.error('Erreur inscription:', error);
        res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérification des champs requis
        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe requis" });
        }

        // Recherche de l'utilisateur
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        // Vérification du mot de passe
        const validPassword = await User.verifyPassword(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        // Création du token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            message: "Connexion réussie",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erreur connexion:', error);
        res.status(500).json({ error: "Erreur lors de la connexion" });
    }
});

// Route de déconnexion
router.post('/logout', (req, res) => {
    // Pas besoin de logique côté serveur pour JWT
    // Le client doit simplement supprimer le token
    res.json({ message: "Déconnecté avec succès" });
});

module.exports = router;
