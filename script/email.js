const emailForm = document.querySelector('.email-form');
const userDisplay = document.querySelector('.user');

// Tenta pré-preencher o remetente caso o usuário tenha vindo da home
const emailSugerido = localStorage.getItem('texto_inicial') || "";
if (emailSugerido.includes('@')) {
    document.querySelector('#remetente').value = emailSugerido;
}

emailForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Captura os valores originais da tela
    const remetenteOriginal = document.querySelector('#remetente').value;
    const destinatarioOriginal = document.querySelector('#destinatario').value;
    const assunto = document.querySelector('#assunto').value;
    const corpoOriginal = document.querySelector('#corpo').value;
    const protocolo = document.querySelector('#protocolo').value;

    // Criptografia usando a função herdada do global.js
    const remetenteCriptografado = criptografarCesar(remetenteOriginal);
    const destinatarioCriptografado = criptografarCesar(destinatarioOriginal);
    const corpoCriptografado = criptografarCesar(corpoOriginal);

    const agora = new Date();
    const timeStampFormatado = agora.toLocaleTimeString('pt-BR') + ' ' + agora.toLocaleDateString('pt-BR');

    if (userDisplay) userDisplay.textContent = `Usuário: ${remetenteOriginal}`;

    // Monta o objeto com a estrutura exata exigida pelo professor
    const emailData = {
        remetente: remetenteCriptografado,
        destinatario: destinatarioCriptografado,
        assunto: assunto,
        corpo: corpoCriptografado,
        protocolo: protocolo,
        timestamp: timeStampFormatado
    };

    // Salva no LocalStorage
    localStorage.setItem(`smtp_envio_${Date.now()}`, JSON.stringify(emailData));

    // CHAMA A FUNÇÃO GLOBAL: Renderiza na tela como "const email = { ... }" com todas as cores do CSS
    exibirCodigoEmTela('email', emailData);

    // Reseta o formulário para novos envios, mantendo o valor padrão do protocolo estável
    emailForm.reset();
    document.querySelector('#protocolo').value = "SMTP";
});