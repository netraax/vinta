import { store } from './dataStore.js';

class UIManager {
    constructor() {
        this._initializeElements();
        this._initializeEventListeners();
    }

    _initializeElements() {
        this.elements = {
            inputView: document.getElementById('input-view'),
            dashboardView: document.getElementById('dashboard-view').querySelector('.grid'),
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
            store.setRawText(e.target.value);
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
        store.subscribe((state) => {
            this._updateUI(state);
        });
    }

    _updateUI(state) {
        const currentView = state.ui.currentView;
        if (currentView === 'input' && !this.elements.inputView.classList.contains('hidden')) {
            return;
        }
        if (currentView === 'dashboard' && !this.elements.dashboardView.parentElement.classList.contains('hidden')) {
            return;
        }

        if (currentView === 'input') {
            this._showInputView();
        } else if (currentView === 'dashboard') {
            this._showDashboardView();
        }
    }

    _showInputView() {
        this.elements.inputView.classList.remove('hidden');
        this.elements.dashboardView.parentElement.classList.add('hidden');
    }

    _showDashboardView() {
        this.elements.inputView.classList.add('hidden');
        this.elements.dashboardView.parentElement.classList.remove('hidden');
    }

    showInput() {
        if (store.getState().ui.currentView !== 'input') {
            store.setUIState({ currentView: 'input' });
        }
    }

    showDashboard() {
        if (store.getState().ui.currentView !== 'dashboard') {
            store.setUIState({ currentView: 'dashboard' });
        }
    }

    // Méthode pour ajouter un module au dashboard
    addModule(moduleElement) {
        if (!moduleElement) {
            console.error('Tentative d\'ajout d\'un module null');
            return;
        }
        
        // Créer un conteneur pour le module
        const moduleContainer = document.createElement('div');
        moduleContainer.className = 'module-container';
        moduleContainer.appendChild(moduleElement);
        
        this.elements.dashboardView.appendChild(moduleContainer);
    }

    // Méthode pour nettoyer le dashboard
    clearDashboard() {
        while (this.elements.dashboardView.firstChild) {
            this.elements.dashboardView.removeChild(this.elements.dashboardView.firstChild);
        }
    }

    _showError(message) {
        // Créer un élément d'erreur
        const errorElement = document.createElement('div');
        errorElement.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4';
        errorElement.role = 'alert';
        errorElement.innerHTML = `
            <span class="block sm:inline">${message}</span>
            <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Fermer</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
            </span>
        `;

        // Ajouter l'erreur après la zone de texte
        this.elements.inputText.parentNode.insertBefore(errorElement, this.elements.analyzeBtn);

        // Supprimer l'erreur après 5 secondes
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, 5000);

        // Ajouter un gestionnaire de clic pour fermer l'erreur
        errorElement.querySelector('svg').addEventListener('click', () => {
            errorElement.parentNode.removeChild(errorElement);
        });
    }
}

export const uiManager = new UIManager();
