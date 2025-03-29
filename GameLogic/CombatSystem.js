import { SkillSystem } from '../SkillClassifications/SkillSystem.js';

export class CombatSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.skillSystem = new SkillSystem(gameState);
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

        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'q' && !this.gameState.skillCooldown) {
                this.executeSkill();
            }
        });

        this.gameState.skillButton.addEventListener('click', () => {
            if (!this.gameState.skillCooldown) {
                this.executeSkill();
            }
        });
    }

    executeSkill() {
        if (!this.gameState.currentSkill) return;

        // Start cooldown
        this.gameState.skillCooldown = true;
        this.gameState.skillButton.classList.add('disabled');
        
        // Execute skill using SkillSystem
        this.skillSystem.executeSkill(this.gameState.currentSkill);

        // Reset cooldown after 1 second
        setTimeout(() => {
            this.gameState.skillCooldown = false;
            this.gameState.skillButton.classList.remove('disabled');
        }, 1000);
    }
} 