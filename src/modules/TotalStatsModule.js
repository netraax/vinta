import { store } from '../dataStore.js';

class TotalStatsModule {
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
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        <h3 class="text-lg font-semibold text-gray-200">Total</h3>
                    </div>
                    <div class="flex items-baseline space-x-2">
                        <div class="text-lg font-bold text-gray-100" id="total-count">-</div>
                        <div class="text-sm text-gray-400">activités</div>
                    </div>
                </div>
                <div id="total-period" class="text-sm text-gray-400 mb-1"></div>
                <div class="flex items-baseline mb-3">
                    <div class="text-3xl font-bold text-purple-400" id="total-revenue">-</div>
                    <div class="text-sm text-gray-400 ml-2">revenus</div>
                </div>
                <div class="flex-grow relative">
                    <canvas id="total-chart" class="absolute inset-0"></canvas>
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
        if (!data || !data.ventes || !data.ventes.length) return;

        // Trier les ventes par date
        const ventes = data.ventes.sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstDate = new Date(ventes[0].date);
        const lastDate = new Date(ventes[ventes.length - 1].date);

        // Calculer le total des ventes et commandes
        const totalRevenue = ventes.reduce((sum, vente) => sum + (vente.prix || 0), 0);

        // Mettre à jour la période
        const formatDate = (date) => date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short'
        });
        document.getElementById('total-period').textContent = 
            `${formatDate(firstDate)} - ${formatDate(lastDate)}`;

        // Mettre à jour le nombre total d'activités
        const totalActivities = ventes.length + (data.depenses ? data.depenses.length : 0);
        document.getElementById('total-count').textContent = totalActivities;

        // Mettre à jour le revenu
        document.getElementById('total-revenue').textContent = this.formatMoney(totalRevenue);

        // Préparer les données pour le graphique
        const activitesParJour = this.aggregateActivitiesByDay(ventes, data.depenses || []);
        this.updateChart(activitesParJour);
    }

    aggregateActivitiesByDay(ventes, depenses) {
        const activitesMap = new Map();
        
        // Ajouter les ventes
        ventes.forEach(vente => {
            const date = new Date(vente.date).toISOString().split('T')[0];
            activitesMap.set(date, (activitesMap.get(date) || 0) + 1);
        });

        // Ajouter les dépenses
        depenses.forEach(depense => {
            const date = new Date(depense.date).toISOString().split('T')[0];
            activitesMap.set(date, (activitesMap.get(date) || 0) + 1);
        });

        return Array.from(activitesMap.entries()).map(([date, count]) => ({
            date: new Date(date),
            count
        })).sort((a, b) => a.date - b.date);
    }

    updateChart(activitesParJour) {
        if (!this.chart) {
            const ctx = document.getElementById('total-chart').getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: activitesParJour.map(v => v.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })),
                    datasets: [{
                        data: activitesParJour.map(v => v.count),
                        borderColor: '#a855f7',
                        backgroundColor: 'rgba(168, 85, 247, 0.1)',
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
                            borderColor: '#a855f7',
                            borderWidth: 1,
                            padding: 10,
                            displayColors: false,
                            callbacks: {
                                label: (tooltipItem) => {
                                    return `${tooltipItem.raw} activité${tooltipItem.raw > 1 ? 's' : ''}`;
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
                            backgroundColor: '#a855f7'
                        }
                    }
                }
            });
        } else {
            this.chart.data.labels = activitesParJour.map(v => 
                v.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
            );
            this.chart.data.datasets[0].data = activitesParJour.map(v => v.count);
            this.chart.update();
        }
    }

    getElement() {
        return this.element;
    }
}

export default TotalStatsModule;
