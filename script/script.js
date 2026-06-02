// Identificação do Usuário (Lucas Teixeira)
const inputName = prompt("Digite o nome do usuário");
const USER_NAME = inputName ? inputName : 'Visitante';
const userDisplay = document.querySelector('.user');
if (userDisplay) userDisplay.textContent = `Usuário: ${USER_NAME}`;

const reqInput = document.querySelector('.text-input');
const btnEnviar = document.querySelector('.request-btn');
const responseH1 = document.querySelector('.protocol-response');
const emailForm = document.querySelector('.email-form')

// Muda a cor do botão ao digitar
reqInput.addEventListener('input', () => {
    if (reqInput.value.length > 0) {
        btnEnviar.classList.add('active');
    } else {
        btnEnviar.classList.remove('active');
    }
});

// Lógica de Requisição e Identificação de Protocolo
btnEnviar.addEventListener('click', (event) => {
    event.preventDefault();
    
    const rawValue = reqInput.value.trim();
    const value = rawValue.toLowerCase();

    if (value === "") return;

    let protocolo = "";

    // Lógica de diferenciação (Camada de Aplicação do Modelo OSI)
    if (value.includes('@')) {
        protocolo = "SMTP/POP (E-mail)";
        emailForm.classList.remove('hidden'); // Mostra o form
    } else {
        emailForm.classList.add('hidden'); // Esconde o form se for outro
        
        if (value.startsWith('ws://') || value.startsWith('wss://')) {
            protocolo = "WEBSOCKET";
        } else if (value.startsWith('http') || value.includes('.com') || value.includes('.br')) {
            protocolo = "HTTP/HTTPS";
        } else {
            protocolo = "Protocolo não identificado";
        }
    }
    // Exibe no H1 que já está no HTML
    responseH1.textContent = protocolo;

    // Limpa o input e reseta o botão
    reqInput.value = "";
    btnEnviar.classList.remove('active');
});

// Chave de deslocamento da Cifra de César (pode alterar o número se quiser)
const CHAVE_CRIPTOGRAFIA = 3;

// Lógica de Envio do Formulário SMTP (Atualizada com JSON, Cifra de César e LocalStorage)
emailForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // 1. Captura os valores originais do formulário
    const remetenteOriginal = document.querySelector('#remetente').value;
    const destinatarioOriginal = document.querySelector('#destinatario').value;
    const assunto = document.querySelector('#assunto').value;
    const corpoOriginal = document.querySelector('#corpo').value;
    const protocolo = document.querySelector('#protocolo').value;

    // 2. Criptografa as informações sensíveis usando a Cifra de César
    const remetenteCriptografado = criptografarCesar(remetenteOriginal, CHAVE_CRIPTOGRAFIA);
    const destinatarioCriptografado = criptografarCesar(destinatarioOriginal, CHAVE_CRIPTOGRAFIA);
    const corpoCriptografado = criptografarCesar(corpoOriginal, CHAVE_CRIPTOGRAFIA);

    // 3. Monta o objeto com os dados (Campos sensíveis criptografados)
    const dadosEmail = {
        remetente: remetenteCriptografado,
        destinatario: destinatarioCriptografado,
        assunto: assunto, // Mantido aberto para identificação rápida
        corpo: corpoCriptografado,
        protocolo: protocolo
    };

    // 4. Converte o objeto para uma string JSON
    const dadosJSON = JSON.stringify(dadosEmail);

    // 5. Armazena no LocalStorage do navegador
    // Usaremos uma chave única baseada no email do destinatário para não sobrescrever envios diferentes
    localStorage.setItem(`smtp_envio_${Date.now()}`, dadosJSON);

    // Alerta mostrando como o "pacote" ficou protegido antes de ser salvo/enviado
    alert(
        `Mensagem SMTP Processada com Sucesso!\n\n` +
        `=== DADOS CRIPTOGRAFADOS (Salvos no LocalStorage) ===\n` +
        `De (Criptografado): ${remetenteCriptografado}\n` +
        `Para (Criptografado): ${destinatarioCriptografado}\n` +
        `Assunto: ${assunto}\n` +
        `Corpo (Criptografado): ${corpoCriptografado}\n\n`
    );

    responseH1.textContent = "Pacote criptografado e armazenado no LocalStorage!";

    // Limpa o formulário e esconde novamente
    emailForm.reset();
    document.querySelector('#protocolo').value = "SMTP";
    emailForm.classList.add('hidden');
});


/**
 * Função que implementa a Cifra de César
 * Desloca letras maiúsculas, minúsculas e números. Mantém símbolos como '@' e '.' intactos.
 */
function criptografarCesar(texto, deslocamento) {
    return texto.split('').map(caractere => {
        const codigo = caractere.charCodeAt(0);

        // Letras Maiúsculas (A-Z)
        if (codigo >= 65 && codigo <= 90) {
            return String.fromCharCode(((codigo - 65 + deslocamento) % 26) + 65);
        }
        // Letras Minúsculas (a-z)
        if (codigo >= 97 && codigo <= 122) {
            return String.fromCharCode(((codigo - 97 + deslocamento) % 26) + 97);
        }
        // Números (0-9)
        if (codigo >= 48 && codigo <= 57) {
            return String.fromCharCode(((codigo - 48 + deslocamento) % 10) + 48);
        }

        // Retorna o caractere original se for espaço, @, pontos, etc.
        return caractere;
    }).join('');
}


// Listener para o arquivo
const inputFile = document.querySelector('#arquivo');
inputFile.addEventListener('change', () => {
    if (inputFile.files.length > 0) {
        alert(inputFile.files[0].name);
    }
});