const sitesForm = document.querySelector('.sites-form');
const userDisplay = document.querySelector('.user');

// Resgata o link digitado na página anterior (index.html)
const urlCadastrada = localStorage.getItem('texto_inicial') || "www.ifpe.edu.br";
document.querySelector('#web-host-preview').value = urlCadastrada;

sitesForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usuarioDigitado = document.querySelector('#web-usuario').value;
    const metodoHttp = document.querySelector('#web-metodo').value;
    const protocoloHttp = document.querySelector('#web-protocolo').value;

    let hostResolvido = urlCadastrada;

    // Se não iniciar com www. nem http, tenta resolver o DNS para capturar o IP real (Registro A)
    if (!urlCadastrada.startsWith('www.') && !urlCadastrada.startsWith('http')) {
        try {
            document.querySelector('#web-metodo').value = "Resolvendo DNS...";
            const response = await fetch(`https://dns.google/resolve?name=${urlCadastrada}&type=A`);
            const data = await response.json();
            
            if (data.Answer && data.Answer.length > 0) {
                // Pegar o primeiro registro A encontrado
                const ip = data.Answer.find(a => a.type === 1)?.data;
                if (ip) {
                    hostResolvido = ip;
                    console.log(`DNS Resolvido: ${urlCadastrada} -> ${ip}`);
                }
            }
            document.querySelector('#web-metodo').value = metodoHttp; // Retorna ao normal
        } catch (error) {
            console.error("Falha ao resolver DNS:", error);
            document.querySelector('#web-metodo').value = metodoHttp;
        }
    }

    // Criptografia removida: a criptografia acontecerá na Camada de Apresentação (JWT)
    const hostCriptografado = hostResolvido;
    const usuarioCriptografado = usuarioDigitado;

    const agora = new Date();
    const timeStampFormatado = agora.toLocaleTimeString('pt-BR') + ' ' + agora.toLocaleDateString('pt-BR');

    if (userDisplay) userDisplay.textContent = `Usuário: ${usuarioDigitado}`;

    // Objeto da Camada de Aplicação
    const requisicaoSite = {
        tipo: 'http_request',
        metodo: metodoHttp,
        hostIP: hostCriptografado,
        protocolo: protocoloHttp,
        usuario: usuarioCriptografado,
        timestamp: timeStampFormatado
    };

    // Invoca o renderizador unificado informando a camada atual
    exibirCodigoEmTela('requisicaoSite', requisicaoSite, 'aplicacao');

    // Limpa o campo do usuário para novos envios
    document.querySelector('#web-usuario').value = "";
});