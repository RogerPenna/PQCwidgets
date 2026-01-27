/**
 * Módulo de Lógica de Negócio: Checklist Diamante
 */

const questions = [
    { id: 'q1', text: '1. Ter no mínimo cinco indicadores que apresentem melhoria e ou desempenho igual ou superior ao referencial comparativo.' },
    { id: 'q2', text: '2. Demonstrar sustentabilidade financeira; apresentar resultado positivo acima de 20%, reserva financeira de 3 meses da folha, inadimplência abaixo de 5% e análise de rentabilidade.' },
    { id: 'q3', text: '3. Demonstrar a satisfação e fidelização dos clientes (Índice acima de 90% e crescimento da carteira).' },
    { id: 'q4', text: '4. Demonstrar satisfação e retenção da equipe (Índice acima de 85%, Plano de Benefícios e baixa rotatividade).' },
    { id: 'q5', text: '5. Apresentar bom desempenho no cumprimento dos prazos (Contábil, Fiscal e DP com entrega antecipada e índices acima de 85%).' },
    { id: 'q6', text: '6. Ter evidências dos diretores e cargos de liderança desenvolvendo cursos de gestão no último ano.' },
    { id: 'q7', text: '7. Ter evidências de inovações implementadas na gestão ou processos.' }
];

const options = [
    { label: 'Nenhum', value: 0 },
    { label: 'Alguns', value: 25 },
    { label: 'Muitos', value: 50 },
    { label: 'Quase Todos', value: 75 },
    { label: 'Todos', value: 100 }
];

// Flag para saber se já renderizamos a estrutura inicial
let isRendered = false;

export function renderChecklist(container, data, saveCallback) {
    const values = data || {};

    // Se já renderizamos no container, apenas atualizamos os valores (para evitar reset de scroll/foco)
    if (isRendered && container.querySelector('.checklist-form')) {
        updateValues(values, saveCallback);
        return;
    }

    // --- RENDERIZAÇÃO INICIAL ---
    container.innerHTML = ''; // Limpa qualquer lixo anterior
    
    // Create Layout
    const wrapper = document.createElement('div');
    
    // Header with Title and Score
    const header = document.createElement('div');
    header.className = 'header';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    const h1 = document.createElement('h1');
    h1.textContent = 'Checklist Diamante';
    titleDiv.appendChild(h1);
    
    const scoreBadge = document.createElement('div');
    scoreBadge.className = 'score-badge';
    scoreBadge.id = 'total-score';
    scoreBadge.textContent = '0 / 700'; 
    
    header.appendChild(titleDiv);
    header.appendChild(scoreBadge);
    wrapper.appendChild(header);

    // Form Container
    const form = document.createElement('div');
    form.className = 'checklist-form';

    // Render Questions
    questions.forEach(q => {
        const item = document.createElement('div');
        item.className = 'question-item';

        const label = document.createElement('label');
        label.className = 'question-label';
        label.textContent = q.text;
        label.htmlFor = q.id;

        const select = document.createElement('select');
        select.id = q.id;
        select.name = q.id;

        // Populate options
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = `${opt.label} (${opt.value}%)`; 
            select.appendChild(option);
        });

        // Event Listener for changes
        select.addEventListener('change', () => {
            const newVal = parseInt(select.value, 10);
            values[q.id] = newVal;
            
            // Atualiza visualmente imediatamente
            updateScore(values);
            
            // Salva no Grist
            saveCallback(values);
        });

        item.appendChild(label);
        item.appendChild(select);
        form.appendChild(item);
    });

    wrapper.appendChild(form);
    container.appendChild(wrapper);

    isRendered = true; // Marca como renderizado
    
    // Aplica os valores iniciais
    updateValues(values);
}

// Função auxiliar para atualizar inputs sem redesenhar DOM
function updateValues(values) {
    questions.forEach(q => {
        const select = document.getElementById(q.id);
        if (select) {
            // Só muda o valor se for diferente (protege foco)
            const savedVal = values[q.id] !== undefined ? values[q.id] : 0;
            if (parseInt(select.value, 10) !== savedVal) {
                select.value = savedVal;
            }
        }
    });
    updateScore(values);
}

function updateScore(values) {
    const badgeElement = document.getElementById('total-score');
    if (!badgeElement) return;

    let total = 0;
    questions.forEach(q => {
        const val = values[q.id];
        if (typeof val === 'number') {
            total += val;
        }
    });

    // Texto padrão
    badgeElement.textContent = `${total} / 700 pts`;

    // Classes e Texto Especial
    badgeElement.className = 'score-badge'; 
    if (total === 700) {
        badgeElement.classList.add('perfect');
        badgeElement.innerHTML = '💎 DIAMANTE (700 pts)'; // Adiciona ícone e texto
    } else if (total >= 350) {
        badgeElement.classList.add('warning');
    } else {
        badgeElement.classList.add('danger');
    }
}