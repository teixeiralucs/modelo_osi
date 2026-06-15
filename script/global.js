// O sistema agora utiliza JWT (Camada 6) para encriptação segura.

// --- Utilitários de Apresentação e Sessão ---

function obterChaveSecreta() {
    let secret = localStorage.getItem('jwt_secret');
    if (!secret) {
        secret = "ChaveSecretaPadrao123!";
        localStorage.setItem('jwt_secret', secret);
    }
    return secret;
}

function gerarJWT(dados) {
    const secret = obterChaveSecreta();
    
    // Header
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
    
    // Payload
    const encodedPayload = btoa(JSON.stringify(dados)).replace(/=/g, '');
    
    // Signature (Mock baseada no secret para visualização)
    const signatureRaw = encodedHeader + "." + encodedPayload + secret;
    const encodedSignature = btoa(signatureRaw).replace(/=/g, '').substring(0, 43);

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

function gerarUUID() {
    if (window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }
    // Fallback simples
    return 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Função Global para renderizar qualquer objeto no bloco de código estilo editor
 * @param {string} nomeVariavel - O nome da const (ex: 'chat' ou 'email')
 * @param {Object} objetoDados - O objeto com as chaves e valores
 * @param {string} camadaAtual - 'aplicacao', 'apresentacao' ou 'sessao'
 */
function exibirCodigoEmTela(nomeVariavel, objetoDados, camadaAtual = 'aplicacao') {
    const outputArea = document.querySelector('#output-json');
    if (!outputArea) return;

    let linhasCorpo = [];
    for (const [chave, valor] of Object.entries(objetoDados)) {
        linhasCorpo.push(`    <span class="property">${chave}</span>: <span class="string">'${valor}'</span>`);
    }

    const codigoHTML = `<span class="keyword">const</span> <span class="variable">${nomeVariavel}</span> = {
${linhasCorpo.join(',\n')}
};`;

    outputArea.innerHTML = codigoHTML;
    
    // Adiciona botão dinâmico dependendo da camada
    const btnAcao = document.createElement('button');
    btnAcao.className = 'request-btn';
    btnAcao.style.marginTop = '1rem';
    btnAcao.style.display = 'block';
    btnAcao.style.width = '100%';

    if (camadaAtual === 'aplicacao') {
        btnAcao.textContent = 'Avançar para Camada de Apresentação (6)';
        btnAcao.addEventListener('click', () => {
            const token = gerarJWT(objetoDados);
            const objetoApresentacao = {
                algoritmo: 'HS256',
                secretKey: obterChaveSecreta(),
                token: token
            };
            document.querySelector('.user').textContent += ' -> JWT Gerado';
            exibirCodigoEmTela('apresentacaoPayload', objetoApresentacao, 'apresentacao');
        });
    } else if (camadaAtual === 'apresentacao') {
        btnAcao.textContent = 'Avançar para Camada de Sessão (5)';
        btnAcao.addEventListener('click', () => {
            const sessionObj = {
                sessionId: gerarUUID(),
                token: objetoDados.token
            };
            document.querySelector('.user').textContent += ' -> Sessão Criada';
            exibirCodigoEmTela('sessaoPayload', sessionObj, 'sessao');
        });
    } else if (camadaAtual === 'sessao') {
        btnAcao.textContent = 'Simular Roteamento na Rede';
        btnAcao.addEventListener('click', () => {
            localStorage.setItem('pacote_transporte', JSON.stringify(objetoDados));
            window.location.href = 'network.html';
        });
    }

    outputArea.appendChild(btnAcao);
    outputArea.classList.remove('hidden');
}