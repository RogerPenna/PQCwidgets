import { renderChecklist } from './modules/diamante.js';

// --- SISTEMA DE DEBUG ---
function logToScreen(msg, type = 'info') {
    // Busca o elemento a cada chamada para garantir que já existe
    const debugConsole = document.getElementById('debug-console');
    const debugContent = document.getElementById('debug-content');

    if (!debugConsole || !debugContent) {
        // Se ainda não existir (ex: carregando), joga no console nativo e aborta
        if (type === 'error') originalConsoleError("[PRE-LOAD ERROR]", msg);
        else originalConsoleLog("[PRE-LOAD INFO]", msg);
        return;
    }

    debugConsole.style.display = 'block';
    const line = document.createElement('div');
    line.style.color = type === 'error' ? '#ff6b6b' : '#0f0';
    line.style.borderBottom = '1px solid #444';
    line.style.padding = '2px 0';
    line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    debugContent.appendChild(line);
    debugConsole.scrollTop = debugConsole.scrollHeight;
}

// Salva referências originais antes de sobrescrever
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Intercepta erros globais
window.onerror = function(message, source, lineno, colno, error) {
    logToScreen(`${message} (${source}:${lineno})`, 'error');
};

// Wrapper para logar eventos do Grist
console.log = function(...args) {
    originalConsoleLog.apply(console, args);
    const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    logToScreen(msg);
};

console.error = function(...args) {
    originalConsoleError.apply(console, args);
    const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    logToScreen(msg, 'error');
};
// --- FIM DEBUG ---

// Aguarda o DOM estar pronto antes de iniciar a lógica pesada
document.addEventListener("DOMContentLoaded", () => {
    logToScreen("DOM Carregado. Iniciando lógica do Grist...");
    
    try {
        grist.ready({
            columns: [
                { name: "ChecklistData", title: "Dados do Checklist (JSON)", type: "Text" }
            ],
            requiredAccess: 'full'
        });
        logToScreen("grist.ready chamado com sucesso.");

        // Novo listener para capturar mensagens brutas e ajudar no debug
        grist.on('message', (msg) => {
            logToScreen("Mensagem Grist: " + msg.tableId ? `Tabela ${msg.tableId}` : "Evento de sistema");
        });
        
    } catch (e) {
        console.error("Erro ao chamar grist.ready:", e);
    }
});

grist.onRecord(function (record, mappings) {
    logToScreen("Recebido evento onRecord. ID: " + (record ? record.id : 'null'));
    
    const container = document.getElementById('app');
    
    // Check if column is mapped
    const dataCol = mappings?.ChecklistData;
    logToScreen("Coluna mapeada: " + (dataCol ? dataCol : 'NÃO MAPEADA'));

    if (!container) {
        console.error("Elemento #app não encontrado!");
        return;
    }
    
    // REMOVIDO: container.innerHTML = ''; -> Deixa o módulo diamante.js decidir se limpa ou atualiza


    if (!dataCol) {
        container.innerHTML = '<div style="text-align:center; padding: 20px; color: #7f8c8d;">Por favor, mapeie a coluna de dados JSON nas configurações do widget.</div>';
        logToScreen("ERRO: Coluna não mapeada.");
        return;
    }

    let currentData = {};
    try {
        if (record[dataCol]) {
            currentData = JSON.parse(record[dataCol]);
            logToScreen("Dados carregados com sucesso.");
        } else {
            logToScreen("Nenhum dado existente encontrado na coluna.");
        }
    } catch (e) {
        console.error("Erro ao fazer parse do JSON:", e);
        currentData = {};
    }

    // Callback to save data back to Grist
    const saveCallback = (newData) => {
        logToScreen("Tentando salvar dados...");
        const jsonString = JSON.stringify(newData);
        grist.selectedTable.update({
            id: record.id,
            fields: {
                [dataCol]: jsonString
            }
        }).then(() => {
            logToScreen("Dados salvos com sucesso!");
        }).catch(err => {
            console.error("Erro ao salvar:", err);
        });
    };

    // Render the Diamond Checklist
    try {
        renderChecklist(container, currentData, saveCallback);
        logToScreen("Renderização concluída.");
    } catch (e) {
        console.error("Erro na renderização:", e);
    }
});
