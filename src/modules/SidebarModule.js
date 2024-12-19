import { navigationState } from '../navigation.js';
import { store } from '../dataStore.js';

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
            </div>

            <!-- Section Compte -->
            <div class="p-4 border-b border-gray-700">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </div>
                    <div>
                        <div id="user-name" class="font-medium text-white">Non connecté</div>
                        <div id="user-email" class="text-sm text-gray-400">Connectez-vous</div>
                    </div>
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
                        <a href="#" data-page="account" class="nav-link flex items-center px-3 py-2 text-sm rounded-lg hover:bg-dark-200 transition-colors">
                            <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            Mon compte
                        </a>
                    </nav>
                </div>
            </div>
        `;

        return sidebar;
    }

    _setupEventListeners() {
        this.element.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                if (page) {
                    this._updateActiveLink(page);
                    navigationState.navigate(page);
                }
            });
        });
    }

    updateUserInfo(user) {
        if (user) {
            this.element.querySelector('#user-name').textContent = user.username;
            this.element.querySelector('#user-email').textContent = user.email;
        } else {
            this.element.querySelector('#user-name').textContent = 'Non connecté';
            this.element.querySelector('#user-email').textContent = 'Connectez-vous';
        }
    }

    _updateActiveLink(activePage) {
        this.element.querySelectorAll('.nav-link').forEach(link => {
            const isActive = link.dataset.page === activePage;
            link.classList.toggle('bg-dark-200', isActive);
            link.classList.toggle('text-blue-500', isActive);
        });
    }

    getElement() {
        return this.element;
    }
}

export default SidebarModule;
