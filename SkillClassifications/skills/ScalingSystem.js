export class ScalingSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.scalingFactors = {
            str: 1.5,    // Strength scaling - high physical damage
            dex: 1.3,    // Dexterity scaling - balanced damage/speed
            agi: 1.2,    // Agility scaling - speed focused
            int: 1.4,    // Intelligence scaling - magical damage/healing
            luk: 1.0     // Luck scaling - critical focused
        };
    }

    calculateScaling(skill, baseValue) {
        const stat = skill.scalesWith.toLowerCase();
        const scalingFactor = this.scalingFactors[stat] || 1.0;
        
        // Get the player's stat value
        const statValue = this.getPlayerStat(stat);
        
        switch (stat) {
            case 'str':
                return this.calculateStrScaling(baseValue, statValue, scalingFactor);
            case 'dex':
                return this.calculateDexScaling(baseValue, statValue, scalingFactor);
            case 'agi':
                return this.calculateAgiScaling(baseValue, statValue, scalingFactor);
            case 'int':
                return this.calculateIntScaling(baseValue, statValue, scalingFactor);
            case 'luk':
                return this.calculateLukScaling(baseValue, statValue, scalingFactor);
            default:
                return baseValue;
        }
    }

    getPlayerStat(stat) {
        return this.gameState.player.stats[stat] || 1;
    }

    calculateStrScaling(baseValue, strValue, factor) {
        // Strength scaling: Linear increase with diminishing returns
        return baseValue * (1 + (strValue * factor) / 100);
    }

    calculateDexScaling(baseValue, dexValue, factor) {
        // Dexterity scaling: Balanced between damage and speed
        const damageMultiplier = 1 + (dexValue * factor) / 150;
        const speedMultiplier = 1 + (dexValue * 0.5) / 100;
        
        return {
            value: baseValue * damageMultiplier,
            speed: speedMultiplier
        };
    }

    calculateAgiScaling(baseValue, agiValue, factor) {
        // Agility scaling: Focus on speed and cooldown reduction
        const speedMultiplier = 1 + (agiValue * factor) / 100;
        const cooldownReduction = Math.min(agiValue / 200, 0.5); // Max 50% CDR
        
        return {
            value: baseValue,
            speed: speedMultiplier,
            cooldownReduction: cooldownReduction
        };
    }

    calculateIntScaling(baseValue, intValue, factor) {
        // Intelligence scaling: High magical damage and healing power
        const magicMultiplier = 1 + (intValue * factor) / 80;
        const healingBonus = intValue * 0.2;
        
        return {
            value: baseValue * magicMultiplier,
            healingPower: healingBonus,
            magicPenetration: Math.min(intValue / 150, 0.3) // Max 30% magic pen
        };
    }

    calculateLukScaling(baseValue, lukValue, factor) {
        // Luck scaling: Affects critical chance and bonus effects
        const critChance = Math.min(lukValue / 100, 0.5); // Max 50% crit chance
        const critMultiplier = 1.5 + (lukValue * 0.01); // Base 1.5x, increases with luck
        
        return {
            value: baseValue,
            critChance: critChance,
            critMultiplier: critMultiplier
        };
    }
} 