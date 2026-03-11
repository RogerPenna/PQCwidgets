// modules/pqc/home.js
export class Home {
    constructor(container) {
        this.container = container;
    }

    async render(record, mappings) {
        this.container.innerHTML = `
            <div class="dashboard-header">
                <h1>Bem-vindo ao Portal PQC</h1>
                <p>Aqui você encontrará um resumo do status da sua empresa no ciclo de avaliação atual.</p>
            </div>
            
            <div class="dashboard-grid">
                <div class="card card-status">
                    <h3>Status Atual</h3>
                    <div id="status-badge" class="badge">Aguardando dados...</div>
                </div>

                <div class="card card-action">
                    <h3>Ações Recomendadas</h3>
                    <ul id="recommendations">
                        <li>Inicie o Checklist Diamante</li>
                        <li>Verifique sua Autoavaliação</li>
                    </ul>
                </div>

                <div class="card card-stats">
                    <h3>Progresso</h3>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: 25%;">25%</div>
                    </div>
                </div>
            </div>

            <div class="dashboard-details">
                <h3>Dados da Empresa</h3>
                <pre id="raw-record-debug">${JSON.stringify(record, null, 2)}</pre>
            </div>
        `;
        
        if (record) {
            this.update(record, mappings);
        }
    }

    update(record, mappings) {
        const badge = document.getElementById('status-badge');
        const debugArea = document.getElementById('raw-record-debug');
        
        if (badge) {
            badge.textContent = record.Estagio || 'Em Análise';
            badge.className = 'badge ' + (record.Estagio ? record.Estagio.toLowerCase() : 'default');
        }

        if (debugArea) {
            debugArea.textContent = JSON.stringify(record, null, 2);
        }
    }
}
