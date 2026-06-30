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

function gerarMacFicticio() {
    return "XX:XX:XX:XX:XX:XX".replace(/X/g, function() {
        return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16));
    });
}

function calcularHashSimulado(texto) {
    let hash = 0;
    for (let i = 0; i < texto.length; i++) {
        const char = texto.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; 
    }
    let hex = Math.abs(hash).toString(16);
    while (hex.length < 32) {
        hex += hex;
    }
    return hex.substring(0, 32);
}

function stringToBinary(texto) {
    return texto.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
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
        btnAcao.textContent = 'Avançar para Camada de Transporte (4)';
        btnAcao.addEventListener('click', () => {
            const transportObj = {
                portaOrigem: Math.floor(Math.random() * 16384) + 49152,
                portaDestino: 443,
                protocolo: 'TCP',
                payload: objetoDados.token
            };
            document.querySelector('.user').textContent += ' -> Transporte';
            exibirCodigoEmTela('segmentoTransporte', transportObj, 'transporte');
        });
    } else if (camadaAtual === 'transporte') {
        btnAcao.textContent = 'Avançar para Camada de Rede (3)';
        btnAcao.addEventListener('click', () => {
            const redeObj = {
                ipOrigem: '192.168.0.15',
                ipDestino: '8.8.8.8',
                protocolo: 'IPv4',
                payload: JSON.stringify(objetoDados)
            };
            document.querySelector('.user').textContent += ' -> Rede';
            exibirCodigoEmTela('pacoteRede', redeObj, 'rede');
        });
    } else if (camadaAtual === 'rede') {
        btnAcao.textContent = 'Avançar para Camada de Enlace (2)';
        btnAcao.addEventListener('click', () => {
            const payloadStr = JSON.stringify(objetoDados);
            const crcHash = calcularHashSimulado(payloadStr);
            const enlaceObj = {
                frameId: "F" + Math.floor(Math.random()*1000).toString().padStart(3, '0'),
                macOrigem: "00:11:22:33:44:55",
                macDestino: gerarMacFicticio(),
                tipo: "IPv4",
                crc: crcHash,
                payload: payloadStr
            };
            document.querySelector('.user').textContent += ' -> Enlace';
            exibirCodigoEmTela('frameEnlace', enlaceObj, 'enlace');
        });
    } else if (camadaAtual === 'enlace') {
        btnAcao.textContent = 'Avançar para Camada Física (1)';
        btnAcao.addEventListener('click', () => {
            const hashCalculado = calcularHashSimulado(objetoDados.payload);
            const crcValidado = (hashCalculado === objetoDados.crc);
            
            const fisicaObj = {
                frameId: objetoDados.frameId,
                hashCalculado: hashCalculado,
                crcStatus: crcValidado ? "Igual. Nenhum frame perdido." : "Diferente. Erro de dados.",
                status: "Pronto para transmissão em binário"
            };
            
            const jsonCompletoStr = JSON.stringify(objetoDados);
            const binario = stringToBinary(jsonCompletoStr);
            
            document.querySelector('.user').textContent += ' -> Física';
            exibirCodigoFisica('dadosFisica', fisicaObj, binario);
        });
    }

    outputArea.appendChild(btnAcao);
    outputArea.classList.remove('hidden');
}

function exibirCodigoFisica(nomeVariavel, objetoDados, binarioStr) {
    const outputArea = document.querySelector('#output-json');
    if (!outputArea) return;

    let linhasCorpo = [];
    for (const [chave, valor] of Object.entries(objetoDados)) {
        linhasCorpo.push(`    <span class="property">${chave}</span>: <span class="string">'${valor}'</span>`);
    }

    const codigoHTML = `<span class="keyword">const</span> <span class="variable">${nomeVariavel}</span> = {
${linhasCorpo.join(',\n')}
};

<span class="keyword">// Transmissão de Bits (Camada Física)</span>
<div class="string" style="word-break: break-all; white-space: normal; margin-top: 10px; font-size: 0.85em; color: #a5d6ff;">
${binarioStr}
</div>`;

    outputArea.innerHTML = codigoHTML;
    
    const btnAcao = document.createElement('button');
    btnAcao.className = 'request-btn';
    btnAcao.style.marginTop = '1rem';
    btnAcao.style.display = 'block';
    btnAcao.style.width = '100%';
    
    btnAcao.textContent = 'Transmitir pelo Meio Físico';
    btnAcao.addEventListener('click', () => {
        localStorage.setItem('pacote_transporte', JSON.stringify(objetoDados));
        window.location.href = 'network.html';
    });

    outputArea.appendChild(btnAcao);
    outputArea.classList.remove('hidden');
}