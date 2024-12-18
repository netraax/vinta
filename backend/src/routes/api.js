const express = require('express');
const router = express.Router();
const Analyzer = require('../utils/analyzer');

// Analyser le texte
router.post('/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        const result = await Analyzer.analyze(text);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Erreur d'analyse" });
    }
});

// Sauvegarder les données du dashboard
router.post('/dashboard/save', async (req, res) => {
    try {
        const { data } = req.body;
        // TODO: Sauvegarder dans MySQL quand disponible
        res.json({ message: "Données sauvegardées" });
    } catch (error) {
        res.status(500).json({ error: "Erreur de sauvegarde" });
    }
});

// Récupérer les données du dashboard
router.get('/dashboard/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // TODO: Récupérer depuis MySQL
        res.json({ message: "Données récupérées" });
    } catch (error) {
        res.status(500).json({ error: "Erreur de récupération" });
    }
});

module.exports = router;
