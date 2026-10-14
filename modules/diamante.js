/**
 * Módulo de Lógica de Negócio: Checklist Diamante (Ciclo 2026/2027)
 * 20 Questões ponderadas (Atende / Não Atende), total 100 pontos.
 */

const questions = [
    // 1. Desempenho Global dos Indicadores
    {
        id: 'q1',
        num: 1,
        bloco: '1. Desempenho Global dos Indicadores',
        text: 'A organização apresenta pelo menos um indicador financeiro com evolução positiva em relação ao período anterior ou desempenho igual ou superior ao referencial comparativo?',
        meta: 'Evolução positiva ou desempenho ≥ referencial comparativo.',
        helperText: 'Resultado do indicador, série histórica e/ou comparativo.',
        peso: 3,
        critico: false
    },
    {
        id: 'q2',
        num: 2,
        bloco: '1. Desempenho Global dos Indicadores',
        text: 'A organização apresenta pelo menos um indicador de Clientes e Mercado com evolução positiva em relação ao período anterior ou desempenho igual ou superior ao referencial comparativo?',
        meta: 'Evolução positiva ou desempenho ≥ referencial comparativo.',
        helperText: 'Resultado do indicador, série histórica e/ou comparativo.',
        peso: 3,
        critico: false
    },
    {
        id: 'q3',
        num: 3,
        bloco: '1. Desempenho Global dos Indicadores',
        text: 'A organização apresenta pelo menos um indicador de Pessoas com evolução positiva em relação ao período anterior ou desempenho igual ou superior ao referencial comparativo?',
        meta: 'Evolução positiva ou desempenho ≥ referencial comparativo.',
        helperText: 'Resultado do indicador, série histórica e/ou comparativo.',
        peso: 3,
        critico: false
    },
    {
        id: 'q4',
        num: 4,
        bloco: '1. Desempenho Global dos Indicadores',
        text: 'A organização apresenta pelo menos um indicador de Processos com evolução positiva em relação ao período anterior ou desempenho igual ou superior ao referencial comparativo?',
        meta: 'Evolução positiva ou desempenho ≥ referencial comparativo.',
        helperText: 'Resultado do indicador, série histórica e/ou comparativo.',
        peso: 3,
        critico: false
    },

    // 2. Resultados Financeiros
    {
        id: 'q5',
        num: 5,
        bloco: '2. Resultados Financeiros',
        text: 'A organização apresenta percentual do resultado líquido gerencial em relação à receita bruta total superior a 20% no período avaliado?',
        meta: 'Resultado líquido gerencial > 20%.',
        helperText: 'REQUISITO CRÍTICO PARA O TROFÉU.\nDRE, demonstrativo gerencial ou documento equivalente.',
        peso: 5,
        critico: true
    },
    {
        id: 'q6',
        num: 6,
        bloco: '2. Resultados Financeiros',
        text: 'A organização apresenta Índice de Sustentabilidade Financeira superior a 2,5, calculado conforme metodologia estabelecida pelo PQC e considerando exclusivamente recursos financeiros de titularidade da pessoa jurídica participante?',
        meta: 'ISF > 2,5 e reserva vinculada ao CNPJ.',
        helperText: 'REQUISITO CRÍTICO PARA O TROFÉU.\nA reserva financeira considerada no cálculo deve estar vinculada ao CNPJ da organização participante. Recursos, investimentos ou patrimônio pessoal dos sócios não são válidos. Limites de crédito não são considerados reserva financeira.',
        peso: 8,
        critico: true
    },
    {
        id: 'q7',
        num: 7,
        bloco: '2. Resultados Financeiros',
        text: 'A organização apresenta percentual de inadimplência inferior a 5% no período avaliado?',
        meta: 'Inadimplência < 5%.',
        helperText: 'Indicador de inadimplência e memória de cálculo.',
        peso: 5,
        critico: false
    },

    // 3. Clientes e Mercado
    {
        id: 'q8',
        num: 8,
        bloco: '3. Clientes e Mercado',
        text: 'A organização apresenta índice de satisfação dos clientes igual ou superior a 90%?',
        meta: 'Satisfação dos clientes ≥ 90%.',
        helperText: 'REQUISITO CRÍTICO PARA O TROFÉU.\nPesquisa de satisfação, metodologia e resultado consolidado.',
        peso: 6,
        critico: true
    },
    {
        id: 'q9',
        num: 9,
        bloco: '3. Clientes e Mercado',
        text: 'A organização apresenta retenção de clientes com evolução positiva ou desempenho igual ou superior ao referencial comparativo?',
        meta: 'Evolução positiva ou desempenho ≥ referencial comparativo.',
        helperText: 'Indicador de retenção de clientes e memória de cálculo.',
        peso: 4,
        critico: false
    },

    // 4. Pessoas
    {
        id: 'q10',
        num: 10,
        bloco: '4. Pessoas',
        text: 'A organização apresenta índice de satisfação das pessoas/equipe igual ou superior a 85%?',
        meta: 'Satisfação das pessoas/equipe ≥ 85%.',
        helperText: 'REQUISITO CRÍTICO PARA O TROFÉU.\nPesquisa de clima/satisfação, metodologia e resultado.',
        peso: 6,
        critico: true
    },
    {
        id: 'q11',
        num: 11,
        bloco: '4. Pessoas',
        text: 'A organização apresenta retenção de pessoas com evolução positiva ou desempenho igual ou superior ao referencial comparativo?',
        meta: 'Evolução positiva ou desempenho ≥ referencial comparativo.',
        helperText: 'Indicador de retenção de pessoas e memória de cálculo.',
        peso: 4,
        critico: false
    },

    // 5. Processos - Cumprimento dos Prazos
    {
        id: 'q12',
        num: 12,
        bloco: '5. Processos - Cumprimento dos Prazos',
        text: 'A organização apresenta índice de cumprimento dos prazos do Departamento Pessoal igual ou superior a 85%, considerando folhas e obrigações entregues no prazo definido pelo PQC?',
        meta: 'DP ≥ 85%.',
        helperText: 'Indicador mensal e consolidado do período, com registros das entregas.',
        peso: 4,
        critico: false
    },
    {
        id: 'q13',
        num: 13,
        bloco: '5. Processos - Cumprimento dos Prazos',
        text: 'A organização apresenta índice de cumprimento dos prazos da Escrita Fiscal igual ou superior a 85%, considerando tributos e obrigações entregues no prazo definido pelo PQC?',
        meta: 'Escrita Fiscal ≥ 85%.',
        helperText: 'Indicador mensal e consolidado do período, com registros das entregas.',
        peso: 4,
        critico: false
    },
    {
        id: 'q14',
        num: 14,
        bloco: '5. Processos - Cumprimento dos Prazos',
        text: 'A organização apresenta índice de cumprimento dos prazos da Contabilidade igual ou superior a 85%, considerando os balancetes concluídos no prazo definido pelo PQC?',
        meta: 'Contabilidade ≥ 85%.',
        helperText: 'Indicador mensal e consolidado do período, com registros dos balancetes.',
        peso: 4,
        critico: false
    },

    // 6. Práticas de Excelência
    {
        id: 'q15',
        num: 15,
        bloco: '6. Práticas de Excelência',
        text: 'A organização possui no mínimo duas Práticas de Excelência consolidadas, aplicadas sistematicamente e com resultados comprovados?',
        meta: 'Mínimo de 2 práticas de excelência consolidadas.',
        helperText: 'REQUISITO CRÍTICO PARA O TROFÉU.\nDescrição das duas práticas, evidências de aplicação e resultados comprovados.',
        peso: 10,
        critico: true
    },

    // 7. Inovação, Melhoria e Protagonismo
    {
        id: 'q16',
        num: 16,
        bloco: '7. Inovação, Melhoria e Protagonismo',
        text: 'A organização implementou, no período avaliado, pelo menos uma inovação com resultado comprovado?',
        meta: 'Mínimo de 1 inovação implementada.',
        helperText: 'Descrição da inovação, evidência de implantação e resultado alcançado.',
        peso: 6,
        critico: false
    },
    {
        id: 'q17',
        num: 17,
        bloco: '7. Inovação, Melhoria e Protagonismo',
        text: 'A organização implementou, no período avaliado, pelo menos uma melhoria relevante em seus processos ou práticas de gestão, com resultado comprovado?',
        meta: 'Mínimo de 1 melhoria relevante.',
        helperText: 'Situação anterior, melhoria implementada e resultado alcançado.',
        peso: 5,
        critico: false
    },
    {
        id: 'q18',
        num: 18,
        bloco: '7. Inovação, Melhoria e Protagonismo',
        text: 'A organização compartilhou formalmente conhecimentos, experiências ou práticas de gestão com outras organizações ou com o setor contábil no período avaliado?',
        meta: 'Pelo menos 1 ação de compartilhamento formal.',
        helperText: 'Palestra, encontro, publicação, benchmarking, evento ou outra evidência equivalente.',
        peso: 5,
        critico: false
    },

    // 8. Mentoria e LGPD
    {
        id: 'q19',
        num: 19,
        bloco: '8. Mentoria e LGPD',
        text: 'A organização participou de pelo menos uma ação de mentoria a outra empresa e possui, no mínimo, uma pessoa indicada para atuar ou continuar atuando em ações de mentoria vinculadas ao PQC?',
        meta: 'Mínimo de 1 mentoria e 1 pessoa indicada.',
        helperText: 'Registro da mentoria realizada e identificação da pessoa indicada/disponível para atuação.',
        peso: 6,
        critico: false
    },
    {
        id: 'q20',
        num: 20,
        bloco: '8. Mentoria e LGPD',
        text: 'A organização demonstra atendimento aos requisitos aplicáveis de proteção de dados e LGPD, com práticas implementadas e evidências de aplicação?',
        meta: 'Atendimento pleno aos requisitos aplicáveis de LGPD.',
        helperText: 'REQUISITO CRÍTICO PARA O TROFÉU.\nPolíticas, procedimentos, registros, termos ou outros documentos aplicáveis.',
        peso: 6,
        critico: true
    }
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
    wrapper.className = 'checklist-wrapper';
    
    const header = document.createElement('div');
    header.className = 'header';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    const h1 = document.createElement('h1');
    h1.id = 'main-title';
    titleDiv.appendChild(h1);

    const sub = document.createElement('p');
    sub.className = 'subtitle';
    sub.textContent = 'Ciclo 2026/2027 • 20 Questões Ponderadas • 100 Pontos Máximos';
    titleDiv.appendChild(sub);
    
    const scoreBadge = document.createElement('div');
    scoreBadge.className = 'score-badge';
    scoreBadge.id = 'total-score';
    scoreBadge.textContent = '0 / 100 pts'; 
    
    header.appendChild(titleDiv);
    header.appendChild(scoreBadge);
    wrapper.appendChild(header);

    const explanation = document.createElement('div');
    explanation.className = 'explanation';
    explanation.textContent = 'Cada questão deve ser respondida como "Atende" (recebe integralmente o peso da questão) ou "Não Atende" (0 pts), mediante evidência objetiva. As questões assinaladas como Requisito Crítico possuem efeito eliminatório para a elegibilidade ao Troféu Diamante.';
    wrapper.appendChild(explanation);

    const form = document.createElement('div');
    form.id = 'checklist-form-container';
    form.className = 'checklist-form';

    let currentBloco = '';

    questions.forEach(q => {
        if (q.bloco !== currentBloco) {
            currentBloco = q.bloco;
            const blocoHeader = document.createElement('div');
            blocoHeader.className = 'bloco-header';
            blocoHeader.textContent = currentBloco;
            form.appendChild(blocoHeader);
        }

        const item = document.createElement('div');
        item.className = 'question-item' + (q.critico ? ' critico-item' : '');

        const labelDiv = document.createElement('div');
        labelDiv.className = 'question-label-container';

        const label = document.createElement('label');
        label.className = 'question-label';
        label.htmlFor = q.id;
        label.innerHTML = `<strong>${q.num}.</strong> ${q.text} ${q.critico ? '<span class="badge-critico">★ REQUISITO CRÍTICO</span>' : ''}`;

        const metaDiv = document.createElement('div');
        metaDiv.className = 'question-meta';
        metaDiv.textContent = `Meta: ${q.meta} • Peso: ${q.peso} pts`;

        labelDiv.appendChild(label);
        labelDiv.appendChild(metaDiv);

        const select = document.createElement('select');
        select.id = q.id;
        select.name = q.id;
        select.className = 'select-avaliacao';

        const optEmpty = document.createElement('option');
        optEmpty.value = '';
        optEmpty.textContent = 'Selecione a avaliação...';
        select.appendChild(optEmpty);

        const optAtende = document.createElement('option');
        optAtende.value = 'Atende';
        optAtende.textContent = `Atende (+${q.peso} pts)`;
        select.appendChild(optAtende);

        const optNaoAtende = document.createElement('option');
        optNaoAtende.value = 'Não Atende';
        optNaoAtende.textContent = 'Não Atende (0 pts)';
        select.appendChild(optNaoAtende);

        const justifContainer = document.createElement('div');
        justifContainer.className = 'justification-container';

        const justifLabel = document.createElement('label');
        justifLabel.className = 'justification-label';
        justifLabel.textContent = 'Evidência / Justificativa da avaliação';
        justifLabel.htmlFor = q.id + '_justification';

        const textarea = document.createElement('textarea');
        textarea.id = q.id + '_justification';
        textarea.className = 'justification-field';
        textarea.placeholder = 'Digite aqui as evidências coletadas...';

        justifContainer.appendChild(justifLabel);
        justifContainer.appendChild(textarea);

        select.addEventListener('change', () => {
            currentValues[q.id] = select.value;
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

        item.appendChild(labelDiv);
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
    if (!tooltipElement || !text) return;
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
    const wrapper = document.querySelector('#app > div');
    const saveBtn = document.getElementById('btn-save');

    if (wrapper) {
        if (!isDiamondEligible) {
            wrapper.classList.add('disabled-app');
            wrapper.style.pointerEvents = 'none';
        } else {
            wrapper.classList.remove('disabled-app');
            wrapper.style.pointerEvents = 'auto';
        }
    }

    if (saveBtn) {
        saveBtn.disabled = !isDiamondEligible;
        saveBtn.style.opacity = isDiamondEligible ? '1' : '0.2';
    }

    questions.forEach(q => {
        const select = document.getElementById(q.id);
        if (select) {
            const savedVal = currentValues[q.id] || '';
            if (select.value !== savedVal) {
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
    let criticFail = false;

    questions.forEach(q => {
        const val = values[q.id];
        if (val === 'Atende') {
            total += q.peso;
        } else if (q.critico && val === 'Não Atende') {
            criticFail = true;
        }
    });

    badgeElement.className = 'score-badge'; 
    if (criticFail) {
        badgeElement.classList.add('danger');
        badgeElement.innerHTML = `⚠️ REQUISITO CRÍTICO NÃO ATENDIDO (${total} / 100 pts)`;
    } else if (total >= 75) {
        badgeElement.classList.add('perfect');
        badgeElement.innerHTML = `💎 DIAMANTE ELEGÍVEL (${total} / 100 pts)`;
    } else if (total >= 50) {
        badgeElement.classList.add('warning');
        badgeElement.textContent = `${total} / 100 pts`;
    } else {
        badgeElement.classList.add('danger');
        badgeElement.textContent = `${total} / 100 pts`;
    }
}
