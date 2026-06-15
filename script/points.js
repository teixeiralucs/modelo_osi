// Definição do grafo da rede com grid ampliado
const networkNodes = [
    { id: 'A', x: 50, y: 300, active: true, label: 'Origem' },
    { id: 'B', x: 200, y: 100, active: true, label: 'Roteador 1' },
    { id: 'C', x: 200, y: 300, active: false, label: 'Roteador 2 (Falha)' }, // Falha 1
    { id: 'D', x: 200, y: 500, active: true, label: 'Roteador 3' },
    { id: 'E', x: 350, y: 100, active: true, label: 'Roteador 4' },
    { id: 'F', x: 350, y: 300, active: true, label: 'Roteador 5' }, 
    { id: 'G', x: 350, y: 500, active: true, label: 'Roteador 6' },
    { id: 'H', x: 500, y: 100, active: false, label: 'Roteador 7 (Falha)' }, // Falha 2
    { id: 'I', x: 500, y: 300, active: true, label: 'Roteador 8' },
    { id: 'J', x: 500, y: 500, active: true, label: 'Roteador 9' },
    { id: 'K', x: 650, y: 200, active: false, label: 'Roteador 10 (Falha)' }, // Falha 3
    { id: 'L', x: 650, y: 400, active: true, label: 'Roteador 11' },
    { id: 'M', x: 750, y: 300, active: true, label: 'Destino' }
];

// As arestas com pesos base (que serão sobrescritos aleatoriamente a cada simulação)
const networkEdges = [
    { source: 'A', target: 'B', weight: 1 },
    { source: 'A', target: 'C', weight: 1 },
    { source: 'A', target: 'D', weight: 1 },
    { source: 'B', target: 'E', weight: 1 },
    { source: 'B', target: 'C', weight: 1 },
    { source: 'C', target: 'E', weight: 1 },
    { source: 'C', target: 'F', weight: 1 },
    { source: 'C', target: 'G', weight: 1 },
    { source: 'C', target: 'D', weight: 1 },
    { source: 'D', target: 'G', weight: 1 },
    { source: 'E', target: 'H', weight: 1 },
    { source: 'E', target: 'F', weight: 1 },
    { source: 'F', target: 'H', weight: 1 },
    { source: 'F', target: 'I', weight: 1 },
    { source: 'F', target: 'J', weight: 1 },
    { source: 'F', target: 'G', weight: 1 },
    { source: 'G', target: 'J', weight: 1 },
    { source: 'H', target: 'K', weight: 1 },
    { source: 'H', target: 'I', weight: 1 },
    { source: 'I', target: 'K', weight: 1 },
    { source: 'I', target: 'L', weight: 1 },
    { source: 'I', target: 'J', weight: 1 },
    { source: 'J', target: 'L', weight: 1 },
    { source: 'K', target: 'M', weight: 1 },
    { source: 'L', target: 'M', weight: 1 }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { networkNodes, networkEdges };
}
