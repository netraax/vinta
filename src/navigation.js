// Gestionnaire d'état pour la navigation
class NavigationState {
    constructor() {
        this.currentPage = 'dashboard';
        this.subscribers = [];
        
        // Gérer la navigation avec l'historique du navigateur
        window.addEventListener('popstate', (event) => {
            if (event.state?.page) {
                this.navigate(event.state.page, false);
            }
        });
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        // Appeler immédiatement avec l'état actuel
        callback(this.currentPage);
    }

    notify() {
        this.subscribers.forEach(callback => callback(this.currentPage));
    }

    navigate(page, addToHistory = true) {
        this.currentPage = page;
        
        if (addToHistory) {
            // Ajouter à l'historique du navigateur
            window.history.pushState({ page }, '', `#${page}`);
        }
        
        // Mettre à jour l'UI
        this.notify();
        
        // Mettre à jour la classe active dans la sidebar
        this.updateActiveLink();
    }

    updateActiveLink() {
        // Retirer la classe active de tous les liens
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('bg-dark-200', 'text-blue-500');
        });

        // Ajouter la classe active au lien actuel
        const activeLink = document.querySelector(`[data-page="${this.currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('bg-dark-200', 'text-blue-500');
        }
    }

    getCurrentPage() {
        return this.currentPage;
    }
}

export const navigationState = new NavigationState();
