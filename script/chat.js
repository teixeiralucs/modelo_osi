// Captura os elementos da página que o evento vai gerenciar
const chatForm = document.querySelector('.chat-form');
const userDisplay = document.querySelector('.user');

// Resgata o texto digitado na página anterior (index.html)
const textoMensagem = localStorage.getItem('texto_inicial') || "Olá Professor!";
document.querySelector('#chat-mensagem-preview').value = textoMensagem;

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const usuarioDigitado = document.querySelector('#chat-usuario').value;
    
    // Criptografia removida: a criptografia acontecerá na Camada de Apresentação (JWT)
    const mensagemCriptografada = textoMensagem; 

    const agora = new Date();
    const timeStampFormatado = agora.toLocaleTimeString('pt-BR') + ' ' + agora.toLocaleDateString('pt-BR');

    if (userDisplay) userDisplay.textContent = `Usuário: ${usuarioDigitado}`;

    const chatData = {
        tipo: 'chat',
        usuario: usuarioDigitado,
        mensagem: mensagemCriptografada, 
        protocolo: 'CHAT',
        timestamp: timeStampFormatado
    };

    // Armazena a persistência do pacote no banco do navegador
    localStorage.setItem(`chat_envio_${Date.now()}`, JSON.stringify(chatData));

    // Invoca o renderizador unificado do global.js para criar o bloco de código colorido
    exibirCodigoEmTela('chat', chatData);

    // Limpa o campo do apelido para novas interações
    document.querySelector('#chat-usuario').value = "";
});