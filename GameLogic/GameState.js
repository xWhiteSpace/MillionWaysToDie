export class GameState {
    constructor() {
        this.player = {
            x: 0,
            y: 0,
            speed: 5,
            element: document.getElementById('player'),
            currentSP: 100,
            maxSP: 100,
            stats: {
                str: 10,
                dex: 10,
                agi: 10,
                int: 10,
                luk: 10
            }
        };
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false
        };
        this.currentSkill = null;
        this.projectiles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.enemies = [];
        this.skillCooldown = false;
        this.skillButton = document.getElementById('skill-button');
    }

    addEnemy(x, y) {
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        enemy.style.transform = `translate(${x}px, ${y}px)`;
        document.getElementById('game-container').appendChild(enemy);
        this.enemies.push({ x, y, element: enemy });
    }
} 