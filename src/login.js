class LoginManager {
    constructor() {
        this.setupTabs();
        this.setupForms();
    }

    setupTabs() {
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        loginTab.addEventListener('click', () => {
            loginTab.classList.add('bg-dark-300', 'text-white');
            registerTab.classList.remove('bg-dark-300', 'text-white');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        });

        registerTab.addEventListener('click', () => {
            registerTab.classList.add('bg-dark-300', 'text-white');
            loginTab.classList.remove('bg-dark-300', 'text-white');
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        });
    }

    setupForms() {
        // Formulaire de connexion
        document.querySelector('#login-form form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Désactiver le bouton pendant la connexion
            const submitButton = document.getElementById('login-submit');
            submitButton.disabled = true;
            submitButton.textContent = 'Connexion...';

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Stocker le token
                    localStorage.setItem('token', data.token);
                    // Stocker les infos utilisateur
                    localStorage.setItem('user', JSON.stringify(data.user));
                    // Rediriger vers le dashboard avec le chemin complet
                    window.location.href = '/index.html';
                } else {
                    alert(data.error || 'Erreur de connexion');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur de connexion au serveur');
            } finally {
                // Réactiver le bouton
                submitButton.disabled = false;
                submitButton.textContent = 'Se connecter';
            }
        });

        // Formulaire d'inscription
        document.querySelector('#register-form form').addEventListener('submit', async (e) => {
            e.preventDefault();

            // Désactiver le bouton pendant l'inscription
            const submitButton = document.getElementById('register-submit');
            submitButton.disabled = true;
            submitButton.textContent = 'Création...';

            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            try {
                const response = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
                    // Retourner au formulaire de connexion
                    document.getElementById('login-tab').click();
                } else {
                    alert(data.error || 'Erreur lors de l\'inscription');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur de connexion au serveur');
            } finally {
                // Réactiver le bouton
                submitButton.disabled = false;
                submitButton.textContent = 'Créer un compte';
            }
        });
    }
}

// Initialiser le gestionnaire de connexion
new LoginManager();
