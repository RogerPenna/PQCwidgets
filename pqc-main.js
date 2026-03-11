// pqc-main.js - Orquestrador do Ecossistema PQC
import { Home } from './modules/pqc/home.js';

class PQCPortal {
    constructor() {
        this.currentPage = null;
        this.contentArea = document.getElementById('pqc-content');
        this.navItems = document.querySelectorAll('.nav-item');
        this.companySelector = document.getElementById('company-selector');
        this.gristData = null;
        this.allCompanies = [];

        this.init();
    }

    async init() {
        console.log("Iniciando Portal PQC...");
        
        // Configura o Grist para escutar mudanças
        grist.ready({
            requiredAccess: 'full',
            columns: ['EmpresaRef', 'ChecklistData'] // Colunas base para o portal
        });

        // Escuta o registro selecionado no Grist
        grist.onRecord((record, mappings) => {
            this.gristData = { record, mappings };
            this.syncSelectorWithRecord(record);
            
            if (this.currentPage && typeof this.currentPage.update === 'function') {
                this.currentPage.update(record, mappings);
            }
        });

        // Busca todas as empresas disponíveis para popular o dropdown
        try {
            console.log("Buscando tabela 'Empresa'...");
            this.allCompanies = await grist.docApi.fetchTable('Empresa');
            console.log("Empresas carregadas:", this.allCompanies);
            this.populateCompanySelector();
        } catch (err) {
            console.error("ERRO CRÍTICO ao buscar empresas:", err);
            this.companySelector.innerHTML = '<option value="">Erro ao carregar (ver console)</option>';
        }

        // Eventos de Navegação
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const pageId = e.target.closest('.nav-item').dataset.page;
                this.loadPage(pageId);
            });
        });

        // Evento de Troca de Empresa no Dropdown
        this.companySelector.addEventListener('change', (e) => {
            const companyId = e.target.value;
            if (companyId) {
                // Solicita ao Grist que selecione este registro (sincronização bidirecional)
                grist.setSelectedRows([parseInt(companyId)]);
            }
        });

        // Carrega a página inicial por padrão
        this.loadPage('home');
    }

    populateCompanySelector() {
        this.companySelector.innerHTML = '<option value="">Selecionar Empresa...</option>';
        
        // Ordena por nome (conforme SCHEMA.md: Nome_da_Empresa)
        const sorted = [...this.allCompanies.id].map((id, index) => ({
            id: id,
            nome: this.allCompanies.Nome_da_Empresa[index]
        })).sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));

        sorted.forEach(comp => {
            const opt = document.createElement('option');
            opt.value = comp.id;
            opt.textContent = comp.nome || `ID: ${comp.id}`;
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
                    this.currentPage = new Home(this.contentArea);
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
