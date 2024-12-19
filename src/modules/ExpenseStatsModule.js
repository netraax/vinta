import { store } from '../dataStore.js';

class ExpenseStatsModule {
    constructor() {
        this.element = this.createModule();
        this.chart = null;
        store.subscribe(() => this.updateStats());
    }

    createModule() {
        const container = document.createElement('div');
        container.className = 'bg-dark-800 rounded-lg p-4 shadow-lg w-64 h-48 flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl';
        container.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-2">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 class="text-lg font-semibold text-gray-200">Dépenses</h3>
                    </div>
                    <div class="flex flex-col items-end space-y-1">
                        <div class="flex items-baseline space-x-2">
                            <div class="text-lg font-bold text-gray-100" id="expenses-boost-count">-</div>
                            <div class="text-sm text-gray-400">boosts</div>
                        </div>
                        <div class="flex items-baseline space-x-2">
                            <div class="text-lg font-bold text-gray-100" id="expenses-vitrine-count">-</div>
                            <div class="text-sm text-gray-400">vitrines</div>
                        </div>
                    </div>
                </div>
                <div id="expenses-period" class="text-sm text-gray-400 mb-1"></div>
                <div class="flex items-baseline mb-3">
                    <div class="text-3xl font-bold text-rose-400" id="expenses-total">-</div>
                    <div class="text-sm text-gray-400 ml-2">dépensés</div>
                </div>
                <div class="flex-grow relative">
                    <canvas id="expenses-chart" class="absolute inset-0"></canvas>
                </div>
            </div>
        `;
        return container;
    }

    formatMoney(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    updateStats() {
        const data = store.getState().analyzedData;
        if (!data || !data.depenses || !data.depenses.length) return;

        // Trier les dépenses par date
        const depenses = data.depenses.sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstDate = new Date(depenses[0].date);
        const lastDate = new Date(depenses[depenses.length - 1].date);

        // Calculer le total des dépenses
        const totalExpenses = depenses.reduce((sum, depense) => sum + (depense.montant || 0), 0);

        // Mettre à jour la période
        const formatDate = (date) => date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short'
        });
        document.getElementById('expenses-period').textContent = 
            `${formatDate(firstDate)} - ${formatDate(lastDate)}`;

        // Compter les boosts et vitrines
        const boostCount = depenses.filter(d => d.type === 'boost').length;
        const vitrineCount = depenses.filter(d => d.type === 'vitrine').length;
        
        // Mettre à jour les compteurs
        document.getElementById('expenses-boost-count').textContent = boostCount || '-';
        document.getElementById('expenses-vitrine-count').textContent = vitrineCount || '-';

        // Mettre à jour le total
        document.getElementById('expenses-total').textContent = this.formatMoney(totalExpenses);

        // Préparer les données pour le graphique
        const depensesParJour = this.aggregateExpensesByDay(depenses);
        this.updateChart(depensesParJour);
    }

    aggregateExpensesByDay(depenses) {
        const depensesMap = new Map();
        depenses.forEach(depense => {
            const date = new Date(depense.date).toISOString().split('T')[0];
            depensesMap.set(date, (depensesMap.get(date) || 0) + 1);
        });
        return Array.from(depensesMap.entries()).map(([date, count]) => ({
            date: new Date(date),
            count: count
        })).sort((a, b) => a.date - b.date);
    }

    updateChart(depensesParJour) {
        if (!this.chart) {
            const ctx = document.getElementById('expenses-chart').getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: depensesParJour.map(v => v.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })),
                    datasets: [{
                        data: depensesParJour.map(v => v.count),
                        borderColor: '#f43f5e',
                        backgroundColor: 'rgba(244, 63, 94, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#f43f5e',
                            borderWidth: 1,
                            padding: 10,
                            displayColors: false,
                            callbacks: {
                                label: (tooltipItem) => {
                                    return `${tooltipItem.raw} dépense${tooltipItem.raw > 1 ? 's' : ''}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: { 
                            display: false 
                        },
                        y: { 
                            display: false,
                            beginAtZero: true
                        }
                    },
                    elements: {
                        point: {
                            radius: 0,
                            hitRadius: 10,
                            hoverRadius: 4,
                            hoverBorderWidth: 2,
                            backgroundColor: '#f43f5e'
                        }
                    }
                }
            });
        } else {
            this.chart.data.labels = depensesParJour.map(v => 
                v.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
            );
            this.chart.data.datasets[0].data = depensesParJour.map(v => v.count);
            this.chart.update();
        }
    }

    getElement() {
        return this.element;
    }
}

export default ExpenseStatsModule;
