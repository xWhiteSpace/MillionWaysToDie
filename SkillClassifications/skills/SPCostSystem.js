export class SPCostSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.costModifiers = new Map(); // Store temporary cost modifiers
    }

    calculateCost(skill) {
        let baseCost = this.getBaseCost(skill);
        
        // Apply any active modifiers
        const modifier = this.costModifiers.get(skill.id) || 1.0;
        const finalCost = Math.round(baseCost * modifier);
        
        // Ensure cost stays within bounds (10-50)
        return Math.max(10, Math.min(50, finalCost));
    }

    getBaseCost(skill) {
        // Base costs for different skill types
        const baseCosts = {
            damage: 20,
            heal: 25,
            shield: 30,
            buff: 35,
            debuff: 35,
            crowdControl: 40,
            summon: 45,
            dodge: 15,
            teleport: 25
        };

        return baseCosts[skill.type] || 20;
    }

    canUseSkill(skill) {
        const cost = this.calculateCost(skill);
        return this.gameState.player.currentSP >= cost;
    }

    consumeSP(skill) {
        if (!this.canUseSkill(skill)) {
            return false;
        }

        const cost = this.calculateCost(skill);
        this.gameState.player.currentSP -= cost;
        return true;
    }

    // Modifier management
    addCostModifier(skillId, modifier, duration = 0) {
        this.costModifiers.set(skillId, modifier);
        
        if (duration > 0) {
            setTimeout(() => {
                this.removeCostModifier(skillId);
            }, duration);
        }
    }

    removeCostModifier(skillId) {
        this.costModifiers.delete(skillId);
    }

    // Cost reduction effects
    applyCostReduction(skillId, percentage, duration = 0) {
        const modifier = 1 - (percentage / 100);
        this.addCostModifier(skillId, modifier, duration);
    }

    // Cost increase effects (e.g., for debuffs)
    applyCostIncrease(skillId, percentage, duration = 0) {
        const modifier = 1 + (percentage / 100);
        this.addCostModifier(skillId, modifier, duration);
    }

    // Reset all modifiers
    resetModifiers() {
        this.costModifiers.clear();
    }
} 