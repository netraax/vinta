import { store } from '../dataStore.js';

class SalesStatsModule {
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
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        <h3 class="text-lg font-semibold text-gray-200">Ventes</h3>
                    </div>
                </div>
                <div id="sales-period" class="text-sm text-gray-400"></div>
                <div class="text-3xl font-bold text-gray-100 mb-2" id="sales-count">-</div>
                <div class="flex-grow relative">
                    <canvas id="sales-chart" class="absolute inset-0"></canvas>
                </div>
            </div>
        `;
        return container;
    }

    updateStats() {
        const data = store.getState().analyzedData;
        if (!data || !data.ventes || !data.ventes.length) return;

        // Trier les ventes par date
        const ventes = data.ventes.sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstDate = new Date(ventes[0].date);
        const lastDate = new Date(ventes[ventes.length - 1].date);

        // Mettre à jour la période
        const formatDate = (date) => date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short'
        });
        document.getElementById('sales-period').textContent = 
            `${formatDate(firstDate)} - ${formatDate(lastDate)}`;

        // Mettre à jour le nombre total de ventes
        document.getElementById('sales-count').textContent = ventes.length;

        // Préparer les données pour le graphique
        const ventesParJour = this.aggregateVentesByDay(ventes);
        this.updateChart(ventesParJour);
    }

    aggregateVentesByDay(ventes) {
        const ventesMap = new Map();
        ventes.forEach(vente => {
            const date = new Date(vente.date).toISOString().split('T')[0];
            ventesMap.set(date, (ventesMap.get(date) || 0) + 1);
        });
        return Array.from(ventesMap.entries()).map(([date, count]) => ({
            date: new Date(date),
            count
        })).sort((a, b) => a.date - b.date);
    }

    updateChart(ventesParJour) {
        if (!this.chart) {
            const ctx = document.getElementById('sales-chart').getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ventesParJour.map(v => v.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })),
                    datasets: [{
                        data: ventesParJour.map(v => v.count),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
                            borderColor: '#3b82f6',
                            borderWidth: 1,
                            padding: 10,
                            displayColors: false,
                            callbacks: {
                                label: (tooltipItem) => {
                                    return `${tooltipItem.raw} vente${tooltipItem.raw > 1 ? 's' : ''}`;
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
                            backgroundColor: '#3b82f6'
                        }
                    }
                }
            });
        } else {
            this.chart.data.labels = ventesParJour.map(v => 
                v.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
            );
            this.chart.data.datasets[0].data = ventesParJour.map(v => v.count);
            this.chart.update();
        }
    }

    getElement() {
        return this.element;
    }
}

export default SalesStatsModule;
