import { navigationState } from '../navigation.js';

class SidebarModule {
    constructor() {
        this.element = this._createSidebarElement();
        this._setupEventListeners();
    }

    _createSidebarElement() {
        const sidebar = document.createElement('div');
        sidebar.className = 'w-64 h-screen bg-dark-300 text-gray-300 flex flex-col fixed left-0 top-0';
        
        sidebar.innerHTML = `
            <div class="p-4 border-b border-gray-700">
                <div class="flex items-center space-x-3">
                    <svg class="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 7h-7m7 10h-7m7-5h-7M7 7v10M7 12l-3-3m3 3l-3 3"/>
                    </svg>
                    <span class="text-xl font-bold text-white">VintedPro</span>
                </div>
                <div class="mt-4 relative">
                    <input type="text" 
                           id="search-input"
                           placeholder="Rechercher..." 
                           class="w-full bg-dark-200 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <div class="absolute right-3 top-2.5 text-gray-400 text-xs">⌘F</div>
                </div>
            </div>

            <!-- Menu Principal -->
            <div class="flex-1 overflow-y-auto">
                <div class="px-3 py-4">
                    <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Général
                    </div>
                    <nav class="space-y-1">
                        <a href="#" data-page="dashboard" class="nav-link flex items-center px-3 py-2 text-sm rounded-lg hover:bg-dark-200 transition-colors">
                            <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            Tableau de bord
                        </a>
                        <a href="#" data-page="quick-analysis" class="nav-link flex items-center px-3 py-2 text-sm rounded-lg hover:bg-dark-200 transition-colors">
                            <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                            Analyse rapide
                        </a>
                        <a href="#" data-page="my-analysis" class="nav-link flex items-center px-3 py-2 text-sm rounded-lg hover:bg-dark-200 transition-colors">
                            <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                            </svg>
                            Mes analyses
                        </a>
                    </nav>

                    <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-4">
                        Compte
                    </div>
                    <nav class="space-y-1">
                        <a href="#" data-page="profile" class="nav-link flex items-center px-3 py-2 text-sm rounded-lg hover:bg-dark-200 transition-colors">
                            <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            Profil
                        </a>
                        <a href="#" data-page="subscription" class="nav-link flex items-center px-3 py-2 text-sm rounded-lg hover:bg-dark-200 transition-colors">
                            <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                            </svg>
                            Abonnement
                            <span class="ml-auto bg-purple-500 text-xs px-2 py-0.5 rounded-full">BETA</span>
                        </a>
                    </nav>
                </div>
            </div>
        `;

        return sidebar;
    }

    _setupEventListeners() {
        // Gérer les clics sur les liens de navigation
        this.element.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                navigationState.navigate(page);
            });
        });

        // Gérer la recherche
        const searchInput = this.element.querySelector('#search-input');
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    console.log('Recherche:', searchInput.value);
                    // Implémenter la logique de recherche ici
                }
            });

            // Raccourci clavier pour la recherche (Cmd/Ctrl + F)
            document.addEventListener('keydown', (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
                    e.preventDefault();
                    searchInput.focus();
                }
            });
        }
    }

    getElement() {
        return this.element;
    }
}

export default SidebarModule;
