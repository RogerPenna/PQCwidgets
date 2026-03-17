// modules/pqc/home.js - Dashboard Moderno Role-Based
export class Home {
    constructor(container, gtl, userRole) {
        this.container = container;
        this.gtl = gtl;
        this.userRole = userRole || 'user';
    }

    async render(record, mappings) {
        if (this.userRole === 'auditor') {
            await this.renderAuditorView();
        } else {
            await this.renderUserView(record, mappings);
        }
    }

    async renderUserView(record, mappings) {
        this.container.innerHTML = `
            <div class="dashboard-header" style="margin-bottom: 30px;">
                <h1 style="font-size: 1.8rem; font-weight: 700;">Olá, ${record?.Nome_da_Empresa || 'Bem-vindo'}</h1>
                <p style="color: var(--pqc-slate);">Acompanhe o progresso da sua autoavaliação para o ciclo atual.</p>
            </div>
            
            <div class="dashboard-grid">
                ${this.createStepCard('Perfil da Empresa', '📋', 100, 'home')}
                ${this.createStepCard('Práticas de Gestão', '📝', 65, 'autoavaliacao')}
                ${this.createStepCard('Resultados', '📊', 20, 'resultados')}
                ${this.createStepCard('Plano de Melhorias', '🛠️', 0, 'melhorias')}
                ${this.createStepCard('Capacitação', '⏲️', 45, 'capacitacao')}
                ${this.createStepCard('Bônus Pontualidade', '🎁', 10, 'bonus')}
            </div>
        `;

        // Adiciona listeners para os cards
        this.container.querySelectorAll('.card-step').forEach(card => {
            card.onclick = () => window.pqcApp.loadPage(card.dataset.page);
        });
    }

    createStepCard(title, icon, progress, page) {
        return `
            <div class="card-step" data-page="${page}">
                <div class="card-header">
                    <div class="card-icon">${icon}</div>
                    <div class="card-title">${title}</div>
                </div>
                <div class="progress-wrapper">
                    <div class="progress-label">
                        <span>Progresso</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    async renderAuditorView() {
        const companies = await this.gtl.fetchTableRecords('Empresa');
        
        this.container.innerHTML = `
            <div class="dashboard-header" style="margin-bottom: 30px;">
                <h1 style="font-size: 1.8rem; font-weight: 700;">Painel de Comando do Auditor</h1>
                <p style="color: var(--pqc-slate);">Gerencie e valide as autoavaliações das empresas sob sua responsabilidade.</p>
            </div>

            <div class="card" style="padding: 0; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                    <thead style="background: var(--pqc-bg); text-align: left;">
                        <tr>
                            <th style="padding: 15px 20px; color: var(--pqc-slate);">Empresa</th>
                            <th style="padding: 15px 20px; color: var(--pqc-slate);">Status</th>
                            <th style="padding: 15px 20px; color: var(--pqc-slate);">Última Atividade</th>
                            <th style="padding: 15px 20px; color: var(--pqc-slate); text-align: right;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${companies.map(c => `
                            <tr style="border-bottom: 1px solid var(--pqc-border);">
                                <td style="padding: 15px 20px; font-weight: 600;">${c.Nome_da_Empresa || 'ID: '+c.id}</td>
                                <td style="padding: 15px 20px;">
                                    <span class="badge ${this.getStatusBadgeClass(c.Estagio)}">${c.Estagio || 'Pendente'}</span>
                                </td>
                                <td style="padding: 15px 20px; color: var(--pqc-slate);">${c.Data_da_Ultima_Atualizacao || '--'}</td>
                                <td style="padding: 15px 20px; text-align: right;">
                                    <button class="btn-icon" onclick="grist.setSelectedRows([${c.id}]); window.pqcApp.loadPage('validar')" title="Auditar">🔍</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    getStatusBadgeClass(estagio) {
        if (!estagio) return 'default';
        const e = estagio.toLowerCase();
        if (e.includes('diamante')) return 'diamante';
        if (e.includes('ouro')) return 'ouro';
        if (e.includes('prata')) return 'prata';
        return 'default';
    }

    update(record, mappings) {
        // Se estiver na view de usuário, o render já cuida de atualizar com base no record.
        // Se estiver na auditoria, o update pode disparar um re-fetch se necessário.
    }
}
