/**
 * Módulo de Lógica de Negócio: Checklist Diamante
 */

const questions = [
    { 
        id: 'q1', 
        text: '1. Ter no mínimo cinco indicadores que apresentem melhoria e ou desempenho igual ou superior ao referencial comparativo.',
        helperText: 'O importante é que cinco tenham desempenho igual ou superior aos referenciais ou mesmo apresentem evolução. Um ou outro ou os dois.'
    },
    { 
        id: 'q2', 
        text: '2. Demonstrar sustentabilidade financeira; apresentar resultado positivo acima de 20%, reserva financeira de 3 meses da folha, inadimplência abaixo de 5% e análise de rentabilidade.',
        helperText: 'apresentar resultado positivo acima de 20% - 2024\napresentar resultado positivo acima de 20% - 2025\nter reserva financeira proporcional ao risco do negócio (no mínimo três meses do custo da folha de reserva) - 2024\nter reserva financeira proporcional ao risco do negócio (no mínimo três meses do custo da folha de reserva) - 2025\nter o índice de inadimplência abaixo de 5% - 2024\nter o índice de inadimplência abaixo de 5% - 2025\napresentar evidências de análise crítica de rentabilidade dos clientes. - 2024\napresentar evidências de análise crítica de rentabilidade dos clientes - 2025'
    },
    { 
        id: 'q3', 
        text: '3. Demonstrar a satisfação e fidelização dos clientes (Índice acima de 90% e crescimento da carteira).',
        helperText: 'Índice de satisfação dos cientes acima de 90% - 2024\nÍndice de satisfação dos cientes acima de 90% - 2025\ncrescimento da carteira de clientes com evolução ou desempenho igual ou superior ao comparativo) - 2024\ncrescimento da carteira de clientes com evolução ou desempenho igual ou superior ao comparativo) - 2025'
    },
    { 
        id: 'q4', 
        text: '4. Demonstrar satisfação e retenção da equipe (Índice acima de 85%, Plano de Benefícios e baixa rotatividade).',
        helperText: 'Ter índice de satisfação acima de 85%\noferecer um Plano de Benefícios e ações que visam reter a equipe\nDemonstrar evolução no Resultado de Rotatividade ou desempenho igual o superior ao comparativo'
    },
    { 
        id: 'q5', 
        text: '5. Apresentar bom desempenho no cumprimento dos prazos (Contábil, Fiscal e DP com entrega antecipada e índices acima de 85%).',
        helperText: 'cumprimento dos prazos do DP - 2024\ncumprimento dos prazos do DP - 2025\ncumprimento dos prazos do Fiscal - 2024\ncumprimento dos prazos do Fiscal - 2025\ncumprimento dos prazos do Contabil - 2024\ncumprimento dos prazos do Contabil - 2025'
    },
    { 
        id: 'q6', 
        text: '6. Ter evidências dos diretores e cargos de liderança desenvolvendo cursos de gestão no último ano.',
        helperText: 'Média de 5 horas por pessoa considerando a quantidade de líderes'
    },
    { 
        id: 'q7', 
        text: '7. Ter evidências de inovações implementadas na gestão ou processos.',
        helperText: 'O ideal é que sejam no mínimo três melhorias, mesmo que não sejam uma em cada ano.'
    }
];

const options = [
    { label: 'Nenhum', value: 0 },
    { label: 'Alguns', value: 25 },
    { label: 'Muitos', value: 50 },
    { label: 'Quase Todos', value: 75 },
    { label: 'Todos', value: 100 }
];

// Estado Global do Widget
let isRendered = false;
let tooltipElement = null;
let currentValues = {};
let currentSaveCallback = null;

