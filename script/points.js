const networkNodes = [];
const networkEdges = [];

const cols = 10;
const rows = 10;
const startX = 60;
const startY = 60;
const spacingX = 75;
const spacingY = 50;

let idCounter = 0;

for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        const id = 'R' + idCounter;
        // Cerca de 10% dos roteadores falham
        const active = Math.random() > 0.1;
        
        let label = '';
        if (idCounter === 0) label = 'Origem';
        else if (idCounter === 99) label = 'Destino';
        
        networkNodes.push({
            id: id,
            x: startX + c * spacingX,
            y: startY + r * spacingY,
            active: active,
            label: label
        });
        idCounter++;
    }
}

// Garantir que Origem e Destino estejam ativos
networkNodes[0].active = true;
networkNodes[99].active = true;

// Criar as arestas (grid)
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        const currentId = 'R' + (r * cols + c);
        
        // Conexão com o vizinho da direita
        if (c < cols - 1) {
            networkEdges.push({ source: currentId, target: 'R' + (r * cols + c + 1), weight: 1 });
        }
        // Conexão com o vizinho de baixo
        if (r < rows - 1) {
            networkEdges.push({ source: currentId, target: 'R' + ((r + 1) * cols + c), weight: 1 });
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { networkNodes, networkEdges };
}
