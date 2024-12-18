import { store } from './dataStore.js';

class UIManager {
    constructor() {
        this._initializeElements();
        this._initializeEventListeners();
        this.initialize();
    }

    _initializeElements() {
        this.elements = {
            inputView: document.getElementById('input-view'),
            dashboardView: document.getElementById('dashboard-view'),
            dashboardStats: document.getElementById('dashboard-stats'),
            inputText: document.getElementById('input-text'),
            analyzeBtn: document.getElementById('analyze-btn')
        };

        if (!Object.values(this.elements).every(element => element)) {
            throw new Error('Certains éléments UI nécessaires n\'ont pas été trouvés');
        }
    }

    _initializeEventListeners() {
        // Écouter les changements dans la zone de texte
        this.elements.inputText.addEventListener('input', (e) => {
            store.dispatch({ type: 'SET_RAW_TEXT', payload: e.target.value });
        });

        // Écouter le clic sur le bouton d'analyse
        this.elements.analyzeBtn.addEventListener('click', () => {
            if (this.elements.inputText.value.trim()) {
                const state = store.getState();
                if (state.ui.currentView !== 'dashboard') {
                    this.showDashboard();
                }
            } else {
                this._showError('Veuillez entrer du texte à analyser');
            }
        });

        // S'abonner aux changements d'état
        store.subscribe(() => {
            this._updateUI(store.getState());
        });
    }

    initialize() {
        this.initializeModules();
        this.setupModeIndicator();
    }

    setupModeIndicator() {
        // Ajouter l'indicateur de mode (local/online) dans le header
        const header = document.querySelector('.header-right');
        if (header) {
            const modeIndicator = document.createElement('div');
            modeIndicator.className = 'text-sm text-gray-400 ml-2';
            modeIndicator.textContent = 'Mode local';
            header.appendChild(modeIndicator);
        }
    }

    initializeModules() {
        // Cette méthode est vide pour le moment, mais vous pouvez l'utiliser pour initialiser vos modules
    }

    _updateUI(state) {
        const currentView = state.ui.currentView;
        
        // Mettre à jour la visibilité des vues
        if (currentView === 'input') {
            this._showInputView();
        } else if (currentView === 'dashboard') {
            this._showDashboardView();
        }
    }

    _showInputView() {
        this.elements.inputView.classList.remove('hidden');
        this.elements.dashboardView.classList.add('hidden');
    }

    _showDashboardView() {
        this.elements.inputView.classList.add('hidden');
        this.elements.dashboardView.classList.remove('hidden');
    }

    showInput() {
        store.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'input' });
    }

    showDashboard() {
        store.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'dashboard' });
    }

    // Méthode pour ajouter un module au dashboard
    addModule(moduleElement) {
        if (!moduleElement) {
            console.error('Tentative d\'ajout d\'un module null');
            return;
        }
        
        this.elements.dashboardStats.appendChild(moduleElement);
    }

    // Méthode pour nettoyer le dashboard
    clearDashboard() {
        while (this.elements.dashboardStats.firstChild) {
            this.elements.dashboardStats.removeChild(this.elements.dashboardStats.firstChild);
        }
    }

    _showError(message) {
        console.error(message);
        // Vous pouvez ajouter ici une notification visuelle pour l'utilisateur
    }
}

export const uiManager = new UIManager();
