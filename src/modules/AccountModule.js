class AccountModule {
    constructor() {
        this.element = this._createAccountElement();
    }

    _createAccountElement() {
        const accountView = document.createElement('div');
        accountView.id = 'account-view';
        accountView.dataset.view = 'account';
        accountView.className = 'hidden';

        accountView.innerHTML = `
            <div class="container mx-auto p-4">
                <h2 class="text-2xl font-bold mb-6 text-gray-200">Mon Compte</h2>
                <div class="bg-dark-200 rounded-lg p-6 max-w-2xl">
                    <div class="space-y-6">
                        <!-- Informations de base -->
                        <div>
                            <h3 class="text-lg font-semibold mb-4 text-gray-300">Informations personnelles</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-400">Nom d'utilisateur</label>
                                    <div id="account-username" class="mt-1 text-white"></div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-400">Email</label>
                                    <div id="account-email" class="mt-1 text-white"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Abonnement -->
                        <div>
                            <h3 class="text-lg font-semibold mb-4 text-gray-300">Abonnement</h3>
                            <div class="bg-dark-300 rounded-lg p-4">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div id="account-subscription" class="font-medium text-white">Standard</div>
                                        <div class="text-sm text-gray-400">Votre abonnement actuel</div>
                                    </div>
                                    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                        Gérer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return accountView;
    }

    updateUserInfo(user) {
        if (user) {
            this.element.querySelector('#account-username').textContent = user.username;
            this.element.querySelector('#account-email').textContent = user.email;
            this.element.querySelector('#account-subscription').textContent = user.subscription || 'Standard';
        }
    }

    getElement() {
        return this.element;
    }
}

export default AccountModule;
