// modules/pqc/autoavaliacao.js

export class Autoavaliacao {
    constructor(container, gtl) {
        this.container = container;
        this.gtl = gtl;
        this.companyRecord = null;
        this.storageRecordId = null;
        this.hierarchy = null;
        this.opcoes = [];
        this.evaluations = {}; // JSON que será salvo
        this.hasChanges = false;
    }

    async render(record, mappings) {
        this.companyRecord = record;
        this.container.innerHTML = '<div class="loader">Carregando Estrutura de Práticas...</div>';

        // Carrega dados necessários em paralelo
        if (!this.hierarchy) {
            await this.loadStructure();
        }
        
        await this.loadDataFromRelatedTable();

        this.renderUI();
    }

    async loadStructure() {
        try {
            const [sessoes, subsessoes, questoes, practices, opcoes] = await Promise.all([
                this.gtl.fetchTableRecords('Sessoes'),
                this.gtl.fetchTableRecords('Subsessoes'),
                this.gtl.fetchTableRecords('Questoes'),
                this.gtl.fetchTableRecords('Practices'),
                this.gtl.fetchTableRecords('Opcoes')
            ]);

            this.opcoes = opcoes.sort((a, b) => (a.Pts || 0) - (b.Pts || 0));

            // Constrói a árvore de dados
            this.hierarchy = sessoes.map(s => {
                const subForSessao = subsessoes.filter(sub => sub.RefSessao == s.id);
                return {
                    id: s.id,
                    nome: s.Sessao_NomeSessao || `Sessão ${s.id}`,
                    subsessoes: subForSessao.map(sub => {
                        const questoesForSub = questoes.filter(q => q.RefSub == sub.id);
                        return {
                            id: sub.id,
                            nome: sub.Subsessao,
                            questoes: questoesForSub.map(q => {
                                // q.Praticas costuma ser uma lista de IDs [L, id1, id2...]
                                const practiceIds = Array.isArray(q.Praticas) ? q.Praticas.slice(1) : [];
                                return {
                                    id: q.id,
                                    texto: q.Questoes,
                                    praticas: practiceIds.map(pid => {
                                        const p = practices.find(p => p.id == pid);
                                        return p ? { id: p.id, label: p.PractNum || `P${p.id}` } : null;
                                    }).filter(p => p !== null)
                                };
                            })
                        };
                    })
                };
            });
        } catch (err) {
            console.error("Erro ao carregar estrutura:", err);
            this.container.innerHTML = '<div class="error">Erro ao carregar estrutura de práticas.</div>';
        }
    }

    async loadDataFromRelatedTable() {
        this.evaluations = {};
        this.storageRecordId = null;
        this.hasChanges = false;

        if (!this.companyRecord) return;

        try {
            // Busca o registro único de PDCA para esta empresa
            const relatedRecord = await this.gtl.findRecord('PDCA', { 
                EmpresaRef: this.companyRecord.id 
            });

            if (relatedRecord) {
                this.storageRecordId = relatedRecord.id;
                // Usamos Evidencia_Planejar como storage temporário do JSON se não houver coluna dedicada
                const rawJSON = relatedRecord.Evidencia_Planejar; 
                try {
                    this.evaluations = rawJSON && rawJSON.startsWith('{') ? JSON.parse(rawJSON) : {};
                } catch (e) {
                    this.evaluations = {};
                }
            }
        } catch (err) {
            console.error("Erro ao carregar avaliações:", err);
        }
    }

    renderUI() {
        if (!this.hierarchy) return;

        this.container.innerHTML = `
            <div class="auto-container">
                <header class="pqc-header">
                    <h1>📝 Autoavaliação - PDCA</h1>
                    <p>Avalie o nível de maturidade de cada prática de gestão.</p>
                </header>

                <div id="auto-content">
                    ${this.hierarchy.map(sessao => this.renderSession(sessao)).join('')}
                </div>

                <div class="save-bar">
                    <span id="save-status" class="save-status">Sem alterações</span>
                    <button id="btn-save-auto" class="save-btn" disabled>💾 Salvar Autoavaliação</button>
                </div>
            </div>
        `;

        this.addEventListeners();
    }

