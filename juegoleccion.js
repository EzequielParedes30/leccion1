const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');


function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function gameLoop() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    requestAnimationFrame(gameLoop);
}

gameLoop();