import { store } from './dataStore.js';
import { navigationState } from './navigation.js';
import { analyzer } from './analyzer.js';

class UIManager {
    constructor() {
        this.initialize();
    }

    initialize() {
        this._initializeElements();
        this._initializeEventListeners();
    }

    _initializeElements() {
        this.elements = {
            dashboardView: document.getElementById('dashboard-view'),
            dashboardStats: document.getElementById('dashboard-stats'),
            inputTextDashboard: document.getElementById('input-text-dashboard'),
            analyzeBtnDashboard: document.getElementById('analyze-btn-dashboard')
        };

        // Vérifier uniquement les éléments essentiels
        const requiredElements = ['dashboardView', 'dashboardStats', 'inputTextDashboard', 'analyzeBtnDashboard'];
        const missingElements = requiredElements.filter(el => !this.elements[el]);
        
        if (missingElements.length > 0) {
            console.error('Éléments manquants:', missingElements);
            return;
        }
    }

    _initializeEventListeners() {
        // Écouter les changements dans la zone de texte
        this.elements.inputTextDashboard.addEventListener('input', (e) => {
            store.dispatch({ type: 'SET_RAW_TEXT', payload: e.target.value });
        });

        // Écouter le clic sur le bouton d'analyse
        this.elements.analyzeBtnDashboard.addEventListener('click', async () => {
            const text = this.elements.inputTextDashboard.value.trim();
            if (!text) {
                this._showError('Veuillez entrer du texte à analyser');
                return;
            }

            await this._handleAnalysis(text);
        });

        // S'abonner aux changements d'état
        store.subscribe(() => {
            this._updateUI(store.getState());
        });
    }

    async _handleAnalysis(text) {
        try {
            // Désactiver le bouton pendant l'analyse
            this.elements.analyzeBtnDashboard.disabled = true;
            this.elements.analyzeBtnDashboard.textContent = 'Analyse en cours...';

            // Analyser le texte
            const analyzedData = analyzer.analyze(text);

            // Mettre à jour le store
            store.setState({ 
                analyzedData,
                ui: {
                    ...store.getState().ui,
                    activeModules: ['profile', 'sales', 'expenses']
                }
            });

            // Afficher les modules
            this._showModules();

        } catch (error) {
            console.error('Erreur lors de l\'analyse:', error);
            this._showError('Erreur lors de l\'analyse');
        } finally {
            // Réactiver le bouton
            this.elements.analyzeBtnDashboard.disabled = false;
            this.elements.analyzeBtnDashboard.textContent = 'Analyser';
        }
    }

    _showModules() {
        // Afficher les modules actifs
        const { activeModules } = store.getState().ui;
        
        if (activeModules.includes('profile')) {
            document.getElementById('profile-container').classList.remove('hidden');
        }
        
        if (activeModules.includes('sales') || activeModules.includes('expenses')) {
            const statsContainer = document.getElementById('dashboard-stats');
            statsContainer.classList.remove('hidden');
        }
    }

    _updateUI(state) {
        // Mettre à jour l'interface en fonction de l'état
        if (state.analyzedData) {
            this._updateAnalysisResults(state.analyzedData);
        }
    }

    _updateAnalysisResults(data) {
        // Mettre à jour les statistiques dans le dashboard
        if (this.elements.dashboardStats) {
            // Créer un élément pour afficher les résultats
            const resultsElement = document.createElement('div');
            resultsElement.className = 'grid gap-4';
            
            // Afficher les informations de la boutique
            if (data.boutique) {
                const boutiqueInfo = document.createElement('div');
                boutiqueInfo.className = 'bg-dark-200 p-4 rounded-lg';
                boutiqueInfo.innerHTML = `
                    <h3 class="text-lg font-semibold mb-2">Informations de la boutique</h3>
                    <p>Nom: ${data.boutique.nom || 'Non spécifié'}</p>
                    <p>Username: ${data.boutique.username || 'Non spécifié'}</p>
                    <p>Localisation: ${data.boutique.localisation.ville || 'Non spécifiée'}</p>
                    <p>Abonnés: ${data.boutique.stats.abonnes}</p>
                    <p>Articles actifs: ${data.boutique.stats.articlesActifs}</p>
                    <p>Note: ${data.boutique.stats.note}</p>
                `;
                resultsElement.appendChild(boutiqueInfo);
            }

            // Afficher les ventes
            if (data.ventes && data.ventes.length > 0) {
                const ventesInfo = document.createElement('div');
                ventesInfo.className = 'bg-dark-200 p-4 rounded-lg';
                ventesInfo.innerHTML = `
                    <h3 class="text-lg font-semibold mb-2">Dernières ventes</h3>
                    <ul class="space-y-2">
                        ${data.ventes.map(vente => `
                            <li class="border-b border-dark-300 pb-2">
                                Date: ${vente.date || 'Non spécifiée'}<br>
                                Prix: ${vente.prix || 'Non spécifié'}
                            </li>
                        `).join('')}
                    </ul>
                `;
                resultsElement.appendChild(ventesInfo);
            }

            // Vider le conteneur et ajouter les nouveaux résultats
            this.elements.dashboardStats.innerHTML = '';
            this.elements.dashboardStats.appendChild(resultsElement);
        }
    }

    _showError(message) {
        // Créer une notification d'erreur
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg';
        notification.textContent = message;

        document.body.appendChild(notification);

        // Supprimer la notification après 3 secondes
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

export const uiManager = new UIManager();
