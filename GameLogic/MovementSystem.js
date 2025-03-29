export class MovementSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.setupControls();
    }

    setupControls() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        requestAnimationFrame(() => this.gameLoop());
    }

    handleKeyDown(e) {
        if (this.gameState.keys.hasOwnProperty(e.key.toLowerCase())) {
            this.gameState.keys[e.key.toLowerCase()] = true;
        }
    }

    handleKeyUp(e) {
        if (this.gameState.keys.hasOwnProperty(e.key.toLowerCase())) {
            this.gameState.keys[e.key.toLowerCase()] = false;
        }
    }

    updatePosition() {
        const { keys, player } = this.gameState;
        let dx = 0;
        let dy = 0;

        if (keys.w) dy -= player.speed;
        if (keys.s) dy += player.speed;
        if (keys.a) dx -= player.speed;
        if (keys.d) dx += player.speed;

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }

        // Update position with bounds checking
        const newX = Math.max(0, Math.min(1366 - 30, player.x + dx));
        const newY = Math.max(0, Math.min(768 - 30, player.y + dy));

        player.x = newX;
        player.y = newY;
        player.element.style.transform = `translate(${newX}px, ${newY}px)`;
    }

    gameLoop() {
        this.updatePosition();
        requestAnimationFrame(() => this.gameLoop());
    }
} 