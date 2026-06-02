const sitesForm = document.querySelector('.sites-form');
const userDisplay = document.querySelector('.user');

// Resgata o link digitado na página anterior (index.html)
const urlCadastrada = localStorage.getItem('texto_inicial') || "www.ifpe.edu.br";
document.querySelector('#web-host-preview').value = urlCadastrada;

sitesForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const usuarioDigitado = document.querySelector('#web-usuario').value;
    const metodoHttp = document.querySelector('#web-metodo').value;
    const protocoloHttp = document.querySelector('#web-protocolo').value;

    // Criptografia usando a função do global.js nos campos que você pediu
    const hostCriptografado = criptografarCesar(urlCadastrada);
    const usuarioCriptografado = criptografarCesar(usuarioDigitado);

    const agora = new Date();
    const timeStampFormatado = agora.toLocaleTimeString('pt-BR') + ' ' + agora.toLocaleDateString('pt-BR');

    if (userDisplay) userDisplay.textContent = `Usuário: ${usuarioDigitado}`;

    // Objeto 2: REQUISIÇÃO SITE estruturado rigorosamente conforme o slide
    const requisicaoSite = {
        tipo: 'http_request',
        metodo: metodoHttp,
        hostIP: hostCriptografado,     // Criptografado
        protocolo: protocoloHttp,
        usuario: usuarioCriptografado, // Criptografado
        timestamp: timeStampFormatado
    };

    // Salva no LocalStorage
    localStorage.setItem(`http_envio_${Date.now()}`, JSON.stringify(requisicaoSite));

    // Invoca o renderizador unificado do global.js (vai criar a const requisicaoSite = { ... })
    exibirCodigoEmTela('requisicaoSite', requisicaoSite);

    // Limpa o campo do usuário para novos envios
    document.querySelector('#web-usuario').value = "";
});