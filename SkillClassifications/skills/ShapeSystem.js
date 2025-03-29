export class ShapeSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.shapes = {
            'single target': this.createPointShape.bind(this),
            'cone': this.createConeShape.bind(this),
            'circle': this.createCircleShape.bind(this),
            'line': this.createLineShape.bind(this)
        };
    }

    applyShape(shape) {
        const shapeHandler = this.shapes[shape.toLowerCase()];
        if (shapeHandler) {
            shapeHandler();
        }
    }

    createPointShape() {
        const effect = document.createElement('div');
        effect.className = 'point-hit';
        effect.style.transform = `translate(${this.gameState.mouseX - 25}px, ${this.gameState.mouseY - 25}px)`;
        document.getElementById('game-container').appendChild(effect);
        
        setTimeout(() => effect.remove(), 200);
    }

    createConeShape() {
        const { player, mouseX, mouseY } = this.gameState;
        const effect = document.createElement('div');
        effect.className = 'cone-hit';
        
        // Calculate angle between player and mouse
        const dx = mouseX - player.x;
        const dy = mouseY - player.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        effect.style.transform = `translate(${player.x}px, ${player.y}px) rotate(${angle - 90}deg)`;
        document.getElementById('game-container').appendChild(effect);
        
        setTimeout(() => effect.remove(), 300);
    }

    createCircleShape() {
        const { player } = this.gameState;
        const effect = document.createElement('div');
        effect.className = 'circle-hit';
        effect.style.transform = `translate(${player.x - 50}px, ${player.y - 50}px)`;
        document.getElementById('game-container').appendChild(effect);
        
        setTimeout(() => effect.remove(), 500);
    }

    createLineShape() {
        const { player, mouseX, mouseY } = this.gameState;
        const effect = document.createElement('div');
        effect.className = 'line-hit';
        
        // Calculate angle between player and mouse
        const dx = mouseX - player.x;
        const dy = mouseY - player.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        effect.style.transform = `translate(${player.x}px, ${player.y}px) rotate(${angle}deg)`;
        document.getElementById('game-container').appendChild(effect);
        
        setTimeout(() => effect.remove(), 300);
    }
} 