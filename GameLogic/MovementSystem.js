export class MovementSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.setupControls();
        this.containerBounds = document.getElementById('game-container').getBoundingClientRect();
    }

    setupControls() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        // Update container bounds on window resize
        window.addEventListener('resize', () => {
            this.containerBounds = document.getElementById('game-container').getBoundingClientRect();
        });
        requestAnimationFrame(() => this.gameLoop());
    }

    handleKeyDown(e) {
        // Check if prompt input is focused
        const promptInput = document.getElementById('prompt-input');
        if (promptInput && document.activeElement === promptInput) {
            return; // Let the key event propagate for typing
        }

        // Only handle WASD keys for movement
        if (this.gameState.keys.hasOwnProperty(e.key.toLowerCase())) {
            this.gameState.keys[e.key.toLowerCase()] = true;
        }
    }

    handleKeyUp(e) {
        // Check if prompt input is focused
        const promptInput = document.getElementById('prompt-input');
        if (promptInput && document.activeElement === promptInput) {
            return; // Let the key event propagate for typing
        }

        // Only handle WASD keys for movement
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

        // Get container dimensions
        const containerWidth = this.containerBounds.width;
        const containerHeight = this.containerBounds.height;
        
        // Account for player size and border (2px border from CSS)
        const borderWidth = 2;
        const maxX = containerWidth - player.element.offsetWidth - (borderWidth * 2);
        const maxY = containerHeight - player.element.offsetHeight - (borderWidth * 2);

        // Update position with bounds checking
        const newX = Math.max(borderWidth, Math.min(maxX, player.x + dx));
        const newY = Math.max(borderWidth, Math.min(maxY, player.y + dy));

        player.x = newX;
        player.y = newY;
        player.element.style.transform = `translate(${newX}px, ${newY}px)`;
    }

    gameLoop() {
        this.updatePosition();
        requestAnimationFrame(() => this.gameLoop());
    }
} 