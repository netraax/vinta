import { store } from '../dataStore.js';
import Chart from 'chart.js/auto';

export default class CountrySalesModule {
    constructor() {
        this.element = this.createModule();
        this.chart = null;
        store.subscribe(() => this.updateStats());
    }

    createModule() {
        const module = document.createElement('div');
        module.className = 'bg-dark-800 rounded-lg shadow-lg p-4 h-full w-64 transform transition-all duration-300 hover:scale-105 hover:shadow-xl';
        module.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <h2 class="text-lg font-semibold text-gray-200 flex items-center">
                    <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Ventes par Pays
                </h2>
            </div>
            <div class="relative h-40">
                <canvas id="countrySalesChart"></canvas>
            </div>
            <div class="mt-1 text-xs text-gray-400 text-center">
                <span id="totalCountries">0 pays</span>
            </div>
        `;
        return module;
    }

    getElement() {
        return this.element;
    }

    updateStats() {
        const state = store.getState();
        const { analyzedData } = state;

        if (!analyzedData || !analyzedData.ventes_stat) return;

        // Compter les ventes par pays
        const salesByCountry = analyzedData.ventes_stat.reduce((acc, vente) => {
            const pays = vente.pays || 'Inconnu';
            acc[pays] = (acc[pays] || 0) + 1;
            return acc;
        }, {});

        // Mettre à jour le nombre total de pays
        const nombrePays = Object.keys(salesByCountry).length;
        document.getElementById('totalCountries').textContent = `${nombrePays} pays`;

        // Mettre à jour le graphique
        this.updateChart(salesByCountry);
    }

    updateChart(salesByCountry) {
        const ctx = document.getElementById('countrySalesChart');
        
        if (this.chart) {
            this.chart.destroy();
        }

        const colors = [
            'rgba(167, 139, 250, 0.8)',  // Violet
            'rgba(236, 72, 153, 0.8)',   // Rose
            'rgba(45, 212, 191, 0.8)',   // Turquoise
            'rgba(251, 146, 60, 0.8)',   // Orange
            'rgba(99, 102, 241, 0.8)'    // Indigo
        ];

        const data = {
            labels: Object.keys(salesByCountry),
            datasets: [{
                data: Object.values(salesByCountry),
                backgroundColor: Object.keys(salesByCountry).map((_, index) => 
                    colors[index % colors.length]
                ),
                borderWidth: 0,
                hoverOffset: 4
            }]
        };

        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.2,
                layout: {
                    padding: {
                        top: 5,
                        bottom: 5,
                        left: 5,
                        right: 5
                    }
                },
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'rgba(229, 231, 235, 0.9)',
                            font: {
                                size: 10
                            },
                            padding: 5
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                        titleColor: 'rgba(229, 231, 235, 0.9)',
                        bodyColor: 'rgba(229, 231, 235, 0.9)',
                        padding: 8,
                        boxPadding: 4
                    }
                },
                cutout: '60%',
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }
}
