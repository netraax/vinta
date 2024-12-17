class DataStore {
    constructor() {
        this.state = {
            rawText: '',
            analyzedData: null,
            ui: {
                currentView: 'input', // 'input' ou 'dashboard'
                activeModule: null,
                error: null
            }
        };
        this.subscribers = [];
    }

    // Obtenir l'état actuel
    getState() {
        return { ...this.state };
    }

    // Mettre à jour l'état
    setState(newState) {
        this.state = {
            ...this.state,
            ...newState
        };
        this.notify();
    }

    // Notifier les abonnés
    notify() {
        this.subscribers.forEach(callback => callback(this.getState()));
    }

    // S'abonner aux changements
    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    // Nouvelle méthode dispatch pour gérer les actions
    dispatch(action) {
        switch (action.type) {
            case 'SET_ANALYZED_DATA':
                this.setState({ analyzedData: action.payload });
                break;
            case 'SET_RAW_TEXT':
                this.setState({ rawText: action.payload });
                break;
            case 'SET_ERROR':
                this.setState({ ui: { ...this.state.ui, error: action.payload } });
                break;
            case 'SET_CURRENT_VIEW':
                this.setState({ ui: { ...this.state.ui, currentView: action.payload } });
                break;
            default:
                console.warn('Action non gérée:', action.type);
        }
    }

    // Définir les données analysées
    setAnalyzedData(data) {
        this.dispatch({ type: 'SET_ANALYZED_DATA', payload: data });
    }

    // Définir le texte brut
    setRawText(text) {
        this.dispatch({ type: 'SET_RAW_TEXT', payload: text });
    }

    // Mettre à jour l'UI
    setUIState(uiState) {
        this.setState({
            ui: {
                ...this.state.ui,
                ...uiState
            }
        });
    }

    // Réinitialiser le store
    reset() {
        this.setState({
            rawText: '',
            analyzedData: null,
            ui: {
                currentView: 'input',
                activeModule: null,
                error: null
            }
        });
    }
}

export const store = new DataStore();
