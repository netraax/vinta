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
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <h2 class="text-lg font-semibold text-gray-200">Distribution Géographique</h2>
                </div>
            </div>
            <div class="relative h-40 mb-2">
                <canvas id="countrySalesChart"></canvas>
            </div>
            <div class="flex items-center justify-center text-xs text-gray-400 mt-2">
                <span id="totalCountries" class="inline-flex items-center px-2 py-1 bg-indigo-900/30 text-indigo-300 rounded-full"></span>
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

        if (!analyzedData || !analyzedData.boutique || !analyzedData.boutique.stats) return;

        // Récupérer toutes les ventes, y compris celles de la France
        const ventesTotales = analyzedData.boutique.stats.ventesTotales || {};
        
        // Calculer le total des ventes (France + International)
        const totalVentes = Object.values(ventesTotales).reduce((acc, count) => acc + count, 0);
        const ventesFrance = ventesTotales.france || 0;
        const ventesInternationales = totalVentes - ventesFrance;
        
        // Calculer et afficher le pourcentage de ventes internationales
        let message = '';
        if (totalVentes === 0) {
            message = 'Pas de ventes';
        } else {
            const pourcentage = (ventesInternationales / totalVentes * 100).toFixed(0);
            message = `${pourcentage}% à l'international`;
        }
        document.getElementById('totalCountries').textContent = message;

        // Pour le graphique, on n'utilise que les ventes internationales
        const salesByCountry = { ...ventesTotales };
        delete salesByCountry.france;  // Retirer la France du graphique
        this.updateChart(salesByCountry);
    }

    updateChart(salesByCountry) {
        const ctx = document.getElementById('countrySalesChart');
        
        if (this.chart) {
            this.chart.destroy();
        }

        // Préparer les données pour le graphique
        const labels = [];
        const data = [];
        const rawData = {};  // Pour stocker les valeurs brutes

        // Créer un dégradé de bleu-vert plus doux
        const colors = [
            'rgba(45, 212, 191, 0.85)',   // Turquoise principal
            'rgba(34, 211, 238, 0.85)',   // Cyan
            'rgba(56, 189, 248, 0.85)',   // Bleu clair
        ];

        // Filtrer et trier les pays par nombre de ventes
        Object.entries(salesByCountry)
            .filter(([_, value]) => value > 0)
            .sort((a, b) => b[1] - a[1])
            .forEach(([country, value]) => {
                const countryName = this.getCountryName(country);
                labels.push(countryName);
                data.push(value);
                rawData[countryName] = value;
            });

        this.chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderColor: 'rgba(17, 24, 39, 0.8)',
                    borderWidth: 2,
                    hoverBorderColor: '#ffffff',
                    hoverBorderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 5,
                        bottom: 5
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: 'rgb(156, 163, 175)',
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            padding: 10,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            boxWidth: 6
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return ` ${label}: ${value} ventes (${percentage}%)`;
                            }
                        },
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        titleColor: 'rgb(209, 213, 219)',
                        bodyColor: 'rgb(209, 213, 219)',
                        padding: 10,
                        cornerRadius: 6,
                        displayColors: false
                    }
                }
            }
        });
    }

    getCountryName(country) {
        const countryNames = {
            italie: 'Italie',
            espagne: 'Espagne',
            allemagne: 'Allemagne',
            republiqueTcheque: 'Rép. Tchèque',
            lituanie: 'Lituanie',
            paysBas: 'Pays-Bas',
            royaumeUni: 'Royaume-Uni'
        };
        return countryNames[country] || country;
    }
}
