// pqc-main.js - Orquestrador do Ecossistema PQC v1.1.0
import { Home } from './modules/pqc/home.js';
import { Detalhes } from './modules/pqc/detalhes.js';
import { Capacitacao } from './modules/pqc/capacitacao.js';
import { Autoavaliacao } from './modules/pqc/autoavaliacao.js';
import { Melhorias } from './modules/pqc/melhorias.js';
import { renderChecklist } from './modules/diamante.js';
import { GristTableLens } from './libraries/grist-table-lens/grist-table-lens.js';

class PQCPortal {
    constructor() {
        this.currentPage = null;
        this.contentArea = document.getElementById('pqc-content');
        this.companyNameBadge = document.getElementById('company-name-badge');
        this.companyLogo = document.getElementById('company-logo');
        
        this.gristData = { record: null, mappings: null };
        this.allCompanies = [];
        this.gtl = null;
        this.userRole = 'user'; // 'user' ou 'auditor'

        this.init();
    }

    async init() {
        console.log("Iniciando Portal PQC v1.1.0...");
        
        grist.ready({ requiredAccess: 'full' });
        this.gtl = new GristTableLens(grist);

        // Listeners do Grist
        grist.onRecord((record, mappings) => this.handleRecordUpdate(record, mappings));

        // Carrega dados iniciais
        try {
            this.allCompanies = await this.gtl.fetchTableRecords('Empresa');
            await this.detectUserRole();
            this.setupEventListeners();
        } catch (err) {
            console.error("Erro no init:", err);
        }

        this.loadPage('dashboard');
    }

    async detectUserRole() {
        try {
            // Verifica se o usuário atual está na tabela Avaliadores
            const userTable = await grist.docApi.fetchTable('Avaliadores');
            // O Grist não fornece o email do usuário facilmente em widgets sem permissões extras,
            // então vamos basear na existência de registros ou em uma lógica de 'Avaliador' no record.
            // Por enquanto, se houver registros na tabela Avaliadores e o doc for aberto por um, 
            // assumiremos auditor se o record selecionado tiver um AvaliadorRef que bata com o user.
            // Para o MVP: Se houver dados em Avaliadores, habilitamos o menu Auditoria.
            if (userTable.id && userTable.id.length > 0) {
                this.userRole = 'auditor';
                document.getElementById('nav-auditoria').style.display = 'block';
            }
        } catch (e) {
            console.warn("Não foi possível detectar role de auditor:", e);
        }
    }

    setupEventListeners() {
        // Botão Home
        document.getElementById('btn-home').addEventListener('click', () => this.loadPage('dashboard'));

        // Trigger do Search Modal
        document.getElementById('btn-search-trigger').addEventListener('click', () => this.toggleSearchModal(true));

        // Fechar Modal ao clicar fora
        const modal = document.getElementById('search-modal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.toggleSearchModal(false);
        });

        // Input de Busca
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => this.filterCompanies(e.target.value));

        // Cliques nos itens de menu (dropdown items)
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                this.loadPage(item.dataset.page);
            });
        });
    }

    handleRecordUpdate(record, mappings) {
        if (!record) return;
        this.gristData = { record, mappings };
        
        // Atualiza Badge de Identidade
        const name = record.Nome_da_Empresa || `ID: ${record.id}`;
        this.companyNameBadge.textContent = name;
        this.companyLogo.textContent = name.charAt(0).toUpperCase();

        if (this.currentPage && typeof this.currentPage.update === 'function') {
            this.currentPage.update(record, mappings);
        }
    }

    toggleSearchModal(show) {
        const modal = document.getElementById('search-modal');
        modal.style.display = show ? 'flex' : 'none';
        if (show) {
            const input = document.getElementById('search-input');
            input.value = '';
            input.focus();
            this.filterCompanies('');
        }
    }

    filterCompanies(query) {
        const resultsArea = document.getElementById('search-results');
        resultsArea.innerHTML = '';
        
        const filtered = this.allCompanies.filter(c => 
            (c.Nome_da_Empresa || "").toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10); // Limita a 10 resultados para performance

        filtered.forEach(comp => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerHTML = `
                <span class="result-name">${comp.Nome_da_Empresa || 'Sem Nome'}</span>
                <span class="result-meta">ID: ${comp.id}</span>
            `;
            div.onclick = () => {
                grist.setSelectedRows([comp.id]);
                // Força atualização imediata no portal
                this.handleRecordUpdate(comp, this.gristData.mappings);
                this.toggleSearchModal(false);
            };
            resultsArea.appendChild(div);
        });
    }

    async loadPage(pageId) {
        this.contentArea.innerHTML = '<div class="loader">Carregando ' + pageId + '...</div>';

        try {
            switch (pageId) {
                case 'dashboard':
                    this.currentPage = new Home(this.contentArea, this.gtl, this.userRole);
                    break;
                case 'home':
                    this.currentPage = new Detalhes(this.contentArea, this.gtl);
                    break;
                case 'autoavaliacao':
                    this.currentPage = new Autoavaliacao(this.contentArea, this.gtl);
                    break;
                case 'capacitacao':
                    this.currentPage = new Capacitacao(this.contentArea, this.gtl);
                    break;
                case 'melhorias':
                    this.currentPage = new Melhorias(this.contentArea, this.gtl);
                    break;
                case 'diamante':
                    this.currentPage = new DiamanteModule(this.contentArea, this.gtl);
                    break;
                case 'resultados':
                    this.contentArea.innerHTML = '<div class="detalhes-container"><h2>📊 Resultados</h2><p>Módulo em integração...</p></div>';
                    break;
                case 'evolucao':
                    this.contentArea.innerHTML = '<div class="detalhes-container"><h2>📈 Evolução Histórica</h2><p>Módulo em integração...</p></div>';
                    break;
                case 'bonus':
                    this.contentArea.innerHTML = '<div class="detalhes-container"><h2>🎁 Bônus Pontualidade</h2><p>Módulo em integração...</p></div>';
                    break;
                case 'validar':
                    this.contentArea.innerHTML = '<div class="detalhes-container"><h2>✅ Validação de Auditoria</h2><p>Módulo em integração...</p></div>';
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

class DiamanteModule {
    constructor(container, gtl) {
        this.container = container;
        this.gtl = gtl;
        this.checklistRecordId = null;
    }

    async render(record, mappings) {
        if (!record) return;
        this.container.innerHTML = '<div id="app" class="pqc-compat"><div class="checklist-wrapper"></div></div>';
        const checklistRecord = await this.gtl.findRecord('Checklistdiamante', { EmpresaRef: record.id });
        
        let currentData = {};
        if (checklistRecord && checklistRecord.ChecklistData) {
            try { currentData = JSON.parse(checklistRecord.ChecklistData); } catch(e) {}
        }
        this.checklistRecordId = checklistRecord?.id;

        const saveCallback = async (newData) => {
            const jsonString = JSON.stringify(newData);
            if (this.checklistRecordId) {
                await grist.docApi.updateRecords('Checklistdiamante', [{ id: this.checklistRecordId, fields: { ChecklistData: jsonString } }]);
            } else {
                const res = await grist.docApi.addRecords('Checklistdiamante', [{ fields: { ChecklistData: jsonString, EmpresaRef: record.id } }]);
                if (res && res[0]) this.checklistRecordId = res[0];
            }
        };

        renderChecklist(this.container.querySelector('.checklist-wrapper'), currentData, saveCallback, record.Nome_da_Empresa, record.Diamante);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.pqcApp = new PQCPortal();
});
