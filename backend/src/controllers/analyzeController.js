// Contrôleur d'analyse simplifié
const analyzeText = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Le texte est requis' });
        }

        // Pour l'instant, on renvoie juste une confirmation
        res.json({ 
            success: true,
            message: 'Texte reçu avec succès',
            textLength: text.length
        });
    } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
        res.status(500).json({ error: 'Erreur lors de l\'analyse du texte' });
    }
};

export { analyzeText };
