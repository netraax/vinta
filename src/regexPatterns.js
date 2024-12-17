// Patterns d'extraction pour l'analyse de texte Vinted
const patterns = {
    // Info basique boutique
    username: /([A-Za-z0-9_]+)\nÀ propos/,
    nom: /Rechercher des membres\s*\n\s*([^\n]+?)(?=\s*Pro|\s*@|$)/m,
    localisation: /À propos :[\s\n]*([^,\n]+),\s*([^\n]+)/,
    email: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/,
    telephone: /(\+\d{11})/,
    
    // Info entreprise
    numeroEntreprise: /Numéro d'entreprise[^\d]*(\d+)/,
    rcs: /(\d+)\s*R\.C\.S\s*([^\n]+)/,
    
    // Stats et évaluations
    note: /\n([0-9]\.[0-9])\n\n\([0-9]+\)/,
    commentaire: /(?:il y a [^\n]+)\n([^\n]+?)(?:\nTraduire|\n|$)/g,
    abonnes: /(\d+)\s*Abonnés/,
    articlesActifs: /(\d+)\s*articles(?![^{]*vendus)/,

    // Ventes
    venteAvecDate: /Vente\s+([^€\n]+)\s+(\d+[.,]\d+)\s*€\s+(\d+\s+[^\n]+\s+2024)/g,
    venteStat: new RegExp([
        '([^,]+?),\\s*',
        'prix\\s*:\\s*(\\d+[.,]\\d+)\\s*€,\\s*',
        'marque\\s*:\\s*([^,]+?),\\s*',
        'Vendu[^]*?',
        '(\\d+)\\s*vues[^]*?',
        '(\\d+)\\s*favoris'
    ].join(''), 'g'),

    // Marketing et finances
    boost: /Commande d'un Boost[^€]*(\d+[.,]\d+)\s*€\s+(\d+\s+[^\n]+\s+2024)/g,
    vitrine: /Commande Dressing en vitrine[^€]*(\d+[.,]\d+)\s*€\s+(\d+\s+[^\n]+\s+2024)/g,
    transfert: /Transfert vers le compte[^€]*(\d+[.,]\d+)\s*€\s+(\d+\s+[^\n]+\s+2024)/g,
    solde: /Solde final\s+(\d+[.,]\d+)\s*€/
};

// Extracteurs de données
const extractors = {
    // Fonction utilitaire pour extraire avec un pattern
    extract: (pattern, str, group = 1) => {
        const match = str.match(pattern);
        return match ? match[group] : null;
    },

    // Extraction de toutes les occurrences d'un pattern
    extractAll: (pattern, str) => {
        const matches = [];
        let match;
        while ((match = pattern.exec(str)) !== null) {
            matches.push(match);
        }
        return matches;
    }
};

// Transformateurs de données
const transformers = {
    // Convertit une chaîne de prix en nombre
    parsePrice: (priceStr) => {
        return parseFloat(priceStr.replace(',', '.'));
    },

    // Formate une date
    formatDate: (dateStr) => {
        return dateStr.trim();
    }
};

// Export des fonctionnalités
export { patterns, extractors, transformers };
