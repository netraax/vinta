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
    venteAvecDate: /(?:Vente|Paiements de Vinted)\n([^€\n]+)\n(\d+[,.]\d{2}) ?€\n(\d{1,2} \w+ 2024)/g,
    venteStat: /([^,]+), prix : (\d+[,.]\d{2}) €, marque : ([^\n]+?)(?:, taille[^\n]+)?\nVendu\n(\d+) vues\n\n(\d+) favoris/g,

    // Marketing et finances
    boost: /(\d{1,2} \w+ 2024)\nCommande d'un Boost[^€]*-(\d+[,.]\d{2}) ?€/g,
    vitrine: /(\d{1,2} \w+ 2024)\nCommande Dressing en vitrine[^€]*-(\d+[,.]\d{2}) ?€/g,
    transfert: /(\d{1,2} \w+ 2024)\nTransfert vers le compte[^€]*-(\d+[,.]\d{2}) ?€/g,
    solde: /Solde final\s+(\d+[,.]\d{2})\s*€/
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

// Export des fonctionnalités
export { patterns, extractors };
