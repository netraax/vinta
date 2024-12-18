import { navigationState } from './navigation.js';
import { store } from './dataStore.js';
import { analyzer } from './analyzer.js';
import ProfileModule from './modules/ProfileModule.js';
import SidebarModule from './modules/SidebarModule.js';
import SalesStatsModule from './modules/SalesStatsModule.js';

class App {
    constructor() {
        this.init();
    }

    init() {
        // Initialiser les modules
        this.initializeModules();
        
        // Configurer la navigation
        this.setupNavigation();
        
        // Configurer les événements
        this.setupEventListeners();
    }

    initializeModules() {
        // Initialiser et monter les modules
        const sidebarModule = new SidebarModule();
        const profileModule = new ProfileModule();
        const salesStatsModule = new SalesStatsModule();

        document.getElementById('sidebar-container').appendChild(sidebarModule.getElement());
        document.getElementById('profile-container').appendChild(profileModule.getElement());
        document.getElementById('dashboard-stats').appendChild(salesStatsModule.getElement());
    }

    setupNavigation() {
        // Gestionnaire de vues
        navigationState.subscribe(this.handleNavigation);

        // Initialiser la navigation
        const hash = window.location.hash.slice(1) || 'dashboard';
        navigationState.navigate(hash, false);
    }

    setupEventListeners() {
        // Gérer l'analyse du texte
        const analyzeBtn = document.getElementById('analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', async () => {
                const inputText = document.getElementById('input-text').value;
                if (inputText.trim()) {
                    const analyzedData = await analyzer.analyze(inputText);
                    store.dispatch({ type: 'SET_ANALYZED_DATA', payload: analyzedData });
                    navigationState.navigate('dashboard');
                }
            });
        }
    }

    handleNavigation(page) {
        // Cacher toutes les vues
        document.querySelectorAll('[data-view]').forEach(view => {
            view.classList.add('hidden');
        });

        // Afficher la vue correspondante
        const targetView = document.querySelector(`[data-view="${page}"]`);
        if (targetView) {
            targetView.classList.remove('hidden');
        }

        // Logique spécifique pour chaque page
        switch (page) {
            case 'dashboard':
                document.getElementById('dashboard-view').classList.remove('hidden');
                break;
            case 'quick-analysis':
                document.getElementById('input-view').classList.remove('hidden');
                break;
            case 'my-analysis':
                navigationState.navigate('dashboard');
                break;
            case 'profile':
            case 'subscription':
                const tempView = document.createElement('div');
                tempView.className = 'container mx-auto p-4 text-center text-gray-400';
                tempView.innerHTML = `
                    <div class="max-w-2xl mx-auto bg-dark-200 rounded-lg shadow p-6">
                        <h2 class="text-2xl font-bold mb-4">Page ${page} en construction</h2>
                        <p>Cette fonctionnalité sera bientôt disponible !</p>
                    </div>
                `;
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.innerHTML = '';
                    mainContent.appendChild(tempView);
                }
                break;
        }
    }
}

// Démarrer l'application
new App();
