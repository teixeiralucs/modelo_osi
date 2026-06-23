const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');
const logArea = document.getElementById('route-log');
const restartBtn = document.getElementById('restart-btn');

// Carregando as imagens
const imgRouter = new Image();
imgRouter.src = './assets/router.svg';
const imgRouterBroken = new Image();
imgRouterBroken.src = './assets/router_broken.svg';
const imgPacket = new Image();
imgPacket.src = './assets/packet.svg';

let imagesLoaded = 0;
const totalImages = 3;

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        initSimulation();
    }
}

imgRouter.onload = imageLoaded;
imgRouterBroken.onload = imageLoaded;
imgPacket.onload = imageLoaded;

function logMessage(msg, type = 'info') {
    const p = document.createElement('p');
    p.className = type;
    p.innerText = `> ${msg}`;
    logArea.appendChild(p);
    logArea.scrollTop = logArea.scrollHeight;
}

// Algoritmo de Dijkstra para encontrar o melhor caminho
function dijkstra(nodes, edges, startId, endId) {
    const distances = {};
    const previous = {};
    const unvisited = new Set();

    nodes.forEach(node => {
        if (node.active) {
            distances[node.id] = Infinity;
            unvisited.add(node.id);
        }
    });

    distances[startId] = 0;

    while (unvisited.size > 0) {
        // Encontra o nó não visitado com a menor distância
        let current = null;
        let minDistance = Infinity;
        
        for (const nodeId of unvisited) {
            if (distances[nodeId] < minDistance) {
                minDistance = distances[nodeId];
                current = nodeId;
            }
        }

        if (current === null || current === endId) break;

        unvisited.delete(current);

        // Atualiza as distâncias dos vizinhos
        edges.forEach(edge => {
            let neighbor = null;
            if (edge.source === current && unvisited.has(edge.target)) {
                neighbor = edge.target;
            } else if (edge.target === current && unvisited.has(edge.source)) {
                neighbor = edge.source;
            }

            if (neighbor) {
                const alt = distances[current] + edge.weight;
                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = current;
                }
            }
        });
    }

    // Reconstrói o caminho
    const path = [];
    let curr = endId;
    if (previous[curr] !== undefined || curr === startId) {
        while (curr !== undefined) {
            path.unshift(curr);
            curr = previous[curr];
        }
    }
    
    return path;
}

// Funções de desenho
function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar arestas
    networkEdges.forEach(edge => {
        const sourceNode = networkNodes.find(n => n.id === edge.source);
        const targetNode = networkNodes.find(n => n.id === edge.target);

        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        
        // Se um dos nós estiver inativo, pinta a linha de vermelho fraco
        if (!sourceNode.active || !targetNode.active) {
            ctx.strokeStyle = 'rgba(220, 53, 69, 0.3)';
        } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        }
        
        ctx.lineWidth = 2;
        ctx.stroke();

        // Desenhar peso da aresta (removido para não poluir a tela com 100 roteadores)
        // const midX = (sourceNode.x + targetNode.x) / 2;
        // const midY = (sourceNode.y + targetNode.y) / 2;
        // ctx.fillStyle = 'rgba(0, 210, 255, 0.8)';
        // ctx.font = '14px monospace';
        // ctx.fillText(edge.weight, midX, midY - 10);
    });

    // Desenhar nós
    networkNodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = node.active ? '#28a745' : '#dc3545'; // Verde para online, vermelho para offline
        ctx.fill();
        
        // Destacar Origem e Destino com uma borda
        if (node.label === 'Origem' || node.label === 'Destino') {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        ctx.closePath();

        // Texto (mostrar apenas para Origem e Destino para não poluir visualmente)
        if (node.label) {
            ctx.fillStyle = '#fff';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(node.label, node.x, node.y + 20);
        }
    });
}

// Animação do Pacote
let currentPath = [];
let pathIndex = 0;
let packetPos = { x: 0, y: 0 };
let animationProgress = 0;
const ANIMATION_SPEED = 0.02; 
let isAnimating = false;

function animatePacket() {
    if (!isAnimating) return;

    drawNetwork(); // Redesenha a rede base

    if (pathIndex < currentPath.length - 1) {
        const sourceId = currentPath[pathIndex];
        const targetId = currentPath[pathIndex + 1];
        const sourceNode = networkNodes.find(n => n.id === sourceId);
        const targetNode = networkNodes.find(n => n.id === targetId);

        // Interpolação linear da posição
        packetPos.x = sourceNode.x + (targetNode.x - sourceNode.x) * animationProgress;
        packetPos.y = sourceNode.y + (targetNode.y - sourceNode.y) * animationProgress;

        // Desenhar pacote
        ctx.drawImage(imgPacket, packetPos.x - 15, packetPos.y - 15, 30, 30);

        // Avançar animação
        animationProgress += ANIMATION_SPEED;
        if (animationProgress >= 1) {
            animationProgress = 0;
            pathIndex++;
            logMessage(`Pacote atingiu o roteador ${targetId}`, 'highlight');
        }

        requestAnimationFrame(animatePacket);
    } else {
        // Fim da animação
        const finalNode = networkNodes.find(n => n.id === currentPath[currentPath.length - 1]);
        ctx.drawImage(imgPacket, finalNode.x - 15, finalNode.y - 15, 30, 30);
        logMessage(`Pacote chegou ao destino com sucesso!`, 'success');
        isAnimating = false;
        restartBtn.style.display = 'block';
    }
}

function initSimulation() {
    // Aleatoriza os roteadores online/offline a cada simulação
    networkNodes.forEach(node => {
        if (node.label !== 'Origem' && node.label !== 'Destino') {
            node.active = Math.random() > 0.1; // 10% de chance de falhar
        }
    });

    // Aleatoriza os pesos das arestas entre 1 e 10
    networkEdges.forEach(edge => {
        edge.weight = Math.floor(Math.random() * 10) + 1;
    });

    drawNetwork();
    logMessage("Grafo da rede ampliado carregado com pesos aleatórios.");
    
    setTimeout(() => {
        logMessage("Calculando melhor rota (Dijkstra) de Origem para Destino...");
        const startId = 'R0';
        const endId = 'R99';
        
        currentPath = dijkstra(networkNodes, networkEdges, startId, endId);
        
        if (currentPath.length > 0) {
            logMessage(`Melhor caminho encontrado: ${currentPath.join(' -> ')}`, 'success');
            setTimeout(() => {
                logMessage("Iniciando transporte do pacote...");
                pathIndex = 0;
                animationProgress = 0;
                isAnimating = true;
                animatePacket();
            }, 1000);
        } else {
            logMessage("Não foi possível encontrar uma rota para o destino!", 'error');
            restartBtn.style.display = 'block';
        }
    }, 1500);
}

restartBtn.addEventListener('click', () => {
    restartBtn.style.display = 'none';
    logArea.innerHTML = '<p>Reiniciando simulação...</p>';
    drawNetwork();
    initSimulation();
});
