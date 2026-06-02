const reqInput = document.querySelector('.text-input');
const btnEnviar = document.querySelector('.request-btn');
const responseH1 = document.querySelector('.protocol-response');

reqInput.addEventListener('input', () => {
    if (reqInput.value.length > 0) {
        btnEnviar.classList.add('active');
    } else {
        btnEnviar.classList.remove('active');
    }
});

btnEnviar.addEventListener('click', (event) => {
    event.preventDefault();
    
    const textoDigitado = reqInput.value.trim();
    const valueLower = textoDigitado.toLowerCase();

    if (textoDigitado === "") return;

    // Guarda temporariamente o texto para a próxima página ler se precisar
    localStorage.setItem('texto_inicial', textoDigitado);

    if (valueLower.includes('@')) {
        responseH1.textContent = "Redirecionando para SMTP (E-mail)...";
        setTimeout(() => window.location.href = 'email.html', 1000);
    } 
    else if (valueLower.includes('.com') || valueLower.includes('.br') || valueLower.startsWith('http')) {
    responseH1.textContent = "Redirecionando para HTTP/HTTPS...";
    setTimeout(() => window.location.href = 'sites.html', 1000);
    } 
    else {
        responseH1.textContent = "Redirecionando para CHAT...";
        setTimeout(() => window.location.href = 'chat.html', 1000);
    }
});

const inputFile = document.querySelector('#arquivo');

if (inputFile) {
    inputFile.addEventListener('change', () => {
        if (inputFile.files.length > 0) {
            const arquivoSelecionado = inputFile.files[0];
            
            // Salva o nome completo do arquivo para a próxima página tratar
            localStorage.setItem('nome_arquivo_inicial', arquivoSelecionado.name);
            
            // Define o protocolo padrão no h1 antes de mudar de página (opcional)
            responseH1.textContent = "Detectado: Transferência de Arquivo. Redirecionando...";
            
            // Redireciona automaticamente após 1 segundo
            setTimeout(() => {
                window.location.href = 'arquivos.html';
            }, 1000);
        }
    });
}