// modules/pqc/capacitacao.js

export class Capacitacao {
    constructor(container, gtl) {
        this.container = container;
        this.gtl = gtl;
        this.companyRecord = null;
        this.storageRecordId = null;
        this.isLegacyData = false;
        this.schema = null;
        this.tableMeta = null;
        
        this.months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        
        this.columns = [
            { id: 'No_de_horas_de_capacitacao_realizadas_no_SESCON_', label: 'Nº de horas de capacitação realizadas no SESCON' },
            { id: 'No_horas_de_capacitacao_outras_instituicoes_e_ou_empresas', label: 'Nº horas de capacitação outras instituições e ou empresas' },
            { id: 'total_horas', label: 'Total de horas de capacitação mês', readOnly: true },
            { id: 'No_de_Funcionarios', label: 'Nº de Funcionários' },
            { id: 'media_funcionario', label: 'Média de horas de capacitação / funcionário', readOnly: true }
        ];
        
        this.data = {};
        this.hasChanges = false;
    }

    async render(record, mappings) {
        this.companyRecord = record;
        
        // Carrega o schema e metadados se ainda não tiver
        if (!this.schema) {
            const [s, m] = await Promise.all([
                this.gtl.getTableSchema('Horas_Capacitacao'),
                this.gtl.getTableMetadata('Horas_Capacitacao')
            ]);
            this.schema = s;
            this.tableMeta = m;
        }

        await this.loadDataFromRelatedTable();

        const migrationNotice = this.isLegacyData ? 
            `<div class="migration-alert">⚠️ Dados legados detectados. Clique em salvar para consolidar.</div>` : "";

        this.container.innerHTML = `
            <div class="capacitacao-container">
                ${this.renderPageHeader()}
                
                <div class="capacitacao-header">
                    <div class="header-actions">
                        ${migrationNotice}
                        <span id="save-status" class="save-status">Sem alterações</span>
                        <button id="btn-save-capacitacao" class="save-btn" disabled>💾 Salvar Alterações</button>
                    </div>
                </div>
                <table class="capacitacao-table">
                    <thead>
                        <tr>
                            <th>Mês</th>
                            ${this.columns.map(col => `
                                <th>
                                    ${col.label}
                                    ${this.renderHelpIcon(col.id)}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody id="capacitacao-body">
                        ${this.renderRows()}
                    </tbody>
                    <tfoot>
                        <tr class="table-total-row">
                            <td colspan="5" style="text-align: right; font-weight: bold; padding: 15px;">TOTAL ANUAL ACUMULADO (Soma das Médias Mensais):</td>
                            <td id="grand-total-display" style="font-weight: bold; color: #27ae60; font-size: 1.2rem; background: #f0fff4; text-align: right; padding-right: 15px;">0.00</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;

        this.updateGrandTotal();
        this.addEventListeners();
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
                    <h1 class="page-title">⏲️ 6 - Horas de Capacitação</h1>
                    ${desc ? `<button class="description-toggle" id="desc-toggle">Saiba mais...</button>` : ""}
                </div>
                ${desc ? `<div class="page-description" id="page-desc">${desc}</div>` : ""}
            </div>
        `;
    }

    async loadDataFromRelatedTable() {
        this.data = {};
        this.storageRecordId = null;
        this.hasChanges = false;
        this.isLegacyData = false;

        if (!this.companyRecord) return;

        try {
            const allRelated = await this.gtl.fetchTableRecordsOrThrow('Horas_Capacitacao');
            const companyRows = allRelated.filter(r => r.RefEmpresa == this.companyRecord.id);

            const consolidatedRow = companyRows.find(r => {
                const val = String(r['No_de_horas_de_capacitacao_realizadas_no_SESCON_'] || "");
                return val.startsWith('{');
            });

            if (consolidatedRow) {
                this.storageRecordId = consolidatedRow.id;
                this.columns.forEach(col => {
                    if (col.readOnly) return;
                    try {
                        this.data[col.id] = JSON.parse(consolidatedRow[col.id] || '{}');
                    } catch (e) { this.data[col.id] = {}; }
                });
            } 
            else if (companyRows.length > 0) {
                this.isLegacyData = true;
                this.hasChanges = true;
                this.columns.forEach(col => { if (!col.readOnly) this.data[col.id] = {}; });
                companyRows.forEach(row => {
                    const mes = row.Mes;
                    if (this.months.includes(mes)) {
                        this.columns.forEach(col => {
                            if (!col.readOnly) {
                                this.data[col.id][mes] = row[col.id] || 0;
                            }
                        });
                    }
                });
            } else {
                this.columns.forEach(col => { if (!col.readOnly) this.data[col.id] = {}; });
            }
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
        }
    }

    renderRows() {
        return this.months.map(month => {
            const rowData = this.calculateRowTotals(month);
            return `
                <tr data-month="${month}">
                    <td>${month}</td>
                    ${this.columns.map(col => {
                        const val = this.data[col.id]?.[month] || 0;
                        if (col.readOnly) {
                            return `<td class="read-only" data-col="${col.id}">${rowData[col.id]}</td>`;
                        } else {
                            return `<td><input type="number" step="0.1" value="${val}" data-col="${col.id}" data-month="${month}"></td>`;
                        }
                    }).join('')}
                </tr>
            `;
        }).join('');
    }

    calculateRowTotals(month) {
        const hSescon = parseFloat(this.data['No_de_horas_de_capacitacao_realizadas_no_SESCON_']?.[month] || 0);
        const hOutras = parseFloat(this.data['No_horas_de_capacitacao_outras_instituicoes_e_ou_empresas']?.[month] || 0);
        const total = (hSescon * 1.5) + hOutras;
        const numFunc = parseFloat(this.data['No_de_Funcionarios']?.[month] || 0);
        const media = numFunc > 0 ? (total / numFunc) : 0;
        return { total_horas: total.toFixed(1), media_funcionario: media.toFixed(2), raw_media: media };
    }

    updateGrandTotal() {
        let grandTotal = 0;
        this.months.forEach(m => {
            const row = this.calculateRowTotals(m);
            grandTotal += row.raw_media;
        });
        const display = document.getElementById('grand-total-display');
        if (display) display.textContent = grandTotal.toFixed(2);
        return grandTotal;
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

        const inputs = this.container.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const colId = e.target.dataset.col;
                const month = e.target.dataset.month;
                this.data[colId][month] = parseFloat(e.target.value) || 0;
                this.updateRowCalculations(month);
                this.updateGrandTotal();
                this.markAsChanged();
            });
        });
        const saveBtn = this.container.querySelector('#btn-save-capacitacao');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.save());
            if (this.hasChanges) saveBtn.disabled = false;
        }
    }

    updateRowCalculations(month) {
        const row = this.container.querySelector(`tr[data-month="${month}"]`);
        const totals = this.calculateRowTotals(month);
        const totalCell = row.querySelector(`td[data-col="total_horas"]`);
        const mediaCell = row.querySelector(`td[data-col="media_funcionario"]`);
        if (totalCell) totalCell.textContent = totals.total_horas;
        if (mediaCell) mediaCell.textContent = totals.media_funcionario;
    }

    markAsChanged() {
        this.hasChanges = true;
        const saveBtn = this.container.querySelector('#btn-save-capacitacao');
        if (saveBtn) saveBtn.disabled = false;
        this.setSaveStatus('Alterações pendentes...', 'saving');
    }

    async save() {
        if (!this.companyRecord || !this.hasChanges) return;
        const saveBtn = this.container.querySelector('#btn-save-capacitacao');
        if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '⌛ Salvando...'; }

        const grandTotal = this.updateGrandTotal();
        const fields = {
            Total_Anual_Capacitacao: grandTotal
        };
        
        this.columns.forEach(col => { 
            if (!col.readOnly) fields[col.id] = JSON.stringify(this.data[col.id]); 
        });

        try {
            if (this.storageRecordId) {
                await grist.docApi.applyUserActions([['UpdateRecord', 'Horas_Capacitacao', this.storageRecordId, fields]]);
            } else {
                fields.RefEmpresa = this.companyRecord.id;
                fields.Mes = "Geral"; 
                const result = await grist.docApi.applyUserActions([['AddRecord', 'Horas_Capacitacao', null, fields]]);
                if (result && result.retValues && result.retValues[0]) this.storageRecordId = result.retValues[0];
            }
            this.hasChanges = false;
            this.isLegacyData = false;
            this.setSaveStatus('Tudo salvo!', 'success');
            if (saveBtn) {
                saveBtn.textContent = '✅ Salvo!';
                setTimeout(() => { saveBtn.textContent = '💾 Salvar Alterações'; saveBtn.disabled = true; }, 2000);
            }
        } catch (err) {
            console.error("Erro ao salvar:", err);
            this.setSaveStatus('Erro ao salvar!', 'error');
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = '❌ Tentar Novamente';
            }
        }
    }

    setSaveStatus(text, type) {
        const statusEl = document.getElementById('save-status');
        if (statusEl) { statusEl.textContent = text; statusEl.className = `save-status ${type}`; }
    }

    async update(record, mappings) {
        if (record && (!this.companyRecord || record.id !== this.companyRecord.id)) {
            this.companyRecord = record;
            await this.loadDataFromRelatedTable();
            this.render(this.companyRecord, mappings);
        }
    }
}
