import { store } from '../dataStore.js';
import Chart from 'chart.js/auto';

class EngagementModule {
    constructor() {
        this.element = this.createModule();
        this.chart = null;
        store.subscribe(() => this.updateStats());
    }

    createModule() {
        const module = document.createElement('div');
        module.className = 'bg-dark-800 rounded-lg shadow-lg p-6 h-full w-64 transform transition-all duration-300 hover:scale-105 hover:shadow-xl';
        module.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-200 flex items-center">
                    <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    Engagement
                </h2>
            </div>

            <div class="flex justify-between text-xs mb-6">
                <div class="text-center">
                    <span class="text-violet-400">Vues</span>
                    <div id="totalViews" class="text-violet-300 font-bold text-lg">0</div>
                </div>
                <div class="text-center">
                    <span class="text-pink-400">Ventes</span>
                    <div id="totalFavorites" class="text-pink-300 font-bold text-lg">0</div>
                </div>
            </div>

            <div class="relative h-52 mb-4">
                <canvas id="engagementChart"></canvas>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span id="engagementRate" class="text-4xl font-bold text-gray-200">0%</span>
                    <p class="text-xs text-gray-400 mt-1">Taux de conversion</p>
                </div>
            </div>

            <div class="mt-2">
                <p id="performanceMessage" class="text-sm text-center font-medium"></p>
            </div>
        `;
        return module;
    }

    getPerformanceMessage(tauxConversion) {
        if (tauxConversion >= 3) {
            return '<span class="text-green-400">🌟 Excellent taux de conversion ! Vos articles sont très attractifs.</span>';
        } else if (tauxConversion >= 2) {
            return '<span class="text-blue-400">✨ Très bon taux de conversion ! Continuez ainsi.</span>';
        } else if (tauxConversion >= 1) {
            return '<span class="text-yellow-400">👍 Bon taux de conversion. Il y a encore du potentiel.</span>';
        } else {
            return '<span class="text-gray-400">💡 Optimisez vos descriptions pour augmenter vos conversions.</span>';
        }
    }

    updateStats() {
        const state = store.getState();
        const { analyzedData } = state;

        if (!analyzedData || !analyzedData.ventes_stat) return;

        // Calculer les totaux
        const totalVues = analyzedData.ventes_stat.reduce((sum, v) => sum + parseInt(v.vues), 0);
        const nombreVentes = analyzedData.ventes_stat.length;
        
        // Calculer le taux de conversion (ventes/vues)
        const tauxConversion = totalVues > 0 ? (nombreVentes / totalVues * 100) : 0;

        // Mettre à jour l'affichage
        document.getElementById('totalViews').textContent = totalVues.toLocaleString();
        document.getElementById('totalFavorites').textContent = nombreVentes.toLocaleString();
        document.getElementById('engagementRate').textContent = `${tauxConversion.toFixed(2)}%`;
        document.getElementById('performanceMessage').innerHTML = this.getPerformanceMessage(tauxConversion);

        // Mettre à jour le graphique
        this.updateChart(totalVues, nombreVentes, tauxConversion);
    }

    updateChart(totalVues, nombreVentes, tauxConversion) {
        const ctx = document.getElementById('engagementChart');
        
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Vues', 'Ventes'],
                datasets: [{
                    data: [totalVues - nombreVentes, nombreVentes],
                    backgroundColor: [
                        'rgba(167, 139, 250, 0.2)',  // Violet clair pour les vues
                        'rgba(167, 139, 250, 0.6)'   // Violet plus foncé pour les ventes
                    ],
                    borderColor: [
                        'rgba(167, 139, 250, 0.5)',
                        'rgba(167, 139, 250, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '85%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const percentage = ((value / totalVues) * 100).toFixed(1);
                                return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                            }
                        },
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        titleColor: 'rgb(209, 213, 219)',
                        bodyColor: 'rgb(209, 213, 219)',
                        padding: 12,
                        cornerRadius: 8
                    }
                }
            }
        });
    }

    getElement() {
        return this.element;
    }
}

export default EngagementModule;
