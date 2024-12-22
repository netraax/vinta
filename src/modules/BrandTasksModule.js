import { store } from '../dataStore.js';
import { getBrandLogo, formatBrandName } from '../config/brandLogos.js';

class BrandTasksModule {
    constructor(containerId) {
        this.element = document.createElement('div');
        this.element.id = containerId;
        this.element.className = 'module brand-tasks-module';
        this.init();
    }

    init() {
        this.element.innerHTML = `
            <div class="module-content">
                <div class="brand-stats-header">
                    <div class="brand-title">Top Marques</div>
                    <div class="header-item">Vues</div>
                    <div class="header-item">CA</div>
                    <div class="header-item last">Conv.</div>
                </div>
                <div class="brand-cards-container"></div>
            </div>
            <style>
                .module-content {
                    background: linear-gradient(180deg, rgba(30, 32, 35, 0.8) 0%, rgba(25, 27, 30, 0.6) 100%);
                    border-radius: 16px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                    width: fit-content;
                    backdrop-filter: blur(10px);
                }

                .brand-stats-header {
                    display: grid;
                    grid-template-columns: 280px 120px 120px 100px;
                    padding: 20px;
                    color: #a0a0a0;
                    font-size: 0.9em;
                    font-weight: 500;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(0, 0, 0, 0.2);
                }

                .brand-title {
                    font-size: 1.4em;
                    font-weight: 600;
                    color: #fff;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    letter-spacing: 0.5px;
                }

                .header-item {
                    text-align: right;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-size: 0.85em;
                }

                .header-item.last {
                    padding-right: 0;
                }

                .brand-cards-container {
                    padding: 8px 0;
                }

                .brand-card {
                    display: grid;
                    grid-template-columns: 280px 120px 120px 100px;
                    align-items: center;
                    padding: 16px 20px;
                    background: rgba(255, 255, 255, 0.02);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .brand-card::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, 
                        rgba(255,255,255,0) 0%, 
                        rgba(255,255,255,0.1) 50%, 
                        rgba(255,255,255,0) 100%);
                }

                .brand-card:last-child::after {
                    display: none;
                }

                .brand-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateX(5px);
                }

                .brand-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .brand-logo {
                    width: 36px;
                    height: 36px;
                    object-fit: contain;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
                    transition: transform 0.3s ease;
                }

                .brand-card:hover .brand-logo {
                    transform: scale(1.1);
                }

                .brand-name {
                    font-weight: 500;
                    font-size: 1.1em;
                    color: #fff;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .stat-value {
                    text-align: right;
                    color: #fff;
                    font-weight: 500;
                    font-size: 1.05em;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                }

                .stat-value.vues {
                    color: #64B5F6;
                    font-weight: 600;
                }

                .stat-value.ca {
                    color: #81C784;
                    font-weight: 600;
                }

                .stat-value.conv {
                    color: #EC407A;
                    font-weight: 600;
                    padding-right: 0;
                }
            </style>
        `;
        this.setupEventListeners();
        this.update();
    }

    getElement() {
        return this.element;
    }

    setupEventListeners() {
        store.subscribe(() => this.update());
    }

    calculateBrandStats() {
        const state = store.getState();
        const ventesStats = state.analyzedData?.ventes_stat || [];
        
        // Grouper par marque
        const brandStats = new Map();

        ventesStats.forEach(vente => {
            if (!vente || !vente.marque) return;
            
            // Debug: afficher la marque exacte avant normalisation
            console.log('Marque brute:', vente.marque);
            
            const brandName = vente.marque.toLowerCase().trim();
            console.log('Marque normalisée:', brandName);
            
            if (!brandStats.has(brandName)) {
                brandStats.set(brandName, {
                    name: formatBrandName(vente.marque), // Formater le nom pour l'affichage
                    rawName: brandName, // Garder le nom brut pour le logo
                    sales: 0,
                    revenue: 0,
                    vues: 0,
                    favoris: 0
                });
            }
            
            const stats = brandStats.get(brandName);
            stats.sales += 1;
            stats.revenue += parseFloat(vente.prix) || 0;
            stats.vues += parseInt(vente.vues) || 0;
            stats.favoris += parseInt(vente.favoris) || 0;
        });

        // Log pour debug
        console.log('\n📊 STATS PAR MARQUE :');
        brandStats.forEach((stats, brand) => {
            console.log({
                marque: stats.name,
                ventes: stats.sales,
                ca: stats.revenue.toFixed(2) + '€',
                vues: stats.vues,
                favoris: stats.favoris,
                logo: getBrandLogo(stats.rawName)
            });
        });

        return Array.from(brandStats.values())
            .sort((a, b) => b.vues - a.vues) // Trier par nombre de vues
            .slice(0, 5); // Top 5
    }

    update() {
        const brandStats = this.calculateBrandStats();
        const container = this.element.querySelector('.brand-cards-container');
        if (container) {
            container.innerHTML = brandStats
                .map(brand => this.createBrandCard(brand))
                .join('');
        }
    }

    createBrandCard(brand) {
        const tauxConversion = brand.vues ? ((brand.sales / brand.vues) * 100).toFixed(2) + "%" : "N/A";
        return `
            <div class="brand-card">
                <div class="brand-info">
                    <img src="${getBrandLogo(brand.rawName)}" alt="${brand.name} logo" class="brand-logo">
                    <span class="brand-name">${brand.name}</span>
                </div>
                <div class="stat-value vues">${brand.vues.toLocaleString()}</div>
                <div class="stat-value ca">${brand.revenue.toFixed(2)}€</div>
                <div class="stat-value conv">${tauxConversion}</div>
            </div>
        `;
    }
}

export default BrandTasksModule;
