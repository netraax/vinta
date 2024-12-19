import { EventEmitter } from './eventEmitter.js';

class Store extends EventEmitter {
    constructor() {
        super();
        this.state = {
            user: null,
            rawText: '',
            analyzedData: null,
            ui: {
                currentView: 'dashboard',
                isAuthenticated: false
            }
        };
        this.loadFromLocalStorage();
        this.checkAuthState();
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.saveToLocalStorage();
        this.notify();
    }

    getState() {
        return this.state;
    }

    // Gestion de l'authentification
    checkAuthState() {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        
        this.setState({
            user,
            ui: {
                ...this.state.ui,
                isAuthenticated: !!token
            }
        });
    }

    // Gestion du stockage local
    saveToLocalStorage() {
        try {
            const stateToSave = {
                ...this.state,
                ui: {
                    ...this.state.ui,
                    isAuthenticated: false // Ne pas sauvegarder l'état d'authentification
                }
            };
            localStorage.setItem('dashboard_data', JSON.stringify(stateToSave));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde locale:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('dashboard_data');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                this.state = {
                    ...parsedData,
                    user: null, // Réinitialiser l'utilisateur
                    ui: {
                        ...parsedData.ui,
                        isAuthenticated: false // Réinitialiser l'authentification
                    }
                };
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données locales:', error);
        }
    }

    // Actions
    dispatch(action) {
        switch (action.type) {
            case 'SET_USER':
                this.setState({ user: action.payload });
                break;
            case 'SET_RAW_TEXT':
                this.setState({ rawText: action.payload });
                break;
            case 'SET_ANALYZED_DATA':
                this.setState({ analyzedData: action.payload });
                break;
            case 'SET_CURRENT_VIEW':
                this.setState({
                    ui: {
                        ...this.state.ui,
                        currentView: action.payload
                    }
                });
                break;
            case 'LOGOUT':
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                this.setState({
                    user: null,
                    ui: {
                        ...this.state.ui,
                        isAuthenticated: false
                    }
                });
                break;
            default:
                console.warn('Action non reconnue:', action.type);
        }
    }
}

export const store = new Store();
