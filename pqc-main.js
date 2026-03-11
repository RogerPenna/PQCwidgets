// pqc-main.js - Orquestrador do Ecossistema PQC
import { Home } from './modules/pqc/home.js';
// import { Diamante } from './modules/pqc/diamante.js'; // Planejado para depois

class PQCPortal {
    constructor() {
        this.currentPage = null;
        this.contentArea = document.getElementById('pqc-content');
        this.navItems = document.querySelectorAll('.nav-item');
        this.gristData = null;

        this.init();
    }

    async init() {
        console.log("Iniciando Portal PQC...");
        
        // Configura o Grist para escutar mudanças
        grist.ready({
            requiredAccess: 'full',
            columns: ['EmpresaRef', 'ChecklistData'] // Colunas base para o portal
        });

        grist.onRecord((record, mappings) => {
            this.gristData = { record, mappings };
            this.updateCompanyInfo(record);
            
            // Se já tiver uma página carregada, avisa que os dados mudaram
            if (this.currentPage && typeof this.currentPage.update === 'function') {
                this.currentPage.update(record, mappings);
            }
        });

        // Eventos de Navegação
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const pageId = e.target.closest('.nav-item').dataset.page;
                this.loadPage(pageId);
            });
        });

        // Carrega a página inicial por padrão
        this.loadPage('home');
    }

    updateCompanyInfo(record) {
        const companySpan = document.getElementById('company-name');
        if (record && record.EmpresaRef) {
            // Se for uma referência, pegamos o displayValue se disponível
            companySpan.textContent = record.EmpresaRef.displayValue || record.EmpresaRef;
        } else {
            companySpan.textContent = "Nenhuma empresa selecionada";
        }
    }

    async loadPage(pageId) {
        // Atualiza UI da sidebar
        this.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.page === pageId);
        });

        // Lógica de carregamento de módulos
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

// Inicia o app quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.pqcApp = new PQCPortal();
});
