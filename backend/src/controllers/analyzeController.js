import { analyzer } from '../../src/analyzer.js';

const analyzeText = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Le texte est requis' });
        }

        // Utiliser l'analyseur existant
        const analysis = analyzer.analyze(text);

        res.json(analysis);
    } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
        res.status(500).json({ error: 'Erreur lors de l\'analyse du texte' });
    }
};

export { analyzeText };
