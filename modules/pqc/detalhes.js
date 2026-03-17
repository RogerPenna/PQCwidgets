// modules/pqc/detalhes.js

export class Detalhes {
    constructor(container, gtl) {
        this.container = container;
        this.gtl = gtl;
        this.companyRecord = null;
        this.schema = null;
        this.tableMeta = null;
        this.hasChanges = false;
        this.formData = {};
    }

    async render(record, mappings) {
        this.companyRecord = record;
        
        if (!this.schema) {
            const [s, m] = await Promise.all([
                this.gtl.getTableSchema('Empresa'),
                this.gtl.getTableMetadata('Empresa')
            ]);
            this.schema = s;
            this.tableMeta = m;
        }

        this.formData = {
            P1_A: record?.P1_A || "",
            P1_B: record?.P1_B || "",
            P1_C: record?.P1_C || "",
            A_AMBIENTE_COMPETITIVO: record?.A_AMBIENTE_COMPETITIVO || "",
            B_DESAFIOS_ESTRATEGICOS: record?.B_DESAFIOS_ESTRATEGICOS || "",
            P3: record?.P3 || "",
            P4: record?.P4 || ""
        };

        this.renderUI();
    }

    renderHelpIcon(colId) {
        const colMeta = this.schema?.[colId];
        if (colMeta?.description) {
            return `<span class="help-icon" data-tooltip="${colMeta.description}">?</span>`;
        }
        return "";
    }

    renderPageHeader() {
        if (!this.tableMeta) return "";
        const desc = this.tableMeta.description;
        return `
            <div class="page-header">
                <div class="page-title-row">
                    <h1 class="page-title">🏠 1 - Perfil da Empresa</h1>
                    ${desc ? `<button class="description-toggle" id="desc-toggle">Saiba mais...</button>` : ""}
                </div>
                ${desc ? `<div class="page-description" id="page-desc">${desc}</div>` : ""}
            </div>
        `;
    }

    renderUI() {
        this.container.innerHTML = `
            <div class="detalhes-container">
                ${this.renderPageHeader()}
                
                <!-- SEÇÃO 1 -->
                <div class="section-block">
                    <div class="section-title-bar">
                        DESCRIÇÃO DA ORGANIZAÇÃO
                        ${this.renderHelpIcon('P1')}
                    </div>
                    
                    <div class="field-group">
                        <div class="field-header">
                            <label class="field-label">A - INSTITUIÇÃO, PROPÓSITOS E PORTE DA ORGANIZAÇÃO</label>
                            ${this.renderHelpIcon('P1_A')}
                        </div>
                        <textarea class="field-textarea" data-field="P1_A">${this.formData.P1_A}</textarea>
                    </div>

                    <div class="field-group">
                        <div class="field-header">
                            <label class="field-label">B - PRODUTOS E PROCESSOS DA CADEIA DE VALOR</label>
                            <div>
                                <span class="attachment-info">Anexo 1B</span>
                                ${this.renderHelpIcon('P1_B')}
                            </div>
                        </div>
                        <textarea class="field-textarea" data-field="P1_B">${this.formData.P1_B}</textarea>
                    </div>

                    <div class="field-group">
                        <div class="field-header">
                            <label class="field-label">C - QUADRO RESUMO DE PARTES INTERESSADAS E REDES DE ATUAÇÃO</label>
                            <div>
                                <span class="attachment-info">Anexo 1C</span>
                                ${this.renderHelpIcon('P1_C')}
                            </div>
                        </div>
                        <textarea class="field-textarea" data-field="P1_C">${this.formData.P1_C}</textarea>
                    </div>
                </div>

                <!-- SEÇÃO 2 -->
                <div class="section-block">
                    <div class="section-title-bar">
                        CONCORRÊNCIA E AMBIENTE COMPETITIVO
                        ${this.renderHelpIcon('P2')}
                    </div>

                    <div class="field-group">
                        <div class="field-header">
                            <label class="field-label">A - AMBIENTE COMPETITIVO</label>
                            ${this.renderHelpIcon('A_AMBIENTE_COMPETITIVO')}
                        </div>
                        <textarea class="field-textarea" data-field="A_AMBIENTE_COMPETITIVO">${this.formData.A_AMBIENTE_COMPETITIVO}</textarea>
                    </div>

                    <div class="field-group">
                        <div class="field-header">
                            <label class="field-label">B - DESAFIOS ESTRATÉGICOS</label>
                            ${this.renderHelpIcon('B_DESAFIOS_ESTRATEGICOS')}
                        </div>
                        <textarea class="field-textarea" data-field="B_DESAFIOS_ESTRATEGICOS">${this.formData.B_DESAFIOS_ESTRATEGICOS}</textarea>
                    </div>
                </div>

                <!-- SEÇÃO 3 -->
                <div class="section-block">
                    <div class="section-title-bar">
                        HISTÓRICO DA BUSCA DA EXCELÊNCIA
                        ${this.renderHelpIcon('P3')}
                    </div>
                    <div class="field-group">
                        <div class="field-header">
                            <span class="attachment-info">Anexo 3</span>
                        </div>
                        <textarea class="field-textarea" data-field="P3">${this.formData.P3}</textarea>
                    </div>
                </div>

                <!-- SEÇÃO 4 -->
                <div class="section-block">
                    <div class="section-title-bar">
                        ESTRUTURA ORGANIZACIONAL
                        ${this.renderHelpIcon('P4')}
                    </div>
                    <div class="field-group">
                        <div class="field-header">
                            <span class="attachment-info">Anexo 4</span>
                        </div>
                        <textarea class="field-textarea" data-field="P4">${this.formData.P4}</textarea>
                    </div>
                </div>

                <div class="detalhes-footer">
                    <span id="save-status" class="save-status">Sem alterações</span>
                    <button id="btn-save-detalhes" class="save-btn" disabled>💾 Salvar Detalhes</button>
                </div>
            </div>
        `;

        this.addEventListeners();
    }

