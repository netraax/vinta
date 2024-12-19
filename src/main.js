import { store } from './dataStore.js';
import { navigationState } from './navigation.js';
import { analyzer } from './analyzer.js';
import ProfileModule from './modules/ProfileModule.js';
import SidebarModule from './modules/SidebarModule.js';
import SalesStatsModule from './modules/SalesStatsModule.js';
import ExpenseStatsModule from './modules/ExpenseStatsModule.js';
import TotalStatsModule from './modules/TotalStatsModule.js';
import AccountModule from './modules/AccountModule.js';

class App {
    constructor() {
        // Vérifier l'authentification avant d'initialiser
        navigationState.checkAuth();
        if (!navigationState.isAuthenticated) {
            return;
        }

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
        const expenseStatsModule = new ExpenseStatsModule();
        const totalStatsModule = new TotalStatsModule();
        const accountModule = new AccountModule();

        // Monter les modules
        document.getElementById('sidebar-container').appendChild(sidebarModule.getElement());
        document.getElementById('profile-container').appendChild(profileModule.getElement());
        
        // Créer un conteneur flex pour les stats
        const statsContainer = document.getElementById('dashboard-stats');
        statsContainer.className = 'flex gap-4 flex-wrap';
        statsContainer.appendChild(salesStatsModule.getElement());
        statsContainer.appendChild(expenseStatsModule.getElement());
        statsContainer.appendChild(totalStatsModule.getElement());
        
        document.getElementById('input-container').appendChild(accountModule.getElement());

        // Stocker les références des modules
        this.modules = {
            sidebar: sidebarModule,
            profile: profileModule,
            salesStats: salesStatsModule,
            expenseStats: expenseStatsModule,
            totalStats: totalStatsModule,
            account: accountModule
        };

        // Mettre à jour les informations utilisateur
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            this.modules.sidebar.updateUserInfo(userData);
            this.modules.account.updateUserInfo(userData);
        }
    }

    setupNavigation() {
        // Écouter les changements de navigation
        navigationState.subscribe((page) => {
            // Cacher toutes les vues
            document.querySelectorAll('[data-view]').forEach(view => {
                view.classList.add('hidden');
            });

            // Afficher la vue actuelle
            const currentView = document.querySelector(`[data-view="${page}"]`);
            if (currentView) {
                currentView.classList.remove('hidden');
            }
        });
    }

    setupEventListeners() {
        // Écouter les changements dans la zone de texte
        const inputText = document.getElementById('input-text-dashboard');
        if (inputText) {
            inputText.addEventListener('input', (e) => {
                // Sauvegarder uniquement le texte brut sans déclencher d'autres actions
                store.dispatch({ type: 'SET_RAW_TEXT', payload: e.target.value });
                
                // S'assurer que le bloc de texte est visible
                const inputBlock = document.querySelector('.bg-dark-200.rounded-lg.p-6.mb-8');
                if (inputBlock) {
                    inputBlock.classList.remove('hidden');
                }
                
                // Cacher les stats jusqu'à l'analyse
                const statsBlock = document.getElementById('dashboard-stats');
                if (statsBlock) {
                    statsBlock.classList.add('hidden');
                }
            });
        }

        // Écouter le clic sur le bouton d'analyse
        const analyzeBtn = document.getElementById('analyze-btn-dashboard');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                const text = inputText.value.trim();
                if (!text) {
                    this.showError('Veuillez entrer du texte à analyser');
                    return;
                }

                // Désactiver le bouton pendant l'analyse
                analyzeBtn.disabled = true;
                analyzeBtn.textContent = 'Analyse en cours...';

                try {
                    // Analyser le texte
                    const analyzedData = analyzer.analyze(text);

                    // Mettre à jour le store
                    store.dispatch({ type: 'SET_ANALYZED_DATA', payload: analyzedData });

                    // Cacher le bloc de texte et afficher le dashboard
                    const inputBlock = document.querySelector('.bg-dark-200.rounded-lg.p-6.mb-8');
                    if (inputBlock) {
                        inputBlock.classList.add('hidden');
                    }

                    // Afficher les stats
                    const statsBlock = document.getElementById('dashboard-stats');
                    if (statsBlock) {
                        statsBlock.classList.remove('hidden');
                    }

                    // Afficher le module de profil
                    document.getElementById('profile-container').classList.remove('hidden');

                } catch (error) {
                    console.error('Erreur lors de l\'analyse:', error);
                    this.showError('Erreur lors de l\'analyse');
                } finally {
                    // Réactiver le bouton
                    analyzeBtn.disabled = false;
                    analyzeBtn.textContent = 'Analyser';
                }
            });
        }

        // S'abonner aux changements d'état
        store.subscribe(() => {
            const state = store.getState();
            // Mettre à jour les modules avec le nouvel état
            Object.values(this.modules).forEach(module => {
                if (module && module.update) {
                    module.update(state);
                }
            });
        });

        // Gérer la déconnexion
        document.addEventListener('click', (e) => {
            if (e.target.matches('#logout-button')) {
                e.preventDefault();
                navigationState.logout();
            }
        });
    }

    showError(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Initialiser l'application
new App();
