import { patterns, extractors, transformers } from './regexPatterns.js';

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
            ventes_stat: []
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
                }
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
        this.result.ventes = ventesMatches.map(match => ({
            nom: match[1].trim(),
            prix: transformers.parsePrice(match[2]),
            date: transformers.formatDate(match[3])
        }));

        // Ventes stats (pour statistiques uniquement)
        const statsMatches = extractors.extractAll(patterns.venteStat, text);
        this.result.ventes_stat = statsMatches.map(match => ({
            nom: match[1].trim(),
            prix: transformers.parsePrice(match[2]),
            marque: match[3].trim(),
            vues: parseInt(match[4]),
            favoris: parseInt(match[5])
        }));

        // Affichage des ventes réelles
        console.group('📅 Ventes réelles (transactions validées)');
        console.log('Nombre total de ventes:', this.result.ventes.length);
        if (this.result.ventes.length > 0) {
            const totalCA = this.result.ventes.reduce((sum, v) => sum + v.prix, 0);
            console.log('Chiffre d\'affaires total:', totalCA.toFixed(2) + '€');
            console.log('Prix moyen de vente:', (totalCA / this.result.ventes.length).toFixed(2) + '€');
            
            console.group('5 dernières ventes:');
            console.table(this.result.ventes.slice(-5).map(v => ({
                nom: v.nom,
                prix: v.prix + '€',
                date: v.date
            })));
            console.groupEnd();
        }
        console.groupEnd();

        // Statistiques détaillées des articles vendus
        console.group('📊 Statistiques des articles vendus');
        if (this.result.ventes_stat.length > 0) {
            // Stats par marque
            const marqueStats = this.result.ventes_stat.reduce((acc, v) => {
                if (!acc[v.marque]) {
                    acc[v.marque] = {
                        count: 0,
                        totalPrix: 0,
                        totalVues: 0,
                        totalFavoris: 0
                    };
                }
                acc[v.marque].count++;
                acc[v.marque].totalPrix += v.prix;
                acc[v.marque].totalVues += v.vues;
                acc[v.marque].totalFavoris += v.favoris;
                return acc;
            }, {});

            // Stats globales
            const globalStats = this.result.ventes_stat.reduce((acc, v) => ({
                totalPrix: acc.totalPrix + v.prix,
                totalVues: acc.totalVues + v.vues,
                totalFavoris: acc.totalFavoris + v.favoris
            }), { totalPrix: 0, totalVues: 0, totalFavoris: 0 });

            console.log('Nombre d\'articles analysés:', this.result.ventes_stat.length);
            console.log('Statistiques globales:');
            console.log('- Prix moyen:', (globalStats.totalPrix / this.result.ventes_stat.length).toFixed(2) + '€');
            console.log('- Moyenne vues/article:', (globalStats.totalVues / this.result.ventes_stat.length).toFixed(2));
            console.log('- Moyenne favoris/article:', (globalStats.totalFavoris / this.result.ventes_stat.length).toFixed(2));

            console.group('Statistiques par marque:');
            Object.entries(marqueStats)
                .sort((a, b) => b[1].count - a[1].count)
                .forEach(([marque, stats]) => {
                    console.log(`\n${marque}:`);
                    console.log(`- Nombre d'articles: ${stats.count}`);
                    console.log(`- Prix moyen: ${(stats.totalPrix / stats.count).toFixed(2)}€`);
                    console.log(`- Moyenne vues: ${(stats.totalVues / stats.count).toFixed(2)}`);
                    console.log(`- Moyenne favoris: ${(stats.totalFavoris / stats.count).toFixed(2)}`);
                });
            console.groupEnd();
        }
        console.groupEnd();

        console.groupEnd();
    }

    _extractMarketing(text) {
        console.group('📢 Extraction marketing');
        
        // Boosts
        const boostMatches = extractors.extractAll(patterns.boost, text);
        this.result.marketing.boosts = boostMatches.map(match => ({
            montant: transformers.parsePrice(match[1]),
            date: transformers.formatDate(match[2])
        }));

        // Dressing en vitrine
        const vitrineMatches = extractors.extractAll(patterns.vitrine, text);
        this.result.marketing.dressingVitrine = vitrineMatches.map(match => ({
            montant: transformers.parsePrice(match[1]),
            date: transformers.formatDate(match[2])
        }));

        console.log('Boosts:', this.result.marketing.boosts.length);
        console.log('Vitrines:', this.result.marketing.dressingVitrine.length);
        console.groupEnd();
    }

    _extractFinances(text) {
        console.group('💶 Extraction finances');
        
        // Transferts
        const transfertMatches = extractors.extractAll(patterns.transfert, text);
        this.result.finances.transferts = transfertMatches.map(match => ({
            montant: transformers.parsePrice(match[1]),
            date: transformers.formatDate(match[2])
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
}

export const analyzer = new VintedAnalyzer();
