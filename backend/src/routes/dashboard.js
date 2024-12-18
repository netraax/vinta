const express = require('express');
const router = express.Router();

// Middleware d'authentification
const auth = require('../middleware/auth');

// Récupérer les données du dashboard
router.get('/', auth, async (req, res) => {
    try {
        // TODO: Récupérer les données de l'utilisateur
        res.json({ message: "Données du dashboard" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des données" });
    }
});

// Mettre à jour les données
router.post('/update', auth, async (req, res) => {
    try {
        // TODO: Sauvegarder les nouvelles données
        res.json({ message: "Données mises à jour avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
});

// Récupérer l'historique
router.get('/history', auth, async (req, res) => {
    try {
        // TODO: Récupérer l'historique des données
        res.json({ message: "Historique des données" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'historique" });
    }
});

module.exports = router;
