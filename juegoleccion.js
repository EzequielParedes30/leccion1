const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

function init() {
    canvas.width = 400;
    canvas.height = 600;
    
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    console.log("Juego iniciado correctamente");
}

try {
    init();
} catch (error) {
    console.error("Error crítico:", error);
    alert("Ocurrió un error. Abre la consola (F12) para detalles.");
}