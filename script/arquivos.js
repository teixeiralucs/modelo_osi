const arquivosForm = document.querySelector('.arquivos-form');
const userDisplay = document.querySelector('.user');

// 1. Resgata o nome completo do arquivo vindo do localStorage da home
const nomeCompleto = localStorage.getItem('nome_arquivo_inicial') || "documento.pdf";

// Separa o nome da extensão/formato usando manipulação de strings básica
const ultimoPonto = nomeCompleto.lastIndexOf('.');
const somenteNome = ultimoPonto !== -1 ? nomeCompleto.substring(0, ultimoPonto) : nomeCompleto;
const somenteFormato = ultimoPonto !== -1 ? nomeCompleto.substring(ultimoPonto + 1) : "desconhecido";

// Preenche os campos travados do formulário na tela
document.querySelector('#arq-nome-preview').value = somenteNome;
document.querySelector('#arq-formato-preview').value = somenteFormato;

arquivosForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const remetenteDigitado = document.querySelector('#arq-remetente').value;
    const protocoloArquivo = document.querySelector('#arq-protocolo').value;

    // 2. Aplica a criptografia nos campos solicitados usando o global.js
    const nomeCriptografado = criptografarCesar(somenteNome);
    const formatoCriptografado = criptografarCesar(somenteFormato);
    const remetenteCriptografado = criptografarCesar(remetenteDigitado);

    // 3. Gera o timestamp do sistema
    const agora = new Date();
    const timeStampFormatado = agora.toLocaleTimeString('pt-BR') + ' ' + agora.toLocaleDateString('pt-BR');

    if (userDisplay) userDisplay.textContent = `Usuário: ${remetenteDigitado}`;

    // 4. Monta o objeto ARQUIVO rigorosamente conforme o slide 4 do professor
    const arquivo = {
        nomeArquivo: nomeCriptografado,      // Criptografado
        formato: formatoCriptografado,          // Criptografado
        remetente: remetenteCriptografado,  // Criptografado
        protocolo: protocoloArquivo,
        timestamp: timeStampFormatado
    };

    // Salva no banco local do navegador
    localStorage.setItem(`ftp_envio_${Date.now()}`, JSON.stringify(arquivo));

    // 5. Renderização unificada: cospe o objeto no terminal colorido abaixo do form
    exibirCodigoEmTela('arquivo', arquivo);

    // Limpa o campo do remetente
    document.querySelector('#arq-remetente').value = "";
});