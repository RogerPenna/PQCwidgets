# Diretrizes do Projeto PQC - Ecossistema

## ⚠️ RESTRIÇÃO CRÍTICA: Estabilidade de Produção
- **NÃO MODIFICAR**: `index.html`, `style.css`, `main.js` e `modules/diamante.js`. 
- Estes arquivos compõem o widget que está em uso ativo pelos usuários. Qualquer alteração neles pode causar interrupções (crash/bug) em produção.

## 🏗️ Estrutura do Novo Ecossistema (Sandbox)
Para o desenvolvimento do novo portal, utilize exclusivamente a estrutura paralela:
- **Entrada**: `pqc.html`
- **Estilos**: `pqc-style.css`
- **Orquestrador**: `pqc-main.js`
- **Módulos**: `modules/pqc/` (Diretório dedicado)

## 🎨 Design & UX
- O Portal deve utilizar uma **TOP BAR** para navegação (para não conflitar com a sidebar nativa do Grist).
- O layout deve ser limpo e moderno, focado em dashboards e fluxos de preenchimento.

## 📋 Contexto de Dados
- O sistema utiliza as tabelas descritas em `SCHEMA.md`.
- O foco atual é a criação da estrutura de navegação e a tela de Dashboard (Home).

## ✅ Progresso Alcançado
- **Estrutura Base**: Portal v1.0.2 com Top Bar, navegação entre módulos e seletor de empresas funcional.
- **Integração Grist**: Implementação do `GristTableLens` (GTL) como motor de dados principal.
- **Bibliotecas**: Importação de componentes robustos do workspace `custom-grist-widgets` (Field Renderers, Table Lens, Style Utils, etc.) localizados em `/libraries`.
- **Sincronização**: Dropdown de empresas sincronizado bidirecionalmente com os registros do Grist.

