# Mapa de Dados - Sistema PQC

Este documento descreve as tabelas e colunas do Grist que compõem o ecossistema PQC, extraídas das definições do `grist.UserTable`.

## Tabelas Principais

### 1. Empresa (`Empresa`)
Tabela central que armazena os dados cadastrais e o perfil das organizações.
- **Nome_da_Empresa**: Nome oficial (Text)
- **Logotipo**: Imagem/Anexo (Attachments)
- **Usuario**: Vinculado ao login (`Reference: Users`)
- **Avaliador**: Consultor responsável (`Reference: Avaliadores`)
- **Criado_por**: Nome de quem criou o registro (Text)
- **PERFIL_DA_ORGANIZACAO**: Texto descritivo principal (Text)
- **Blocos de Perfil (P1 a P4)**:
    - `P1`, `P2`, `P3`, `P4`: Títulos/Labels dos blocos.
    - `P1_A`, `P1_B`, `P1_C`: Subdivisões do P1.
    - `A_AMBIENTE_COMPETITIVO`: Detalhes competitivos.
    - `B_DESAFIOS_ESTRATEGICOS`: Desafios identificados.
- **Anexos**: `Anexo_P1B`, `Anexo_P1C`, `Anexo_P4`, `Anexo_3`.

### 2. Checklist Diamante (`Checklistdiamante`)
Armazena as avaliações específicas do nível Diamante.
- **ChecklistData**: Conteúdo JSON com respostas e justificativas (Text)
- **EmpresaRef**: Link para a empresa avaliada (`Reference: Empresa`)

### 3. Avaliação da Autoavaliação (`Avaliacao_da_Autoavaliacao`)
Módulo de validação técnica da autoavaliação enviada pela empresa.
- **EmpresaRef**: Link para a empresa (`Reference: Empresa`)
- **c1_O_perfil_foi_preenchido_corretamente_**: (Choice)
- **c2_As_praticas_estao_avaliadas_corretamente...**: (Choice)
- **c3_Os_resultados_foram_lancados_corretamente...**: (Choice)
- **c4_O_Plano_de_Melhorias_foi_feito_corretamente...**: (Choice)
- **c5_As_horas_de_capacitacao_foram_lancadas...**: (Choice)
- **c3_Instrucoes, c4_Instrucoes, c5_Instrucoes**: Feedbacks do avaliador (Text)
- **perguntafinal**: Status de aprovação (Choice: SIM/NÃO)

### 4. Avaliação por Ano (`Avaliacao_Ano`)
Histórico temporal das avaliações.
- **Ano**: Exercício fiscal/ciclo (Numeric)
- **Estagio**: Nível de participação (Choice)
- **C**: Referência para a empresa (`Reference: Empresa`)

### 5. Avaliadores (`Avaliadores`)
Cadastro de consultores.
- **Nome**: Nome completo (Text)
- **Email**: E-mail institucional (Text)

## Tabelas de Suporte e Configuração

### 6. DescAutoAval
Textos de auxílio para preenchimento.
- **Desc**: Descrição da ajuda (Text)
- **Pratica**: Identificador da prática relacionada (Text)

### 7. AvaliadorRest
Restrições de acesso ou filtros para avaliadores.
- **A**: Vínculo com o avaliador (`Reference: Avaliadores`)

### 8. Config
Parâmetros globais do sistema.
- Colunas genéricas: `A`, `B`, `C`.

---
*Nota: Existe uma lógica de ação (`PDCA_Action`) no código que sugere a existência de uma tabela **PDCA**, utilizada para gerar planos de ação baseados nas práticas.*
