// Chave única de criptografia compartilhada pelo sistema
const CHAVE_CRIPTOGRAFIA = 3;

/**
 * Função Algorítmica da Cifra de César com Mascaramento Oculto de Números
 */
function criptografarCesar(texto, deslocamento = CHAVE_CRIPTOGRAFIA) {
    if (!texto) return "";
    
    // Tabela de mascaramento fixo para ocultar o passo de números (0 a 9)
    // Evita que 1 vire 4, quebrando o padrão da cifra sequencial
    const mascaraNumeros = {
        '0': '$', '1': '#', '2': '@', '3': '%', '4': '&',
        '5': '*', '6': '!', '7': '?', '8': 'X', '9': 'Z'
    };

    return texto.split('').map(caractere => {
        // 1. Se for número, aplica a máscara para ocultar completamente o valor e o passo
        if (mascaraNumeros[caractere] !== undefined) {
            return mascaraNumeros[caractere];
        }

        const codigo = caractere.charCodeAt(0);

        // 2. Cifra de César para Letras Maiúsculas (A-Z)
        if (codigo >= 65 && codigo <= 90) {
            return String.fromCharCode(((codigo - 65 + deslocamento) % 26) + 65);
        }
        
        // 3. Cifra de César para Letras Minúsculas (a-z)
        if (codigo >= 97 && codigo <= 122) {
            return String.fromCharCode(((codigo - 97 + deslocamento) % 26) + 97);
        }

        // Mantém espaços, pontos e outros símbolos intactos
        return caractere;
    }).join('');
}

/**
 * Função Global para renderizar qualquer objeto no bloco de código estilo editor
 * @param {string} nomeVariavel - O nome da const (ex: 'chat' ou 'email')
 * @param {Object} objetoDados - O objeto com as chaves e valores
 */
function exibirCodigoEmTela(nomeVariavel, objetoDados) {
    const outputArea = document.querySelector('#output-json');
    if (!outputArea) return;

    // Começa a montar a estrutura do escopo do objeto
    let linhasCorpo = [];
    
    // Varre as propriedades do objeto gerando as tags de cor dinamicamente
    for (const [chave, valor] of Object.entries(objetoDados)) {
        linhasCorpo.push(`    <span class="property">${chave}</span>: <span class="string">'${valor}'</span>`);
    }

    // Junta tudo formatado na sintaxe do JavaScript
    const codigoHTML = `<span class="keyword">const</span> <span class="variable">${nomeVariavel}</span> = {
${linhasCorpo.join(',\n')}
};`;

    outputArea.innerHTML = codigoHTML;
    outputArea.classList.remove('hidden');
}