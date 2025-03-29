import { SkillSystem } from '../SkillClassifications/SkillSystem.js';

export class CombatSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.setupCombatControls();
        
        // Add some test enemies
        gameState.addEnemy(300, 300);
        gameState.addEnemy(500, 400);
    }

    setupCombatControls() {
        document.addEventListener('mousemove', (e) => {
            const container = document.getElementById('game-container');
            const rect = container.getBoundingClientRect();
            this.gameState.mouseX = e.clientX - rect.left;
            this.gameState.mouseY = e.clientY - rect.top;
        });

        // Setup click controls for skill buttons
        ['1', '2', '3', '4'].forEach(slot => {
            const button = document.getElementById(`skill-${slot}-button`);
            if (button) {
                button.addEventListener('click', () => {
                    if (!this.gameState.skillCooldown) {
                        this.gameState.skillManager.executeSkill(slot);
                    }
                });
            }
        });
    }
} 