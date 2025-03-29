export class RangeSystem {
    constructor(gameState) {
        this.gameState = gameState;
    }

    execute(skill) {
        switch (skill.range?.toLowerCase()) {
            case 'melee':
                this.executeMeleeSkill(skill);
                break;
            case 'ranged':
                this.executeRangedSkill(skill);
                break;
            default:
                console.warn('Unknown skill range:', skill.range);
        }
    }

    executeMeleeSkill(skill) {
        const { player } = this.gameState;
        const meleeRange = 50; // 50px melee range

        // Create melee effect
        const effect = document.createElement('div');
        effect.className = `melee-effect ${skill.element.toLowerCase()}`;
        effect.style.width = `${meleeRange * 2}px`;
        effect.style.height = `${meleeRange * 2}px`;
        effect.style.transform = `translate(${player.x - meleeRange + 15}px, ${player.y - meleeRange + 15}px)`;
        
        document.getElementById('game-container').appendChild(effect);

        // Check for enemies in range
        this.gameState.enemies.forEach(enemy => {
            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= meleeRange) {
                this.createHitEffect(enemy.x, enemy.y, skill);
            }
        });

        // Remove effect after animation
        setTimeout(() => effect.remove(), 300);
    }

    executeRangedSkill(skill) {
        const { player, mouseX, mouseY } = this.gameState;
        
        // Calculate direction
        const dx = mouseX - player.x;
        const dy = mouseY - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;

        // Create projectile
        const projectile = document.createElement('div');
        projectile.className = `projectile ${skill.element.toLowerCase()}`;
        projectile.style.transform = `translate(${player.x + 15}px, ${player.y + 15}px)`;
        
        document.getElementById('game-container').appendChild(projectile);

        // Animate projectile
        const speed = 10;
        let currentX = player.x + 15;
        let currentY = player.y + 15;
        let hasHit = false;

        const moveProjectile = () => {
            if (hasHit) return;

            currentX += normalizedDx * speed;
            currentY += normalizedDy * speed;
            projectile.style.transform = `translate(${currentX}px, ${currentY}px)`;

            // Check for enemy hits
            this.gameState.enemies.forEach(enemy => {
                const hitDx = enemy.x - currentX;
                const hitDy = enemy.y - currentY;
                const hitDistance = Math.sqrt(hitDx * hitDx + hitDy * hitDy);

                if (hitDistance < 20 && !hasHit) {
                    hasHit = true;
                    this.createHitEffect(currentX, currentY, skill);
                    projectile.remove();
                }
            });

            // Check if projectile is out of bounds
            if (currentX < 0 || currentX > 1366 || currentY < 0 || currentY > 768) {
                projectile.remove();
                return;
            }

            if (!hasHit) {
                requestAnimationFrame(moveProjectile);
            }
        };

        requestAnimationFrame(moveProjectile);
    }

    createHitEffect(x, y, skill) {
        const hit = document.createElement('div');
        hit.className = `${skill.element.toLowerCase()}-hit`;
        hit.style.transform = `translate(${x - 25}px, ${y - 25}px)`;
        
        document.getElementById('game-container').appendChild(hit);
        setTimeout(() => hit.remove(), 300);
    }
} 