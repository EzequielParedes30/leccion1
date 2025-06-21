const config = {
    gravity: 0.5,
    jumpForce: -12,
    moveSpeed: 5,
    trampolineBounce: -15,
    obstacleSpeed: 3,
    obstacleSpawnRate: 100,
    trampolineMoveSpeed: 2,
    floorY: 550
};

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score-display');
const restartButton = document.getElementById('restart-button');

let animationId;

let state;

function init() {
    cancelAnimationFrame(animationId);

    state = {
        player: {
            x: 185,
            y: 100,
            width: 30,
            height: 40,
            velocityY: 0,
            isJumping: false,
            canJump: false,
            color: '#FF5733'
        },
        trampoline: {
            x: 150,
            y: 500,
            width: 100,
            height: 10,
            color: '#4CAF50'
        },
        obstacles: [],
        keys: {},
        score: 0,
        frames: 0,
        gameOver: false
    };

    scoreDisplay.textContent = "Puntos: 0";
    gameLoop();
}

restartButton.addEventListener('click', init);

window.addEventListener('keydown', (e) => {
    if (state.gameOver) return;

    state.keys[e.key] = true;
    if (e.key === ' ' && state.player.canJump) {
        state.player.velocityY = config.jumpForce;
        state.player.isJumping = true;
        state.player.canJump = false;
    }
});

window.addEventListener('keyup', (e) => {
    state.keys[e.key] = false;
});

function update() {
    if (state.gameOver) return;

    if (state.keys.ArrowLeft) state.player.x -= config.moveSpeed;
    if (state.keys.ArrowRight) state.player.x += config.moveSpeed;

    state.player.x = Math.max(0, Math.min(canvas.width - state.player.width, state.player.x));

    state.player.velocityY += config.gravity;
    state.player.y += state.player.velocityY;

    if (state.player.y + state.player.height > config.floorY) {
        state.gameOver = true;
        return;
    }

    state.trampoline.x += config.trampolineMoveSpeed;
    if (state.trampoline.x <= 0 || state.trampoline.x + state.trampoline.width >= canvas.width) {
        config.trampolineMoveSpeed *= -1;
    }

    if (state.player.y + state.player.height >= state.trampoline.y &&
        state.player.y < state.trampoline.y &&
        state.player.x + state.player.width > state.trampoline.x &&
        state.player.x < state.trampoline.x + state.trampoline.width &&
        state.player.velocityY > 0) {
        state.player.velocityY = config.trampolineBounce;
        state.player.canJump = true;
        state.score++;
        scoreDisplay.textContent = `Puntos: ${state.score}`;
    }

    state.frames++;
    if (state.frames % config.obstacleSpawnRate === 0) {
        const size = Math.random() * 30 + 20;
        state.obstacles.push({
            x: Math.random() * (canvas.width - size),
            y: -size,
            width: size,
            height: size,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });
    }

    for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        obs.y += config.obstacleSpeed;

        if (state.player.x < obs.x + obs.width &&
            state.player.x + state.player.width > obs.x &&
            state.player.y < obs.y + obs.height &&
            state.player.y + state.player.height > obs.y) {
            state.gameOver = true;
        }

        if (obs.y > canvas.height) {
            state.obstacles.splice(i, 1);
        }
    }
}

function render() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(0, config.floorY, canvas.width, canvas.height - config.floorY);

    ctx.fillStyle = state.player.color;
    ctx.fillRect(state.player.x, state.player.y, state.player.width, state.player.height);

    ctx.fillStyle = '#FFC300';
    ctx.beginPath();
    ctx.arc(state.player.x + state.player.width / 2, state.player.y - 5, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(state.player.x + state.player.width / 2 - 4, state.player.y - 8, 2, 0, Math.PI * 2);
    ctx.arc(state.player.x + state.player.width / 2 + 4, state.player.y - 8, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = state.trampoline.color;
    ctx.fillRect(state.trampoline.x, state.trampoline.y, state.trampoline.width, state.trampoline.height);

    ctx.fillStyle = '#795548';
    ctx.fillRect(state.trampoline.x - 5, state.trampoline.y, 5, 20);
    ctx.fillRect(state.trampoline.x + state.trampoline.width, state.trampoline.y, 5, 20);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 10;
    state.obstacles.forEach(obs => {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
    ctx.shadowBlur = 0;

    if (state.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#FF0000';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('¡PERDISTE!', canvas.width / 2, canvas.height / 2 - 30);
        ctx.fillText(`Puntuación: ${state.score}`, canvas.width / 2, canvas.height / 2 + 20);
    }
}

function gameLoop() {
    update();
    render();
    animationId = requestAnimationFrame(gameLoop);
}

init();