export function renderChecklist(container, data, saveCallback, companyName, isDiamondEligible) {
    currentValues = data || {};
    currentSaveCallback = saveCallback;

    if (isRendered && container.querySelector('.checklist-form')) {
        updateValuesInDOM(isDiamondEligible);
        updateHeader(companyName, isDiamondEligible);
        return;
    }

    container.innerHTML = ''; 
    
    if (!document.getElementById('custom-tooltip')) {
        tooltipElement = document.createElement('div');
        tooltipElement.id = 'custom-tooltip';
        document.body.appendChild(tooltipElement);
    } else {
        tooltipElement = document.getElementById('custom-tooltip');
    }
    
    const wrapper = document.createElement('div');
    
    const header = document.createElement('div');
    header.className = 'header';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    const h1 = document.createElement('h1');
    h1.id = 'main-title';
    titleDiv.appendChild(h1);
    
    const scoreBadge = document.createElement('div');
    scoreBadge.className = 'score-badge';
    scoreBadge.id = 'total-score';
    scoreBadge.textContent = '0 / 700 pts'; 
    
    header.appendChild(titleDiv);
    header.appendChild(scoreBadge);
    wrapper.appendChild(header);

    const explanation = document.createElement('div');
    explanation.className = 'explanation';
    explanation.textContent = 'Além da avaliação normal, o avaliador deverá coletar evidências para responder este checklist que será fundamental para a definição das empresas Cinco Estrelas Diamante. No final das visitas, as candidatas que atenderem os pré-requisitos, passarão para a avaliação final através deste checklist. A avaliação de cada questão deve seguir os critérios de: Todos= 100% dos os itens atendidos; Quase todos = de 75% a 99% dos itens atendidos; Muitos= de 50% a 74% dos itens atendidos; Alguns= de 25% a 49% dos itens atendidos e Nenhum= abaixo de 25% dos itens atendidos.';
    wrapper.appendChild(explanation);

    const form = document.createElement('div');
    form.id = 'checklist-form-container';
    form.className = 'checklist-form';

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

        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = `${opt.label} (${opt.value}%)`; 
            select.appendChild(option);
        });

        const justifContainer = document.createElement('div');
        justifContainer.className = 'justification-container';

        const justifLabel = document.createElement('label');
        justifLabel.className = 'justification-label';
        justifLabel.textContent = 'Justificativa da avaliação (evidências)';
        justifLabel.htmlFor = q.id + '_justification';

        const textarea = document.createElement('textarea');
        textarea.id = q.id + '_justification';
        textarea.className = 'justification-field';
        textarea.placeholder = 'Digite aqui as evidências coletadas...';

        justifContainer.appendChild(justifLabel);
        justifContainer.appendChild(textarea);

        select.addEventListener('change', () => {
            const newVal = parseInt(select.value, 10);
            currentValues[q.id] = newVal;
            updateScore(currentValues);
            if (currentSaveCallback) currentSaveCallback(currentValues);
        });

        textarea.addEventListener('input', () => {
            currentValues[q.id + '_justification'] = textarea.value;
        });

        textarea.addEventListener('blur', () => {
            if (currentSaveCallback) currentSaveCallback(currentValues);
        });

        item.addEventListener('mouseenter', (e) => {
            showTooltip(q.helperText, e);
        });
        item.addEventListener('mousemove', (e) => {
            moveTooltip(e);
        });
        item.addEventListener('mouseleave', () => {
            hideTooltip();
        });

        item.appendChild(label);
        item.appendChild(select);
        item.appendChild(justifContainer);
        form.appendChild(item);
    });

    wrapper.appendChild(form);

    const actions = document.createElement('div');
    actions.id = 'actions-container';
    actions.className = 'form-actions';
    actions.style.marginTop = '30px';
    actions.style.textAlign = 'center';

    const saveBtn = document.createElement('button');
    saveBtn.id = 'btn-save';
    saveBtn.className = 'save-button';
    saveBtn.textContent = '💾 SALVAR ALTERAÇÕES';
    saveBtn.addEventListener('click', () => {
        if (currentSaveCallback) {
            saveBtn.textContent = '⌛ SALVANDO...';
            saveBtn.disabled = true;
            currentSaveCallback(currentValues);
            
            setTimeout(() => {
                saveBtn.textContent = '✅ SALVO!';
                saveBtn.classList.add('success');
                setTimeout(() => {
                    saveBtn.textContent = '💾 SALVAR ALTERAÇÕES';
                    saveBtn.classList.remove('success');
                    saveBtn.disabled = false;
                }, 2000);
            }, 800);
        }
    });
    actions.appendChild(saveBtn);
    wrapper.appendChild(actions);

    container.appendChild(wrapper);

    isRendered = true;
    updateHeader(companyName, isDiamondEligible);
    updateValuesInDOM(isDiamondEligible);
}

function showTooltip(text, event) {
    if (!tooltipElement) return;
    tooltipElement.textContent = text;
    tooltipElement.classList.add('visible');
    moveTooltip(event);
}

function moveTooltip(event) {
    if (!tooltipElement) return;
    const padding = 20;
    let x = event.clientX + padding;
    let y = event.clientY + padding;
    const tooltipRect = tooltipElement.getBoundingClientRect();
    if (x + tooltipRect.width > window.innerWidth) x = event.clientX - tooltipRect.width - padding;
    if (y + tooltipRect.height > window.innerHeight) y = event.clientY - tooltipRect.height - padding;
    tooltipElement.style.left = `${x}px`;
    tooltipElement.style.top = `${y}px`;
}

function hideTooltip() {
    if (!tooltipElement) return;
    tooltipElement.classList.remove('visible');
}

function updateValuesInDOM(isDiamondEligible) {
    const formContainer = document.getElementById('checklist-form-container');
    const saveBtn = document.getElementById('btn-save');

    if (formContainer) {
        if (!isDiamondEligible) {
            formContainer.classList.add('disabled-form');
        } else {
            formContainer.classList.remove('disabled-form');
        }
    }

    if (saveBtn) {
        saveBtn.disabled = !isDiamondEligible;
        saveBtn.style.opacity = isDiamondEligible ? '1' : '0.5';
    }

    questions.forEach(q => {
        const select = document.getElementById(q.id);
        if (select) {
            const savedVal = currentValues[q.id] !== undefined ? currentValues[q.id] : 0;
            if (parseInt(select.value, 10) !== savedVal) {
                select.value = savedVal;
            }
            select.disabled = !isDiamondEligible;
        }

        const textarea = document.getElementById(q.id + '_justification');
        if (textarea) {
            const savedText = currentValues[q.id + '_justification'] || '';
            if (textarea.value !== savedText) {
                textarea.value = savedText;
            }
            textarea.disabled = !isDiamondEligible;
        }
    });
    updateScore(currentValues);
}

function updateHeader(companyName, isDiamondEligible) {
    const h1 = document.getElementById('main-title');
    if (h1) {
        const displayName = isDiamondEligible ? (companyName || "Empresa não selecionada") : "Não Participa";
        h1.textContent = `💎 CHECKLIST DIAMANTE - ${displayName}`;
    }
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

    badgeElement.textContent = `${total} / 700 pts`;
    badgeElement.className = 'score-badge'; 
    
    if (total === 700) {
        badgeElement.classList.add('perfect');
        badgeElement.innerHTML = '💎 DIAMANTE (700 pts)';
    } else if (total >= 350) {
        badgeElement.classList.add('warning');
    } else {
        badgeElement.classList.add('danger');
    }
}
