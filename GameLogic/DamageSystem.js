export class DamageSystem {
    constructor(gameState) {
        this.gameState = gameState;
        
        // Base damage modifiers
        this.elementalModifiers = {
            fire: { weakness: 'wind', strength: 'earth', modifier: 0.5 },
            water: { weakness: 'earth', strength: 'fire', modifier: 0.5 },
            wind: { weakness: 'earth', strength: 'water', modifier: 0.5 },
            earth: { weakness: 'fire', strength: 'wind', modifier: 0.5 },
            poison: { weakness: 'holy', strength: 'shadow', modifier: 0.3 },
            holy: { weakness: 'shadow', strength: 'undead', modifier: 0.7 },
            shadow: { weakness: 'holy', strength: 'poison', modifier: 0.4 },
            undead: { weakness: 'holy', strength: 'shadow', modifier: 0.6 },
            neutral: { weakness: null, strength: null, modifier: 0 }
        };
    }

    calculateFinalDamage(skill, target, scaledValues) {
        // Get base values from scaling system
        const {
            value: baseValue = 0,
            critChance = 0,
            critMultiplier = 1.5,
            magicPenetration = 0,
            healingPower = 0
        } = scaledValues;

        // Calculate type multiplier
        const typeMultiplier = this.getTypeMultiplier(skill.type);

        // Calculate elemental effectiveness
        const elementalMultiplier = this.calculateElementalMultiplier(
            skill.element,
            target.element || 'neutral'
        );

        // Calculate range multiplier
        const rangeMultiplier = this.getRangeMultiplier(skill.range);

        // Calculate shape multiplier
        const shapeMultiplier = this.getShapeMultiplier(skill.shape);

        // Calculate critical hit
        const isCritical = Math.random() < critChance;
        const criticalMultiplier = isCritical ? critMultiplier : 1;

        // Calculate duration modifier
        const durationModifier = this.getDurationModifier(skill.effectDuration);

        // Calculate final damage
        let finalDamage = baseValue
            * typeMultiplier
            * elementalMultiplier
            * rangeMultiplier
            * shapeMultiplier
            * criticalMultiplier
            * durationModifier;

        // Apply target's defense/resistance
        if (skill.type === 'magical' || skill.element !== 'neutral') {
            finalDamage *= (1 - (target.magicResist || 0) * (1 - magicPenetration));
        } else {
            finalDamage *= (1 - (target.physicalDefense || 0));
        }

        // Round the final damage
        finalDamage = Math.round(finalDamage);

        return {
            damage: finalDamage,
            isCritical,
            elementalEffectiveness: this.getElementalEffectiveness(elementalMultiplier),
            healingAmount: skill.type === 'heal' ? finalDamage + healingPower : 0
        };
    }

    getTypeMultiplier(type) {
        const typeMultipliers = {
            damage: 1.0,
            heal: 0.8,
            shield: 0.6,
            buff: 0.4,
            debuff: 0.5,
            crowdControl: 0.3,
            summon: 0.7,
            dodge: 0,
            teleport: 0
        };
        return typeMultipliers[type] || 1.0;
    }

    calculateElementalMultiplier(skillElement, targetElement) {
        const elementInfo = this.elementalModifiers[skillElement.toLowerCase()];
        if (!elementInfo) return 1.0;

        if (targetElement.toLowerCase() === elementInfo.weakness) {
            return 1 + elementInfo.modifier; // Weakness: increased damage
        } else if (targetElement.toLowerCase() === elementInfo.strength) {
            return 1 - elementInfo.modifier; // Resistance: reduced damage
        }
        return 1.0; // Neutral effectiveness
    }

    getRangeMultiplier(range) {
        const rangeMultipliers = {
            melee: 1.2,    // Melee does more damage but requires close range
            ranged: 1.0    // Ranged is baseline damage
        };
        return rangeMultipliers[range.toLowerCase()] || 1.0;
    }

    getShapeMultiplier(shape) {
        const shapeMultipliers = {
            'single target': 1.0,
            'cone': 0.8,
            'circle': 0.7,
            'line': 0.9
        };
        return shapeMultipliers[shape.toLowerCase()] || 1.0;
    }

    getDurationModifier(duration) {
        const durationModifiers = {
            instant: 1.0,
            bursted: 1.2,
            short: 0.4,
            medium: 0.3,
            long: 0.2,
            permanent: 0.1,
            channeled: 0.15,
            toggled: 0.2,
            passive: 0.05
        };
        return durationModifiers[duration.toLowerCase()] || 1.0;
    }

    getElementalEffectiveness(multiplier) {
        if (multiplier > 1.0) return 'super effective';
        if (multiplier < 1.0) return 'not very effective';
        return 'neutral';
    }

    // Helper method to create damage number display
    createDamageNumber(damage, isCritical, elementalEffectiveness, x, y) {
        const damageEl = document.createElement('div');
        damageEl.className = `damage-number ${isCritical ? 'critical' : ''} ${elementalEffectiveness}`;
        damageEl.textContent = Math.round(damage);
        damageEl.style.left = `${x}px`;
        damageEl.style.top = `${y}px`;
        
        document.getElementById('game-container').appendChild(damageEl);
        
        // Animate and remove
        setTimeout(() => {
            damageEl.remove();
        }, 1000);
    }
} 