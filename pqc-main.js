// pqc-main.js - Orquestrador do Ecossistema PQC
import { Detalhes } from './modules/pqc/detalhes.js';
import { Capacitacao } from './modules/pqc/capacitacao.js';
import { Autoavaliacao } from './modules/pqc/autoavaliacao.js';
import { Melhorias } from './modules/pqc/melhorias.js';
import { GristTableLens } from './libraries/grist-table-lens/grist-table-lens.js';

class PQCPortal {
    constructor() {
        this.currentPage = null;
        this.contentArea = document.getElementById('pqc-content');
        this.menuSelector = document.getElementById('menu-selector');
        this.companySelector = document.getElementById('company-selector');
        
        this.gristData = { record: null, mappings: null };
        this.allCompanies = [];
        this.gtl = null;

        this.init();
    }

    async init() {
        console.log("Iniciando Portal PQC v1.0.2...");
        
        grist.ready({
            requiredAccess: 'full'
        });

        this.gtl = new GristTableLens(grist);

        // Listener oficial do Grist
        grist.onRecord((record, mappings) => {
            this.handleRecordUpdate(record, mappings);
        });

        // Busca todas as empresas para o seletor
        try {
            this.allCompanies = await this.gtl.fetchTableRecords('Empresa');
            this.populateCompanySelector();
        } catch (err) {
            console.error("ERRO ao carregar empresas:", err);
        }

        // Navegação via Dropdown de Menu
        this.menuSelector.addEventListener('change', (e) => {
            this.loadPage(e.target.value);
        });

        // Mudança Manual de Empresa (Dropdown)
        this.companySelector.addEventListener('change', (e) => {
            const companyId = e.target.value;
            if (companyId) {
                grist.setSelectedRows([parseInt(companyId)]);
                const record = this.allCompanies.find(c => c.id == companyId);
                if (record) {
                    this.handleRecordUpdate(record, this.gristData.mappings);
                }
            }
        });

        this.loadPage('home');
    }

    handleRecordUpdate(record, mappings) {
        if (!record) return;
        this.gristData = { record, mappings };
        
        if (this.companySelector.value != record.id) {
            this.companySelector.value = record.id;
        }

        const nameEl = document.getElementById('company-name');
        if (nameEl) {
            nameEl.textContent = record.Nome_da_Empresa || `ID: ${record.id}`;
            nameEl.style.display = 'inline-block';
        }

        if (this.currentPage && typeof this.currentPage.update === 'function') {
            this.currentPage.update(record, mappings);
        }
    }

    populateCompanySelector() {
        this.companySelector.innerHTML = '<option value="">Selecionar Empresa...</option>';
        const sorted = [...this.allCompanies].sort((a, b) => 
            (a.Nome_da_Empresa || "").localeCompare(b.Nome_da_Empresa || "")
        );

        sorted.forEach(comp => {
            const opt = document.createElement('option');
            opt.value = comp.id;
            opt.textContent = comp.Nome_da_Empresa || `ID: ${comp.id}`;
            this.companySelector.appendChild(opt);
        });
    }

    async loadPage(pageId) {
        this.menuSelector.value = pageId;
        this.contentArea.innerHTML = '<div class="loader">Carregando ' + pageId + '...</div>';

        try {
            switch (pageId) {
                case 'home':
                    this.currentPage = new Detalhes(this.contentArea, this.gtl);
                    break;
                case 'capacitacao':
                    this.currentPage = new Capacitacao(this.contentArea, this.gtl);
                    break;
                case 'autoavaliacao':
                    this.currentPage = new Autoavaliacao(this.contentArea, this.gtl);
                    break;
                case 'bonus':
                    this.contentArea.innerHTML = '<h2>🎁 Bônus Pontualidade IC</h2><p>Em desenvolvimento...</p>';
                    break;
                case 'resultados':
                    this.contentArea.innerHTML = '<h2>📊 Resultados</h2><p>Em desenvolvimento...</p>';
                    break;
                case 'melhorias':
                    this.currentPage = new Melhorias(this.contentArea, this.gtl);
                    break;
                default:
                    this.contentArea.innerHTML = '<h2>404</h2><p>Página não encontrada.</p>';
            }

            if (this.currentPage && typeof this.currentPage.render === 'function') {
                await this.currentPage.render(this.gristData.record, this.gristData.mappings);
            }
        } catch (error) {
            console.error("Erro ao carregar página:", error);
            this.contentArea.innerHTML = '<div class="error">Erro ao carregar a página</div>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.pqcApp = new PQCPortal();
});
