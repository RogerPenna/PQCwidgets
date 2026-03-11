// pqc-main.js - Orquestrador do Ecossistema PQC
import { Home } from './modules/pqc/home.js';
import { GristTableLens } from './libraries/grist-table-lens/grist-table-lens.js';

class PQCPortal {
    constructor() {
        this.currentPage = null;
        this.contentArea = document.getElementById('pqc-content');
        this.navItems = document.querySelectorAll('.nav-item');
        this.companySelector = document.getElementById('company-selector');
        
        this.gristData = null;
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

        grist.onRecord((record, mappings) => {
            this.gristData = { record, mappings };
            this.syncSelectorWithRecord(record);
            
            if (this.currentPage && typeof this.currentPage.update === 'function') {
                this.currentPage.update(record, mappings);
            }
        });

        // Busca empresas usando o GTL
        try {
            console.log("Buscando empresas via GTL...");
            this.allCompanies = await this.gtl.fetchTableRecords('Empresa');
            console.log(`${this.allCompanies.length} empresas carregadas.`);
            this.populateCompanySelector();
        } catch (err) {
            console.error("ERRO ao carregar empresas:", err);
            this.companySelector.innerHTML = '<option value="">Erro ao carregar dados</option>';
        }

        // Navegação
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const pageId = e.target.closest('.nav-item').dataset.page;
                this.loadPage(pageId);
            });
        });

        // Selector
        this.companySelector.addEventListener('change', (e) => {
            const companyId = e.target.value;
            if (companyId) {
                grist.setSelectedRows([parseInt(companyId)]);
            }
        });

        this.loadPage('home');
    }

    populateCompanySelector() {
        this.companySelector.innerHTML = '<option value="">Selecionar Empresa...</option>';
        
        // Com GTL, os registros já vêm como objetos: { id, Nome_da_Empresa, ... }
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

    syncSelectorWithRecord(record) {
        if (record && record.id) {
            this.companySelector.value = record.id;
        }
    }

    async loadPage(pageId) {
        this.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.page === pageId);
        });

        this.contentArea.innerHTML = '<div class="loader">Carregando ' + pageId + '...</div>';

        try {
            switch (pageId) {
                case 'home':
                    this.currentPage = new Home(this.contentArea, this.gtl);
                    break;
                case 'diamante':
                    this.contentArea.innerHTML = '<h2>Checklist Diamante</h2><p>Módulo em desenvolvimento...</p>';
                    break;
                case 'autoavaliacao':
                    this.contentArea.innerHTML = '<h2>Autoavaliação</h2><p>Módulo em desenvolvimento...</p>';
                    break;
                default:
                    this.contentArea.innerHTML = '<h2>404</h2><p>Página não encontrada.</p>';
            }

            if (this.currentPage && typeof this.currentPage.render === 'function') {
                await this.currentPage.render(this.gristData?.record, this.gristData?.mappings);
            }
        } catch (error) {
            console.error("Erro ao carregar página:", error);
            this.contentArea.innerHTML = '<div class="error">Erro ao carregar a página ' + pageId + '</div>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.pqcApp = new PQCPortal();
});
