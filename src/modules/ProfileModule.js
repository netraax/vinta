import { store } from '../dataStore.js';

class ProfileModule {
    constructor() {
        this.element = this._createModuleElement();
        this._subscribeToStore();
    }

    _createModuleElement() {
        const element = document.createElement('div');
        element.className = 'w-full bg-dark-200 rounded-2xl shadow-xl border border-gray-800/50';
        element.id = 'profile-module';
        return element;
    }

    _subscribeToStore() {
        store.subscribe((state) => {
            if (state.analyzedData) {
                this._updateUI(state.analyzedData);
            }
        });
    }

    _updateUI(data) {
        const { boutique } = data;
        const location = boutique.localisation && boutique.localisation.ville ? 
            `${boutique.localisation.ville}, ${boutique.localisation.pays}` : 
            'Non renseigné';
            
        const stars = this._generateStars(boutique.stats.note);
            
        this.element.innerHTML = `
            <div class="p-4">
                <div class="flex items-center justify-between">
                    <!-- Info gauche -->
                    <div class="flex items-center space-x-3">
                        <div class="flex items-center bg-dark-100/50 rounded-full px-3 py-1 border border-gray-700/50">
                            <span class="text-blue-400">@${boutique.username || 'Non renseigné'}</span>
                        </div>
                        <div class="flex items-center bg-dark-100/50 rounded-full px-3 py-1 border border-gray-700/50">
                            <svg class="w-4 h-4 text-purple-400 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span class="text-purple-400">${boutique.stats.abonnes} abonnés</span>
                        </div>
                    </div>

                    <!-- Message central -->
                    <div class="flex flex-col items-center mx-4">
                        <span class="text-gray-400 text-sm">Bonjour,</span>
                        <span class="text-xl font-bold text-white">${boutique.nom || 'Non renseigné'}</span>
                    </div>

                    <!-- Info droite -->
                    <div class="flex items-center space-x-3">
                        <div class="flex items-center bg-dark-100/50 rounded-full px-3 py-1 border border-gray-700/50">
                            <svg class="w-4 h-4 text-emerald-400 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span class="text-emerald-400">${location}</span>
                        </div>
                        <div class="flex items-center bg-dark-100/50 rounded-full px-3 py-1 border border-gray-700/50">
                            <span class="text-xl font-bold text-white mr-2">${boutique.stats.note.toFixed(1)}</span>
                            <span class="text-yellow-400">${stars}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    _generateStars(note) {
        const fullStars = Math.floor(note);
        const hasHalfStar = note % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return `${'★'.repeat(fullStars)}${hasHalfStar ? '½' : ''}${'☆'.repeat(emptyStars)}`;
    }

    getElement() {
        return this.element;
    }
}

export default ProfileModule;
