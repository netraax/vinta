import { EventEmitter } from './eventEmitter.js';

class Store extends EventEmitter {
    constructor() {
        super();
        this.state = {
            rawText: '',
            analyzedData: null,
            ui: {
                currentView: 'dashboard'
            }
        };
        this.isOnline = false; // Mode hors ligne par défaut
        this.loadFromLocalStorage();
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.saveToLocalStorage();
        this.notify();
    }

    getState() {
        return this.state;
    }

    // Gestion du stockage local
    saveToLocalStorage() {
        try {
            localStorage.setItem('dashboard_data', JSON.stringify(this.state));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde locale:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('dashboard_data');
            if (savedData) {
                this.state = JSON.parse(savedData);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données locales:', error);
        }
    }

    // Méthodes existantes
    setRawText(text) {
        this.setState({ rawText: text });
    }

    setAnalyzedData(data) {
        this.setState({ analyzedData: data });
    }

    setCurrentView(view) {
        this.setState({
            ui: {
                ...this.state.ui,
                currentView: view
            }
        });
    }

    // Nouvelles méthodes pour le backend (préparées mais non utilisées pour l'instant)
    async saveData(data) {
        // Sauvegarde toujours en local d'abord
        this.setState(data);

        // Si online et connecté, tente de sauvegarder sur le serveur
        if (this.isOnline && this.isLoggedIn()) {
            try {
                await fetch('/api/dashboard/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.getToken()}`
                    },
                    body: JSON.stringify(data)
                });
            } catch (error) {
                console.log('Mode hors ligne : sauvegarde locale uniquement');
            }
        }
    }

    isLoggedIn() {
        return !!localStorage.getItem('auth_token');
    }

    getToken() {
        return localStorage.getItem('auth_token');
    }
}

export const store = new Store();
