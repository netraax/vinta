import { store } from '../dataStore.js';
import { analyzer } from '../analyzer.js';

class DashboardUpdateModule {
    constructor(containerId) {
        this.containerId = containerId;
        this.element = this.createModule();
        this.setupEventListeners();
        this.mount();
    }

    mount() {
        document.body.appendChild(this.element);
    }

    createModule() {
        const container = document.createElement('div');
        container.id = this.containerId;
        container.innerHTML = `
            <button id="quickUpdateBtn" class="fixed bottom-4 right-4 bg-violet-600 hover:bg-violet-700 text-white rounded-full p-4 shadow-lg z-50">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </button>

            <div id="quickUpdateModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-dark-800 rounded-lg p-6 w-full max-w-2xl">
                    <h3 class="text-xl font-bold text-gray-200 mb-4">Mise à jour rapide</h3>
                    <textarea 
                        id="quickUpdateInput"
                        class="w-full h-64 bg-dark-700 text-gray-200 p-4 rounded-lg mb-4"
                        placeholder="Collez ici le contenu de votre tableau de bord Vinted..."
                    ></textarea>
                    <div class="flex justify-end space-x-4">
                        <button id="quickUpdateCancel" class="px-4 py-2 text-gray-400 hover:text-gray-200">
                            Annuler
                        </button>
                        <button id="quickUpdateConfirm" class="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg">
                            Mettre à jour
                        </button>
                    </div>
                </div>
            </div>
        `;
        return container;
    }

    async analyzeUpdate(rawText) {
        try {
            console.log('🔍 Analyse du texte reçu');

            // Récupérer l'état actuel
            const currentState = store.getState();
            const currentData = currentState.analyzedData || {
                boutique: {},
                marketing: { boosts: [], dressingVitrine: [] },
                finances: { transferts: [], soldeActuel: 0 },
                ventes: [],
                ventes_stat: [],
                depenses: []
            };

            // Extraire uniquement les ventes du texte
            const ventesText = this.extractVentesSection(rawText);
            console.log('📝 Ventes extraites:', ventesText);
            
            if (!ventesText.trim()) {
                console.log('❌ Aucune vente trouvée dans le texte');
                return currentData;
            }

            // Créer un texte complet pour l'analyseur
            const fullText = this.createFullText(currentData, ventesText);
            console.log('📄 Texte préparé pour l\'analyseur:', fullText);

            // Utiliser l'analyseur existant
            const newData = await analyzer.analyze(fullText);
            
            if (!newData.ventes || newData.ventes.length === 0) {
                console.log('❌ L\'analyseur n\'a trouvé aucune vente');
                return currentData;
            }

            console.log('✨ Nouvelles ventes trouvées:', newData.ventes);

            // Fusionner les données
            const mergedData = {
                boutique: currentData.boutique,
                ventes: this.mergeVentes(currentData.ventes, newData.ventes),
                ventes_stat: currentData.ventes_stat,
                marketing: currentData.marketing,
                finances: currentData.finances,
                depenses: currentData.depenses
            };

            const newVentesCount = mergedData.ventes.length - currentData.ventes.length;
            console.log(`✅ ${newVentesCount} nouvelles ventes ajoutées`);

            return mergedData;

        } catch (error) {
            console.error('Erreur lors de la fusion des données:', error);
            throw error;
        }
    }

    extractVentesSection(text) {
        const lines = text.split('\n');
        const ventesData = [];
        let currentDate = new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        console.log('🔍 Analyse des lignes pour les ventes');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Si c'est une ligne de vente avec montant
            if (line.startsWith('Vente') && i + 1 < lines.length) {
                const montantLine = lines[i + 1].trim();
                if (montantLine.includes('€')) {
                    const montant = montantLine.replace('€', '').trim();
                    console.log('💰 Vente trouvée:', montant);
                    
                    ventesData.push(`Vente\nArticle vendu\n${montant} €\n${currentDate}`);
                    i++; // Sauter la ligne du montant
                }
            }
        }

        console.log('📊 Nombre de ventes trouvées:', ventesData.length);
        return ventesData.join('\n\n');
    }

    createFullText(currentData, newVentesText) {
        // Récupérer les infos boutique actuelles
        const { boutique } = currentData;
        
        // Créer un en-tête avec les infos boutique
        const header = `À propos :
${boutique.localisation?.ville || 'Ville'}, ${boutique.localisation?.pays || 'France'}
${boutique.nom || 'Nom'}
${boutique.username || 'Username'}
${boutique.stats?.abonnes || '0'} Abonnés
${boutique.stats?.articlesActifs || '0'} articles
Note : ${boutique.stats?.note || '5.0'} (${boutique.stats?.evaluations || '0'})
`;

        // Ajouter les nouvelles ventes
        return `${header}\n${newVentesText}`;
    }

    mergeVentes(existingVentes, newVentes) {
        if (!newVentes || newVentes.length === 0) {
            console.log('❌ Pas de nouvelles ventes à fusionner');
            return existingVentes;
        }
        
        console.log('📊 Ventes existantes:', existingVentes.length);
        console.log('📊 Nouvelles ventes:', newVentes.length);
        
        const existingDates = new Set(existingVentes.map(v => 
            `${v.description}-${v.montant}-${v.date}`
        ));

        const newUniqueSales = newVentes.filter(vente => {
            const key = `${vente.description}-${vente.montant}-${vente.date}`;
            const isUnique = !existingDates.has(key);
            if (isUnique) {
                console.log('✨ Nouvelle vente unique trouvée:', vente);
            }
            return isUnique;
        });

        console.log('✅ Nouvelles ventes uniques:', newUniqueSales.length);
        return [...existingVentes, ...newUniqueSales];
    }

    setupEventListeners() {
        const updateBtn = this.element.querySelector('#quickUpdateBtn');
        const modal = this.element.querySelector('#quickUpdateModal');
        const cancelBtn = this.element.querySelector('#quickUpdateCancel');
        const confirmBtn = this.element.querySelector('#quickUpdateConfirm');

        updateBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });

        cancelBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        confirmBtn.addEventListener('click', async () => {
            const textarea = this.element.querySelector('#quickUpdateInput');
            const rawText = textarea.value;
            
            if (!rawText.trim()) {
                alert('Veuillez coller des données valides');
                return;
            }

            try {
                // Analyser et fusionner les données
                const mergedData = await this.analyzeUpdate(rawText);
                
                // Vérifier si des nouvelles ventes ont été ajoutées
                const currentState = store.getState();
                const currentVentesCount = currentState.analyzedData?.ventes?.length || 0;
                const newVentesCount = mergedData.ventes.length;

                if (newVentesCount > currentVentesCount) {
                    // Mettre à jour le store seulement si il y a de nouvelles ventes
                    store.setState({
                        analyzedData: mergedData
                    });
                    alert(`✅ ${newVentesCount - currentVentesCount} nouvelles ventes ajoutées avec succès !`);
                } else {
                    alert('❌ Aucune nouvelle vente trouvée dans les données');
                }

                modal.classList.add('hidden');
                textarea.value = '';
                
            } catch (error) {
                console.error('Erreur lors de la mise à jour:', error);
                alert('Une erreur est survenue lors de l\'analyse des données');
            }
        });
    }
}

export default DashboardUpdateModule;