    addEventListeners() {
        // Toggle da descrição da página
        const descToggle = this.container.querySelector('#desc-toggle');
        const pageDesc = this.container.querySelector('#page-desc');
        if (descToggle && pageDesc) {
            descToggle.addEventListener('click', () => {
                pageDesc.classList.toggle('visible');
                descToggle.textContent = pageDesc.classList.contains('visible') ? 'Fechar ajuda' : 'Saiba mais...';
            });
        }

        const textareas = this.container.querySelectorAll('.field-textarea');
        textareas.forEach(ta => {
            ta.addEventListener('input', (e) => {
                const field = e.target.dataset.field;
                this.formData[field] = e.target.value;
                this.markAsChanged();
            });
        });

        const saveBtn = this.container.querySelector('#btn-save-detalhes');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.save());
        }
    }

    markAsChanged() {
        this.hasChanges = true;
        const saveBtn = document.getElementById('btn-save-detalhes');
        if (saveBtn) saveBtn.disabled = false;
        const status = document.getElementById('save-status');
        if (status) {
            status.textContent = 'Alterações pendentes...';
            status.className = 'save-status saving';
        }
    }

    async save() {
        if (!this.companyRecord || !this.hasChanges) return;

        const saveBtn = document.getElementById('btn-save-detalhes');
        saveBtn.disabled = true;
        saveBtn.textContent = '⌛ Salvando...';

        try {
            await grist.selectedTable.update({
                id: this.companyRecord.id,
                fields: this.formData
            });

            this.hasChanges = false;
            const status = document.getElementById('save-status');
            if (status) {
                status.textContent = 'Tudo salvo!';
                status.className = 'save-status success';
            }
            saveBtn.textContent = '✅ Salvo!';
            setTimeout(() => {
                saveBtn.textContent = '💾 Salvar Detalhes';
                saveBtn.disabled = true;
            }, 2000);
        } catch (err) {
            console.error("Erro ao salvar detalhes da empresa:", err);
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
            this.formData = {
                P1_A: record.P1_A || "",
                P1_B: record.P1_B || "",
                P1_C: record.P1_C || "",
                A_AMBIENTE_COMPETITIVO: record.A_AMBIENTE_COMPETITIVO || "",
                B_DESAFIOS_ESTRATEGICOS: record.B_DESAFIOS_ESTRATEGICOS || "",
                P3: record.P3 || "",
                P4: record.P4 || ""
            };
            this.renderUI();
        }
    }
}
