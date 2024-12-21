import { store } from '../dataStore.js';

class SalesChartModule {
    constructor() {
        this.element = this.createModule();
        this.chart = null;
        this.startDate = null;
        this.endDate = null;
        store.subscribe(() => this.updateStats());
    }

    createModule() {
        const container = document.createElement('div');
        // Utiliser la même largeur que les 3 modules du dessus (w-64 * 3 + gap-4 * 2)
        container.className = 'bg-dark-800 rounded-lg p-4 shadow-lg h-96 flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl mt-4';
        container.style.width = 'calc(48rem + 2rem)'; // 3 * 16rem (w-64) + 2 * 1rem (gap-4)
        container.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        <h3 class="text-lg font-semibold text-gray-200">Analyse des Ventes</h3>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-2">
                            <input 
                                type="date" 
                                id="sales-start-date" 
                                class="bg-dark-900 text-gray-200 rounded px-2 py-1 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                style="color-scheme: dark;"
                            >
                            <span class="text-gray-400">à</span>
                            <input 
                                type="date" 
                                id="sales-end-date" 
                                class="bg-dark-900 text-gray-200 rounded px-2 py-1 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                style="color-scheme: dark;"
                            >
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-between mb-2">
                    <div id="sales-period" class="text-sm text-gray-400"></div>
                    <div class="flex items-baseline space-x-2">
                        <div class="text-lg font-bold text-gray-100" id="period-sales-count">-</div>
                        <div class="text-sm text-gray-400">ventes</div>
                    </div>
                </div>
                <div class="flex items-baseline mb-3">
                    <div class="text-3xl font-bold text-emerald-400" id="period-sales-revenue">-</div>
                    <div class="text-sm text-gray-400 ml-2">revenus sur la période</div>
                </div>
                <div class="flex-grow relative">
                    <canvas id="sales-period-chart" class="absolute inset-0"></canvas>
                </div>
            </div>
        `;

        // Ajouter les écouteurs d'événements pour les dates
        setTimeout(() => {
            const startDateInput = document.getElementById('sales-start-date');
            const endDateInput = document.getElementById('sales-end-date');

            startDateInput.addEventListener('change', () => {
                this.startDate = new Date(startDateInput.value);
                this.updateStats();
            });

            endDateInput.addEventListener('change', () => {
                this.endDate = new Date(endDateInput.value);
                this.updateStats();
            });

            // Initialiser avec les dates des données
            const data = store.getState().analyzedData;
            if (data && data.ventes && data.ventes.length > 0) {
                // Trier les ventes par date
                const sortedVentes = [...data.ventes].sort((a, b) => new Date(b.date) - new Date(a.date));
                const latestDate = new Date(sortedVentes[0].date);
                const oneMonthAgo = new Date(latestDate);
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

                startDateInput.value = this.formatDateForInput(oneMonthAgo);
                endDateInput.value = this.formatDateForInput(latestDate);
                
                this.startDate = oneMonthAgo;
                this.endDate = latestDate;
            } else {
                // Fallback sur le dernier mois si pas de données
                const today = new Date();
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);

                startDateInput.value = this.formatDateForInput(lastMonth);
                endDateInput.value = this.formatDateForInput(today);
                
                this.startDate = lastMonth;
                this.endDate = today;
            }
            
            // Déclencher la mise à jour initiale
            this.updateStats();
        }, 0);

        return container;
    }

    formatDateForInput(date) {
        return date.toISOString().split('T')[0];
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

        // Filtrer les ventes et dépenses par période
        const ventes = data.ventes
            .filter(vente => {
                const date = new Date(vente.date);
                return (!this.startDate || date >= this.startDate) && 
                       (!this.endDate || date <= this.endDate);
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const depenses = data.depenses
            ? data.depenses.filter(depense => {
                const date = new Date(depense.date);
                return (!this.startDate || date >= this.startDate) && 
                       (!this.endDate || date <= this.endDate);
            })
            : [];

        if (ventes.length === 0) {
            document.getElementById('period-sales-count').textContent = '0';
            document.getElementById('period-sales-revenue').textContent = this.formatMoney(0);
            document.getElementById('sales-period').textContent = 'Aucune vente sur la période';
            if (this.chart) {
                this.chart.data.labels = [];
                this.chart.data.datasets[0].data = [];
                this.chart.data.datasets[1].data = [];
                this.chart.update();
            }
            return;
        }

        const firstDate = new Date(ventes[0].date);
        const lastDate = new Date(ventes[ventes.length - 1].date);

        // Calculer le CA total
        const totalRevenue = ventes.reduce((sum, vente) => sum + (vente.prix || 0), 0);

        // Mettre à jour la période
        const formatDate = (date) => date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short',
            year: 'numeric'
        });
        document.getElementById('sales-period').textContent = 
            `${formatDate(firstDate)} - ${formatDate(lastDate)}`;

        // Mettre à jour le nombre total de ventes
        document.getElementById('period-sales-count').textContent = ventes.length;

        // Mettre à jour le CA
        document.getElementById('period-sales-revenue').textContent = this.formatMoney(totalRevenue);

        // Préparer les données pour le graphique
        const ventesParJour = this.aggregateVentesByDay(ventes);
        const depensesParJour = this.aggregateDepensesByDay(depenses);
        this.updateChart(ventesParJour, depensesParJour);
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

    aggregateDepensesByDay(depenses) {
        const depensesMap = new Map();
        depenses.forEach(depense => {
            const date = new Date(depense.date).toISOString().split('T')[0];
            depensesMap.set(date, (depensesMap.get(date) || 0) + 1);
        });
        return Array.from(depensesMap.entries()).map(([date, count]) => ({
            date: new Date(date),
            count
        })).sort((a, b) => a.date - b.date);
    }

    updateChart(ventesParJour, depensesParJour) {
        const allDates = [...new Set([
            ...ventesParJour.map(v => v.date.toISOString().split('T')[0]),
            ...depensesParJour.map(d => d.date.toISOString().split('T')[0])
        ])].sort();

        const datasets = [
            {
                data: ventesParJour.map(v => v.count),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            },
            {
                data: allDates.map(date => {
                    const depense = depensesParJour.find(d => 
                        d.date.toISOString().split('T')[0] === date
                    );
                    return depense ? depense.count : null;
                }),
                borderColor: '#f43f5e',
                backgroundColor: '#f43f5e',
                borderWidth: 0,
                pointRadius: 6,
                pointStyle: 'rectRot',
                showLine: false
            }
        ];

        if (!this.chart) {
            const ctx = document.getElementById('sales-period-chart').getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: allDates.map(date => 
                        new Date(date).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'short' 
                        })
                    ),
                    datasets
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
                                    if (tooltipItem.datasetIndex === 0) {
                                        return `${tooltipItem.raw} vente${tooltipItem.raw > 1 ? 's' : ''}`;
                                    } else {
                                        return `${tooltipItem.raw} dépense${tooltipItem.raw > 1 ? 's' : ''}`;
                                    }
                                }
                            }
                        }
                    },
                    scales: {
                        x: { 
                            display: true,
                            grid: {
                                color: 'rgba(75, 85, 99, 0.2)'
                            },
                            ticks: {
                                color: '#9ca3af',
                                maxRotation: 45,
                                minRotation: 45
                            }
                        },
                        y: { 
                            display: true,
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(75, 85, 99, 0.2)'
                            },
                            ticks: {
                                color: '#9ca3af'
                            }
                        }
                    },
                    elements: {
                        point: {
                            radius: 3,
                            hitRadius: 10,
                            hoverRadius: 5,
                            hoverBorderWidth: 2,
                            backgroundColor: '#3b82f6',
                            borderColor: '#1e293b',
                            borderWidth: 2
                        }
                    }
                }
            });
        } else {
            this.chart.data.labels = allDates.map(date => 
                new Date(date).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'short' 
                })
            );
            this.chart.data.datasets = datasets;
            this.chart.update();
        }
    }

    getElement() {
        return this.element;
    }
}

export default SalesChartModule;
