// Definição do grafo da rede
const networkNodes = [
    { id: 'A', x: 100, y: 300, active: true, label: 'Origem' },
    { id: 'B', x: 250, y: 150, active: true, label: 'Roteador 1' },
    { id: 'C', x: 250, y: 450, active: true, label: 'Roteador 2' },
    { id: 'D', x: 400, y: 300, active: false, label: 'Roteador 3 (Falha)' }, // Roteador quebrado intencionalmente
    { id: 'E', x: 400, y: 100, active: true, label: 'Roteador 4' },
    { id: 'F', x: 550, y: 450, active: true, label: 'Roteador 5' },
    { id: 'G', x: 550, y: 200, active: true, label: 'Roteador 6' },
    { id: 'H', x: 700, y: 300, active: true, label: 'Destino' }
];

// Matriz de adjacência ou lista de arestas com pesos (distâncias)
const networkEdges = [
    { source: 'A', target: 'B', weight: 4 },
    { source: 'A', target: 'C', weight: 3 },
    { source: 'B', target: 'D', weight: 2 },
    { source: 'B', target: 'E', weight: 5 },
    { source: 'C', target: 'D', weight: 2 },
    { source: 'C', target: 'F', weight: 6 },
    { source: 'D', target: 'G', weight: 4 },
    { source: 'E', target: 'G', weight: 2 },
    { source: 'F', target: 'H', weight: 3 },
    { source: 'G', target: 'H', weight: 2 }
];

// Opcional: Para ambientes que usam modules import/export (embora aqui estejamos importando via script tag normal)
// Se houver necessidade, exportamos:
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { networkNodes, networkEdges };
}
