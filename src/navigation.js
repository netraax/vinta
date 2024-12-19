// Gestionnaire d'état pour la navigation
class NavigationState {
    constructor() {
        this.currentPage = this._getInitialPage();
        this.subscribers = [];
        this.isAuthenticated = false;
        
        // Vérifier l'authentification au démarrage
        this.checkAuth();
        
        // Gérer la navigation avec l'historique du navigateur
        window.addEventListener('popstate', (event) => {
            if (event.state?.page) {
                this.navigate(event.state.page, false);
            }
        });
    }

    _getInitialPage() {
        // Récupérer la page depuis l'URL ou utiliser la page par défaut
        const hash = window.location.hash.slice(1);
        return hash || 'dashboard';
    }

    checkAuth() {
        const token = localStorage.getItem('token');
        this.isAuthenticated = !!token;

        // Rediriger si nécessaire
        const currentPath = window.location.pathname;
        if (this.isAuthenticated) {
            // Si connecté et sur login, rediriger vers dashboard
            if (currentPath.includes('login.html')) {
                window.location.replace('/index.html');
            }
        } else {
            // Si non connecté et pas sur login, rediriger vers login
            if (!currentPath.includes('login.html')) {
                window.location.replace('/login.html');
            }
        }
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
        // Vérifier l'authentification avant la navigation
        if (!this.isAuthenticated && page !== 'login') {
            window.location.replace('/login.html');
            return;
        }

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
        // Ne mettre à jour les liens que si on est sur le dashboard
        if (!document.querySelector('.nav-link')) {
            return;
        }

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

    // Méthode pour gérer la déconnexion
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.isAuthenticated = false;
        window.location.replace('/login.html');
    }
}

export const navigationState = new NavigationState();
