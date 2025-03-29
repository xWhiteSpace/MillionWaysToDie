export class ElementSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.elementEffects = {
            fire: {
                color: '#ff4400',
                particleCount: 8,
                duration: 500
            },
            water: {
                color: '#00aaff',
                particleCount: 6,
                duration: 400
            },
            wind: {
                color: '#88ff88',
                particleCount: 12,
                duration: 300
            },
            earth: {
                color: '#aa7744',
                particleCount: 4,
                duration: 600
            },
            poison: {
                color: '#aa44aa',
                particleCount: 10,
                duration: 800
            },
            holy: {
                color: '#ffff00',
                particleCount: 16,
                duration: 400
            },
            shadow: {
                color: '#442266',
                particleCount: 8,
                duration: 600
            },
            undead: {
                color: '#66aaaa',
                particleCount: 6,
                duration: 700
            },
            neutral: {
                color: '#aaaaaa',
                particleCount: 4,
                duration: 300
            }
        };
    }

    applyElement(element) {
        const elementType = element.toLowerCase();
        const effect = this.elementEffects[elementType];
        
        if (!effect) return;

        // Create particles based on element type
        for (let i = 0; i < effect.particleCount; i++) {
            this.createElementParticle(elementType, effect);
        }
    }

    createElementParticle(elementType, effect) {
        const { player } = this.gameState;
        const particle = document.createElement('div');
        particle.className = `${elementType}-effect`;
        
        // Random position around the player
        const angle = (Math.PI * 2 * Math.random());
        const distance = 30 * Math.random();
        const x = player.x + Math.cos(angle) * distance;
        const y = player.y + Math.sin(angle) * distance;
        
        particle.style.transform = `translate(${x}px, ${y}px)`;
        particle.style.backgroundColor = effect.color;
        particle.style.opacity = '0.8';
        particle.style.position = 'absolute';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.borderRadius = '50%';
        particle.style.filter = 'blur(2px)';
        particle.style.transition = `all ${effect.duration}ms ease-out`;
        
        document.getElementById('game-container').appendChild(particle);

        // Animate particle
        requestAnimationFrame(() => {
            particle.style.transform = `translate(${x + Math.cos(angle) * 50}px, ${y + Math.sin(angle) * 50}px)`;
            particle.style.opacity = '0';
        });

        // Remove particle after animation
        setTimeout(() => particle.remove(), effect.duration);
    }
} 