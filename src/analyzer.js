import { patterns, extractors } from './regexPatterns.js';
import { languagePatterns, exclusionPatterns } from './languagePatterns.js';

const transformers = {
    parsePrice(priceStr) {
        return parseFloat(priceStr.replace(',', '.'));
    },
    formatDate(dateStr) {
        if (/^\d{1,2} \w+ 2024$/.test(dateStr)) {
            return dateStr;
        }
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
            console.log('📝 Longueur du texte:', text.length, 'caractères');
            
            this._extractBoutiqueInfo(text);
            this._extractVentes(text);
            this._extractMarketing(text);
            this._extractFinances(text);
            this._extractDepenses(text);

            console.group('📊 Résumé de l\'analyse');

            console.group('🏪 Informations Boutique');
            console.log('Nom:', this.result.boutique.nom);
            console.log('Username:', this.result.boutique.username);
            console.log('Localisation:', this.result.boutique.localisation.ville, this.result.boutique.localisation.pays);
            console.log('Contact:', {
                email: this.result.boutique.contact.email,
                telephone: this.result.boutique.contact.telephone
            });
            console.log('Stats:', {
                abonnés: this.result.boutique.stats.abonnes,
                articlesActifs: this.result.boutique.stats.articlesActifs,
                note: this.result.boutique.stats.note
            });
            console.groupEnd();

            console.group('💰 Ventes');
            console.log('Nombre total de ventes:', this.result.ventes.length);
            console.log('Dernières ventes:', this.result.ventes.slice(-3));
            console.log('Stats détaillées:', {
                totalVentes: this.result.ventes_stat.length,
                totalVues: this.result.ventes_stat.reduce((acc, v) => acc + (parseInt(v.vues) || 0), 0),
                totalFavoris: this.result.ventes_stat.reduce((acc, v) => acc + (parseInt(v.favoris) || 0), 0)
            });
            console.groupEnd();

            console.group('📢 Marketing');
            console.log('Boosts:', {
                nombre: this.result.marketing.boosts.length,
                derniers: this.result.marketing.boosts.slice(-3)
            });
            console.log('Dressing en vitrine:', {
                nombre: this.result.marketing.dressingVitrine.length,
                derniers: this.result.marketing.dressingVitrine.slice(-3)
            });
            console.groupEnd();

            console.group('💶 Finances');
            console.log('Transferts:', {
                nombre: this.result.finances.transferts.length,
                derniers: this.result.finances.transferts.slice(-3)
            });
            console.log('Solde actuel:', this.result.finances.soldeActuel.toFixed(2) + ' €');
            console.groupEnd();

            console.group('💸 Dépenses');
            console.log('Nombre total de dépenses:', this.result.depenses.length);
            const totalDepenses = this.result.depenses.reduce((acc, d) => acc + d.montant, 0);
            console.log('Total dépenses:', totalDepenses.toFixed(2) + ' €');
            console.log('Répartition:', {
                boosts: this.result.depenses.filter(d => d.type === 'boost').length,
                vitrine: this.result.depenses.filter(d => d.type === 'vitrine').length,
                transferts: this.result.depenses.filter(d => d.type === 'transfert').length
            });
            console.groupEnd();

            console.groupEnd(); // Fin du résumé
            console.groupEnd(); // Fin de l'analyse

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

        const note = extractors.extract(patterns.note, text);
        if (note) {
            this.result.boutique.stats.note = parseFloat(note);
        }

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
        console.group('🔍 Analyse détaillée des commentaires par pays');
        
        const ventesParPays = {
            italie: 0,
            espagne: 0,
            allemagne: 0,
            republiqueTcheque: 0,
            lituanie: 0,
            paysBas: 0,
            royaumeUni: 0
        };

        console.log('📝 Mots-clés recherchés par pays:');
        Object.entries(languagePatterns).forEach(([pays, { pattern, examples }]) => {
            console.log(`${pays}:`, pattern);
            console.log('Exemples:', examples.join(', '));
        });

        const ventesTotales = {
            ...ventesParPays,
            france: 0
        };

        commentaires.forEach((commentaire, index) => {
            console.group(`\n💬 Analyse du commentaire #${index + 1}:`);
            console.log(`Commentaire: "${commentaire}"`);
            
            // Ignorer les évaluations automatiques
            if (commentaire.includes("Évaluation automatique")) {
                console.log('⏭️ Évaluation automatique ignorée');
                console.groupEnd();
                return;
            }
            
            let paysDetectes = [];
            let matchCount = {};
            
            // Compter le nombre de correspondances pour chaque langue
            Object.entries(languagePatterns).forEach(([pays, { pattern }]) => {
                const matches = (commentaire.match(pattern) || []).length;
                if (matches > 0) {
                    matchCount[pays] = matches;
                }
            });

            // Déterminer la langue la plus probable
            if (Object.keys(matchCount).length > 0) {
                const [langueDetectee, _] = Object.entries(matchCount)
                    .sort(([,a], [,b]) => b - a)[0];

                // Cas spéciaux
                if (langueDetectee === 'anglais') {
                    // Vérifier si c'est plus probablement néerlandais
                    if (exclusionPatterns.anglais.test(commentaire)) {
                        ventesParPays.paysBas++;
                        ventesTotales.paysBas++;
                        paysDetectes.push('🇳🇱 Pays-Bas');
                    } else {
                        ventesParPays.royaumeUni++;
                        ventesTotales.royaumeUni++;
                        paysDetectes.push('🇬🇧 Royaume-Uni');
                    }
                } else if (langueDetectee === 'espagne' && exclusionPatterns.espagne.test(commentaire)) {
                    console.log('⚠️ Commentaire ignoré car probablement en français');
                    ventesTotales.france++;
                } else if (langueDetectee === 'allemagne' && exclusionPatterns.allemagne.test(commentaire)) {
                    console.log('⚠️ Commentaire ignoré car probablement en français');
                    ventesTotales.france++;
                } else if (langueDetectee === 'france') {
                    ventesTotales.france++;
                    paysDetectes.push('🇫🇷 France (non compté)');
                } else {
                    ventesParPays[langueDetectee]++;
                    ventesTotales[langueDetectee]++;
                    const emojis = {
                        italie: '🇮🇹',
                        espagne: '🇪🇸',
                        allemagne: '🇩🇪',
                        republiqueTcheque: '🇨🇿',
                        lituanie: '🇱🇹'
                    };
                    paysDetectes.push(`${emojis[langueDetectee]} ${langueDetectee.charAt(0).toUpperCase() + langueDetectee.slice(1)}`);
                }
            }

            if (paysDetectes.length > 0) {
                console.log('✅ Pays détectés:', paysDetectes.join(', '));
                console.log('📊 Nombre de correspondances:', matchCount);
            } else {
                console.log('❌ Aucun pays détecté');
            }
            console.groupEnd();
        });
        
        console.log('\n📊 Résumé des ventes par pays (hors France):');
        Object.entries(ventesParPays).forEach(([pays, nombre]) => {
            const emoji = {
                italie: '🇮🇹',
                espagne: '🇪🇸',
                allemagne: '🇩🇪',
                republiqueTcheque: '🇨🇿',
                lituanie: '🇱🇹',
                paysBas: '🇳🇱',
                royaumeUni: '🇬🇧'
            };
            console.log(`${emoji[pays]} ${pays}: ${nombre} vente(s)`);
        });

        console.log('\n🔍 Statistiques complètes (incluant la France):');
        console.log(ventesTotales);

        // Stocker les ventes totales (incluant la France) pour le calcul des pourcentages
        this.result.boutique.stats.ventesTotales = ventesTotales;
        
        // Pour le graphique, on n'utilise que les ventes internationales
        this.result.boutique.stats.ventesParPays = ventesParPays;

        console.groupEnd();
        return ventesParPays;
    }

    _extractVentes(text) {
        console.group('💰 Extraction des ventes');
        
        // 1. Extraction des ventes confirmées (pour CA)
        const ventesMatches = extractors.extractAll(patterns.venteAvecDate, text);
        console.log('📊 Ventes confirmées trouvées:', ventesMatches.length);
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

        // 2. Extraction des stats de vente
        console.group('🔍 Débogage extraction stats');
        console.log('Pattern venteStat:', patterns.venteStat);
        
        // Recherche d'un exemple de texte qui pourrait correspondre
        const texteSample = text.slice(0, 1000);
        console.log('Échantillon de texte à analyser:', texteSample);
        
        const ventesStatMatches = extractors.extractAll(patterns.venteStat, text);
        console.log('📈 Stats de ventes trouvées:', ventesStatMatches.length);
        
        if (ventesStatMatches.length > 0) {
            console.log('Premier match trouvé:', ventesStatMatches[0]);
        } else {
            console.log('❌ Aucun match trouvé pour les stats');
            // Recherche de motifs similaires
            const simpleVuesPattern = /(\d+)\s*vues/g;
            const vuesMatches = text.match(simpleVuesPattern);
            console.log('Nombre de "vues" trouvées avec pattern simple:', vuesMatches ? vuesMatches.length : 0);
            if (vuesMatches) {
                console.log('Exemples de matches "vues":', vuesMatches.slice(0, 3));
            }
        }
        console.groupEnd();

        this.result.ventes_stat = ventesStatMatches.map(match => ({
            nom: match[1].trim(),
            prix: transformers.parsePrice(match[2]),
            marque: match[3].trim(),
            vues: match[4],
            favoris: match[5]
        }));

        // Afficher les résumés
        console.group('📅 Ventes réelles (transactions validées)');
        console.log('Nombre total de ventes:', this.result.ventes.length);
        if (this.result.ventes.length > 0) {
            console.table(this.result.ventes);
            const totalCA = this.result.ventes.reduce((sum, v) => sum + v.prix, 0);
            console.log('Chiffre d\'affaires total:', totalCA.toFixed(2) + '€');
            console.log('Prix moyen de vente:', (totalCA / this.result.ventes.length).toFixed(2) + '€');
        }
        console.groupEnd();

        console.group('📊 Statistiques des ventes');
        console.log('Nombre d\'articles avec stats:', this.result.ventes_stat.length);
        if (this.result.ventes_stat.length > 0) {
            const totalVues = this.result.ventes_stat.reduce((acc, v) => acc + parseInt(v.vues), 0);
            const totalFavoris = this.result.ventes_stat.reduce((acc, v) => acc + parseInt(v.favoris), 0);
            const tauxEngagement = totalVues > 0 ? (totalFavoris / totalVues * 100).toFixed(2) : 0;

            console.log('Statistiques globales:', {
                totalVues,
                totalFavoris,
                tauxEngagement: tauxEngagement + '%',
                vueMoyenneParArticle: (totalVues / this.result.ventes_stat.length).toFixed(1),
                favorisMoyenParArticle: (totalFavoris / this.result.ventes_stat.length).toFixed(1)
            });

            console.log('Top 5 articles par vues:');
            console.table(
                [...this.result.ventes_stat]
                    .sort((a, b) => parseInt(b.vues) - parseInt(a.vues))
                    .slice(0, 5)
            );
        }
        console.groupEnd();

        console.groupEnd(); // Fin de l'extraction des ventes
    }

    _extractMarketing(text) {
        console.group('📢 Extraction marketing');
        
        const boostMatches = extractors.extractAll(patterns.boost, text);
        this.result.marketing.boosts = boostMatches.map(match => ({
            date: transformers.formatDate(match[1]),
            montant: transformers.parsePrice(match[2])
        }));

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
        
        const transfertMatches = extractors.extractAll(patterns.transfert, text);
        this.result.finances.transferts = transfertMatches.map(match => ({
            date: transformers.formatDate(match[1]),
            montant: transformers.parsePrice(match[2])
        }));

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
        
        while ((match = patterns.boost.exec(text)) !== null) {
            depenses.push({
                type: 'boost',
                date: transformers.formatDate(match[1]),
                montant: transformers.parsePrice(match[2])
            });
        }
        
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
