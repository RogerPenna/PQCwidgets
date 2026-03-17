// modules/pqc/melhorias.js

export class Melhorias {
    constructor(container, gtl) {
        this.container = container;
        this.gtl = gtl;
        this.companyRecord = null;
        this.storageRecordId = null;
        this.plans = []; // Array de objetos { lacuna, oque, como, quem, quando, check }
        this.hasChanges = false;
        this.schema = null;
        this.checkOptions = [
            { val: 0, label: "0%", class: "check-0" },
            { val: 25, label: "25%", class: "check-25" },
            { val: 50, label: "50%", class: "check-50" },
            { val: 75, label: "75%", class: "check-75" },
            { val: 100, label: "100%", class: "check-100" }
        ];
    }

    async render(record, mappings) {
        this.companyRecord = record;
        
        if (!this.schema) {
            this.schema = await this.gtl.getTableSchema('Plano_de_Melhorias');
        }

        await this.loadDataFromRelatedTable();
        this.renderUI();
    }

    renderHelpIcon(colId) {
        const colMeta = this.schema?.[colId];
        if (colMeta?.description) {
            return `<span class="help-icon" data-tooltip="${colMeta.description}">?</span>`;
        }
        return "";
    }

    async loadDataFromRelatedTable() {
        this.plans = [];
        this.storageRecordId = null;
        this.hasChanges = false;

        if (!this.companyRecord) return;

        try {
            const relatedRecord = await this.gtl.findRecord('Plano_de_Melhorias', { 
                EmpresaRef: this.companyRecord.id 
            });

            if (relatedRecord) {
                this.storageRecordId = relatedRecord.id;
                const rawJSON = relatedRecord.Lacuna_identificada;
                try {
                    this.plans = (rawJSON && rawJSON.startsWith('[')) ? JSON.parse(rawJSON) : [];
                } catch (e) {
                    this.plans = [];
                }
            }
        } catch (err) {
            console.error("Erro ao carregar Planos de Melhorias:", err);
        }
    }

    renderUI() {
        this.container.innerHTML = `
            <div class="melhorias-container">
                <header class="melhorias-header">
                    <div>
                        <h1>🛠️ Plano de Melhorias</h1>
                        <p>Registre as ações para fechar as lacunas identificadas.</p>
                    </div>
                    <button id="btn-add-plan" class="btn-add-plan">➕ Novo Plano</button>
                </header>

                <div id="plan-list" class="plan-list">
                    ${this.plans.length === 0 ? '<p style="text-align:center; color:#999; padding:20px;">Nenhum plano registrado. Clique em + para começar.</p>' : ''}
                    ${this.plans.map((plan, index) => this.renderPlanCard(plan, index)).join('')}
                </div>

                <div class="save-bar">
                    <span id="save-status" class="save-status">Sem alterações</span>
                    <button id="btn-save-melhorias" class="save-btn" disabled>💾 Salvar Alterações</button>
                </div>
            </div>
        `;

        this.addEventListeners();
    }

    renderPlanCard(plan, index) {
        const currentCheck = plan.check !== undefined ? plan.check : 0;
        const checkClass = this.checkOptions.find(o => o.val == currentCheck)?.class || "check-0";

        return `
            <div class="plan-card" data-index="${index}">
                <div class="plan-card-header">
                    <strong>Plano #${index + 1}</strong>
                    <button class="btn-remove-plan" data-index="${index}" title="Remover">✕</button>
                </div>
                <div class="plan-grid">
                    <div class="plan-field" style="grid-column: span 2;">
                        <label>Lacuna Identificada ${this.renderHelpIcon('Lacuna_identificada')}</label>
                        <textarea data-field="lacuna" data-index="${index}">${plan.lacuna || ''}</textarea>
                    </div>
                    <div class="plan-field">
                        <label>O que fazer? ${this.renderHelpIcon('O_que_fazer_')}</label>
                        <input type="text" data-field="oque" data-index="${index}" value="${plan.oque || ''}">
                    </div>
                    <div class="plan-field">
                        <label>Como? ${this.renderHelpIcon('Como_')}</label>
                        <input type="text" data-field="como" data-index="${index}" value="${plan.como || ''}">
                    </div>
                    <div class="plan-field">
                        <label>Quem? ${this.renderHelpIcon('Quem_')}</label>
                        <input type="text" data-field="quem" data-index="${index}" value="${plan.quem || ''}">
                    </div>
                    <div class="plan-field">
                        <label>Quando Concluir? ${this.renderHelpIcon('Quando_Concluir_')}</label>
                        <input type="date" data-field="quando" data-index="${index}" value="${plan.quando || ''}">
                    </div>
                    <div class="plan-field">
                        <label>CHECK (C) ${this.renderHelpIcon('CHECK_C_')}</label>
                        <select class="check-select ${checkClass}" data-field="check" data-index="${index}">
                            ${this.checkOptions.map(opt => `
                                <option value="${opt.val}" ${currentCheck == opt.val ? 'selected' : ''}>
                                    ${opt.label}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        this.container.querySelector('#btn-add-plan').addEventListener('click', () => {
            this.plans.push({ lacuna: "", oque: "", como: "", quem: "", quando: "", check: 0 });
            this.renderUI();
            this.markAsChanged();
        });

        this.container.querySelector('#btn-save-melhorias').addEventListener('click', () => this.save());

        const inputs = this.container.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const index = e.target.dataset.index;
                const field = e.target.dataset.field;
                const value = field === 'check' ? parseInt(e.target.value) : e.target.value;
                
                this.plans[index][field] = value;

                if (field === 'check') {
                    const opt = this.checkOptions.find(o => o.val == value);
                    e.target.className = `check-select ${opt.class}`;
                }

                this.markAsChanged();
            });
        });

        const removeBtns = this.container.querySelectorAll('.btn-remove-plan');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                this.plans.splice(index, 1);
                this.renderUI();
                this.markAsChanged();
            });
        });
    }

    markAsChanged() {
        this.hasChanges = true;
        const saveBtn = document.getElementById('btn-save-melhorias');
        if (saveBtn) saveBtn.disabled = false;
        const status = document.getElementById('save-status');
        if (status) {
            status.textContent = 'Alterações pendentes...';
            status.className = 'save-status saving';
        }
    }

    async save() {
        if (!this.companyRecord || !this.hasChanges) return;

        const saveBtn = document.getElementById('btn-save-melhorias');
        saveBtn.disabled = true;
        saveBtn.textContent = '⌛ Salvando...';

        const jsonString = JSON.stringify(this.plans);
        const fields = {
            Lacuna_identificada: jsonString
        };

        try {
            if (this.storageRecordId) {
                await grist.docApi.applyUserActions([
                    ['UpdateRecord', 'Plano_de_Melhorias', this.storageRecordId, fields]
                ]);
            } else {
                fields.EmpresaRef = this.companyRecord.id;
                await grist.docApi.applyUserActions([
                    ['AddRecord', 'Plano_de_Melhorias', null, fields]
                ]);
            }

            this.hasChanges = false;
            const status = document.getElementById('save-status');
            if (status) {
                status.textContent = 'Tudo salvo!';
                status.className = 'save-status success';
            }
            saveBtn.textContent = '✅ Salvo!';
            setTimeout(() => {
                saveBtn.textContent = '💾 Salvar Alterações';
                saveBtn.disabled = true;
            }, 2000);
        } catch (err) {
            console.error("Erro ao salvar melhorias:", err);
            const status = document.getElementById('save-status');
            if (status) {
                status.textContent = 'Erro ao salvar!';
                status.className = 'save-status error';
            }
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