    renderSession(sessao) {
        return `
            <div class="session-block">
                <div class="session-header">${sessao.nome}</div>
                <div class="session-body">
                    ${sessao.subsessoes.map(sub => `
                        <div class="subsession-block">
                            <div class="subsession-title">${sub.nome}</div>
                            ${sub.questoes.map(q => this.renderQuestion(q)).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderQuestion(q) {
        return `
            <div class="question-item">
                <div class="question-text">${q.texto}</div>
                <div class="pdca-grid">
                    ${['P', 'D', 'C', 'A'].map(stage => this.renderStage(q.id, stage)).join('')}
                </div>
            </div>
        `;
    }

    renderStage(questionId, stage) {
        const key = `${questionId}_${stage}`;
        const current = this.evaluations[key] || { val: 6, txt: "" };

        return `
            <div class="pdca-stage">
                <label>${this.getStageLabel(stage)}</label>
                <select data-key="${key}" data-type="val">
                    ${this.opcoes.map(opt => `
                        <option value="${opt.id}" ${current.val == opt.id ? 'selected' : ''}>
                            ${opt.Opcoes} (${opt.Pts}%)
                        </option>
                    `).join('')}
                </select>
                <textarea placeholder="Evidências..." data-key="${key}" data-type="txt">${current.txt}</textarea>
            </div>
        `;
    }

    getStageLabel(stage) {
        const labels = { 'P': 'Planejar', 'D': 'Realizar', 'C': 'Verificar', 'A': 'Aprender' };
        return labels[stage] || stage;
    }

    addEventListeners() {
        const inputs = this.container.querySelectorAll('select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const key = e.target.dataset.key;
                const type = e.target.dataset.type;
                const val = e.target.value;

                if (!this.evaluations[key]) this.evaluations[key] = { val: 6, txt: "" };
                this.evaluations[key][type] = type === 'val' ? parseInt(val) : val;

                this.markAsChanged();
            });
        });

        const saveBtn = this.container.querySelector('#btn-save-auto');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.save());
        }
    }

    markAsChanged() {
        this.hasChanges = true;
        const saveBtn = this.container.querySelector('#btn-save-auto');
        if (saveBtn) saveBtn.disabled = false;
        document.getElementById('save-status').textContent = 'Alterações pendentes...';
        document.getElementById('save-status').className = 'save-status saving';
    }

    async save() {
        if (!this.companyRecord || !this.hasChanges) return;

        const saveBtn = this.container.querySelector('#btn-save-auto');
        saveBtn.disabled = true;
        saveBtn.textContent = '⌛ Salvando...';

        const jsonString = JSON.stringify(this.evaluations);
        
        // Usamos Evidencia_Planejar como storage. Se o usuário criou uma coluna dedicada, basta mudar aqui.
        const fields = {
            Evidencia_Planejar: jsonString
        };

        try {
            if (this.storageRecordId) {
                await grist.docApi.applyUserActions([
                    ['UpdateRecord', 'PDCA', this.storageRecordId, fields]
                ]);
            } else {
                fields.EmpresaRef = this.companyRecord.id;
                await grist.docApi.applyUserActions([
                    ['AddRecord', 'PDCA', null, fields]
                ]);
            }

            this.hasChanges = false;
            document.getElementById('save-status').textContent = 'Tudo salvo!';
            document.getElementById('save-status').className = 'save-status success';
            saveBtn.textContent = '✅ Salvo!';
            setTimeout(() => {
                saveBtn.textContent = '💾 Salvar Autoavaliação';
            }, 2000);
        } catch (err) {
            console.error("Erro ao salvar PDCA:", err);
            document.getElementById('save-status').textContent = 'Erro ao salvar!';
            document.getElementById('save-status').className = 'save-status error';
            saveBtn.disabled = false;
        }
    }

    async update(record, mappings) {
        if (record && (!this.companyRecord || record.id !== this.companyRecord.id)) {
            this.companyRecord = record;
            await this.loadDataFromRelatedTable();
            this.renderUI();
        }
    }
}
