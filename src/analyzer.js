import { patterns, extractors } from './regexPatterns.js';

const transformers = {
    parsePrice(priceStr) {
        return parseFloat(priceStr.replace(',', '.'));
    },
    formatDate(dateStr) {
        // Si la date est déjà au format "28 novembre 2024", on la retourne telle quelle
        if (/^\d{1,2} \w+ 2024$/.test(dateStr)) {
            return dateStr;
        }
        // Sinon on la transforme
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
};

class VintedAnalyzer {
    constructor() {
        this.result = {
            boutique: {
                nom: '',
                username: '',
                localisation: {
                    ville: '',
                    pays: ''
                },
                contact: {
                    email: '',
                    telephone: ''
                },
                entreprise: {
                    numero: '',
                    rcs: {
                        numero: '',
                        ville: ''
                    }
                },
                stats: {
                    abonnes: 0,
                    articlesActifs: 0,
                    note: 0,
                    ventesParPays: {
                        italie: 0,
                        espagne: 0,
                        allemagne: 0,
                        republiqueTcheque: 0,
                        lituanie: 0,
                        paysBas: 0,
                        royaumeUni: 0
                    }
                }
            },
            marketing: {
                boosts: [],
                dressingVitrine: []
            },
            finances: {
                transferts: [],
                soldeActuel: 0
            },
            ventes: [],
            ventes_stat: [],
            depenses: []
        };
    }

    analyze(text) {
        try {
            console.group('🔍 Analyse du texte Vinted');
            console.log('Longueur du texte:', text.length, 'caractères');
            
            this._extractBoutiqueInfo(text);
            this._extractVentes(text);
            this._extractMarketing(text);
            this._extractFinances(text);
            this._extractDepenses(text);

            console.log('✅ Résultat de l\'analyse:', {
                boutique: {
                    ...this.result.boutique,
                    stats: this.result.boutique.stats
                },
                ventes: {
                    total: this.result.ventes.length,
                    dernières: this.result.ventes.slice(-3)
                },
                marketing: {
                    boosts: this.result.marketing.boosts.length,
                    vitrine: this.result.marketing.dressingVitrine.length
                },
                finances: {
                    transferts: this.result.finances.transferts.length,
                    solde: this.result.finances.soldeActuel
                },
                depenses: this.result.depenses.length
            });
            console.groupEnd();

            return this.result;
        } catch (error) {
            console.error('❌ Erreur lors de l\'analyse:', error);
            throw error;
        }
    }

    _extractBoutiqueInfo(text) {
        console.group('📊 Extraction info boutique');
        
        const boutiqueInfo = {
            username: extractors.extract(patterns.username, text) || '',
            nom: extractors.extract(patterns.nom, text) || '',
            localisation: this.extractLocalization(text),
            email: extractors.extract(patterns.email, text) || '',
            telephone: extractors.extract(patterns.telephone, text) || '',
        };

        this.result.boutique.username = boutiqueInfo.username;
        this.result.boutique.nom = boutiqueInfo.nom;
        this.result.boutique.localisation = boutiqueInfo.localisation;
        this.result.boutique.contact.email = boutiqueInfo.email;
        this.result.boutique.contact.telephone = boutiqueInfo.telephone;

        const rcsMatch = text.match(patterns.rcs);
        if (rcsMatch) {
            this.result.boutique.entreprise.rcs = `${rcsMatch[1]} R.C.S ${rcsMatch[2].trim()}`;
        }

        this.result.boutique.stats.abonnes = parseInt(extractors.extract(patterns.abonnes, text) || '0');
        this.result.boutique.stats.articlesActifs = parseInt(extractors.extract(patterns.articlesActifs, text) || '0');

        // Extraction de la note
        const note = extractors.extract(patterns.note, text);
        if (note) {
            this.result.boutique.stats.note = parseFloat(note);
        }

        // Analyse des commentaires pour les ventes par pays
        const commentaires = [];
        let match;
        while ((match = patterns.commentaire.exec(text)) !== null) {
            commentaires.push(match[1]);
        }

        const ventesParPays = this._analyserLanguesCommentaires(commentaires);
        this.result.boutique.stats.ventesParPays = ventesParPays;

        console.log('Info boutique extraites:', this.result.boutique);
        console.log('📊 Note globale:', this.result.boutique.stats.note);
        console.log('🌍 Ventes par pays:', ventesParPays);
        console.groupEnd();
    }

    extractLocalization(text) {
        const match = text.match(patterns.localisation);
        if (match && match[1] && match[2]) {
            return {
                ville: match[1].trim(),
                pays: match[2].trim()
            };
        }
        return null;
    }

    _analyserLanguesCommentaires(commentaires) {
        const ventesParPays = {
            italie: 0,
            espagne: 0,
            allemagne: 0,
            republiqueTcheque: 0,
            lituanie: 0,
            paysBas: 0,
            royaumeUni: 0
        };

        const patterns = {
            italie: /\b(grazie|oggetto|venditor[ei]|gentil[ei]|perfetto|tutto)\b/i,
            espagne: /\b(gracias|todo|bien|perfecto|vendedor[ae]?)\b/i,
            allemagne: /\b(danke|sehr|gut|perfekt|verkäufer(in)?)\b/i,
            republiqueTcheque: /\b(děkuji|dobře|perfektní|prodejce|zboží)\b/i,
            lituanie: /\b(ačiū|puiku|tobula|pardavėjas|prekė)\b/i,
            anglais: /\b(thank|perfect|good|great|seller|received)\b/i
        };

        commentaires.forEach(commentaire => {
            // Vérifier la langue du commentaire
            if (patterns.italie.test(commentaire)) ventesParPays.italie++;
            if (patterns.espagne.test(commentaire)) ventesParPays.espagne++;
            if (patterns.allemagne.test(commentaire)) ventesParPays.allemagne++;
            if (patterns.republiqueTcheque.test(commentaire)) ventesParPays.republiqueTcheque++;
            if (patterns.lituanie.test(commentaire)) ventesParPays.lituanie++;
            if (patterns.anglais.test(commentaire)) {
                // Les commentaires en anglais sont comptés pour Pays-Bas et Royaume-Uni
                ventesParPays.paysBas++;
                ventesParPays.royaumeUni++;
            }
        });

        return ventesParPays;
    }

    _extractVentes(text) {
        console.group('💰 Extraction des ventes');
        
        // Ventes avec date (ventes réelles)
        const ventesMatches = extractors.extractAll(patterns.venteAvecDate, text);
        console.log('Matches trouvés:', ventesMatches.length);
        ventesMatches.forEach((match, i) => {
            console.log(`Match ${i + 1}:`, {
                full: match[0],
                nom: match[1],
                prix: match[2],
                date: match[3]
            });
        });

        this.result.ventes = ventesMatches.map(match => ({
            nom: match[1].trim(),
            prix: transformers.parsePrice(match[2]),
            date: transformers.formatDate(match[3])
        }));

        // Affichage des ventes réelles
        console.group('📅 Ventes réelles (transactions validées)');
        console.log('Nombre total de ventes:', this.result.ventes.length);
        if (this.result.ventes.length > 0) {
            console.table(this.result.ventes);
            const totalCA = this.result.ventes.reduce((sum, v) => sum + v.prix, 0);
            console.log('Chiffre d\'affaires total:', totalCA.toFixed(2) + '€');
            console.log('Prix moyen de vente:', (totalCA / this.result.ventes.length).toFixed(2) + '€');
        }
        console.groupEnd();

        console.groupEnd();
    }

    _extractMarketing(text) {
        console.group('📢 Extraction marketing');
        
        // Boosts
        const boostMatches = extractors.extractAll(patterns.boost, text);
        this.result.marketing.boosts = boostMatches.map(match => ({
            date: transformers.formatDate(match[1]),
            montant: transformers.parsePrice(match[2])
        }));

        // Dressing en vitrine
        const vitrineMatches = extractors.extractAll(patterns.vitrine, text);
        this.result.marketing.dressingVitrine = vitrineMatches.map(match => ({
            date: transformers.formatDate(match[1]),
            montant: transformers.parsePrice(match[2])
        }));

        console.log('Marketing:', {
            boosts: this.result.marketing.boosts.length,
            vitrine: this.result.marketing.dressingVitrine.length
        });
        console.groupEnd();
    }

    _extractFinances(text) {
        console.group('💶 Extraction finances');
        
        // Transferts
        const transfertMatches = extractors.extractAll(patterns.transfert, text);
        this.result.finances.transferts = transfertMatches.map(match => ({
            date: transformers.formatDate(match[1]),
            montant: transformers.parsePrice(match[2])
        }));

        // Solde actuel
        const soldeMatch = extractors.extract(patterns.solde, text);
        if (soldeMatch) {
            this.result.finances.soldeActuel = transformers.parsePrice(soldeMatch);
        }

        console.log('Nombre de transferts:', this.result.finances.transferts.length);
        console.log('Solde actuel:', this.result.finances.soldeActuel);
        console.groupEnd();
    }

    _extractDepenses(text) {
        console.group('💸 Extraction des dépenses');
        
        const depenses = [];
        let match;
        
        // Extraire les boosts
        while ((match = patterns.boost.exec(text)) !== null) {
            depenses.push({
                type: 'boost',
                date: transformers.formatDate(match[1]),
                montant: transformers.parsePrice(match[2])
            });
        }
        
        // Extraire les vitrines
        while ((match = patterns.vitrine.exec(text)) !== null) {
            depenses.push({
                type: 'vitrine',
                date: transformers.formatDate(match[1]),
                montant: transformers.parsePrice(match[2])
            });
        }
        
        this.result.depenses = depenses;

        console.log('Dépenses trouvées:', depenses.length);
        if (depenses.length > 0) {
            console.log('Première dépense:', depenses[0]);
            console.log('Dernière dépense:', depenses[depenses.length - 1]);
            console.log('Total dépensé:', depenses.reduce((sum, d) => sum + d.montant, 0), '€');
        }
        console.groupEnd();
    }

    parseDate(dateStr) {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    }
}

export const analyzer = new VintedAnalyzer();
