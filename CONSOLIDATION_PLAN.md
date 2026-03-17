# Plano de Consolidação de Dados (PQC - Grist Free Optimization)

## Objetivo
Reduzir o consumo de linhas no Grist Cloud (limite de 4.000 linhas) consolidando dados multi-linha em campos JSON únicos por empresa.

## Estratégia de Tabelas

### 1. ⏲️ Horas Capacitação (CONCLUÍDO)
- **Tabela**: `Horas_Capacitacao`
- **Antigo**: 12 linhas por empresa (01 a 12).
- **Novo**: 1 linha por empresa.
- **Campos JSON**:
    - `No_de_horas_de_capacitacao_realizadas_no_SESCON_`: `{"01": n, ...}`
    - `No_horas_de_capacitacao_outras_instituicoes_e_ou_empresas`: `{"01": n, ...}`
    - `No_de_Funcionarios`: `{"01": n, ...}`
- **Fórmulas (JS)**: `(SESCON * 1.5) + Outras` e `Total / Funcionarios`.

### 2. 💎 Checklist Diamante / PDCA (PRÓXIMO)
- **Tabela**: `PDCA` ou `Checklistdiamante`
- **Antigo**: ~40 linhas por empresa (uma por prática).
- **Novo**: 1 linha por empresa.
- **Campos JSON**: 
    - `ChecklistData`: `{ "Pratica_ID": { "score": 0-100, "justificativa": "..." } }`
- **Lógica**: Substituir o botão `Criar Registros PDCA` da tabela `Empresa`.

### 3. 📊 Resultados / Indicadores
- **Tabela**: `Resultados`
- **Antigo**: 22 linhas por empresa.
- **Novo**: 1 linha por empresa.
- **Campos JSON**: 
    - `DataJSON`: `{ "Indicador_ID": { "2022": n, "2023": n, "2024": n, "referencial": "..." } }`
- **Lógica**: Substituir o botão `Criar Registros Indicadores`.

### 4. 📝 Resumo de Notas
- **Tabela**: `ResumoNotas`
- **Antigo**: 8 linhas por empresa.
- **Novo**: 1 linha por empresa (ou campo na tabela `Empresa`).

---

## Regras de Implementação
1. **Preservar Referência**: Cada linha consolidada deve manter o campo `RefEmpresa` vinculado à tabela `Empresa`.
2. **Navegação Centralizada**: O Portal PQC (`pqc.html`) deve gerenciar a troca de contexto entre essas tabelas sem recarregar a página.
3. **Salva Manual**: Todas as telas devem ter um botão de "Salvar Alterações" explícito.
4. **Retrocompatibilidade**: O widget deve ser capaz de ler os campos antigos (numéricos) e converter/iniciar o JSON se estiverem vazios.
