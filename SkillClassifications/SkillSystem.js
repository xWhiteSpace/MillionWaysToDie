import { RangeSystem } from '../SkillClassifications/skills/RangeSystem.js';
import { ElementSystem } from '../SkillClassifications/skills/ElementSystem.js';
import { TypeSystem } from '../SkillClassifications/skills/TypeSystem.js';
import { ShapeSystem } from '../SkillClassifications/skills/ShapeSystem.js';
import { DurationSystem } from '../SkillClassifications/skills/DurationSystem.js';
import { ScalingSystem } from '../SkillClassifications/skills/ScalingSystem.js';
import { SPCostSystem } from '../SkillClassifications/skills/SPCostSystem.js';

export class SkillSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.rangeSystem = new RangeSystem(gameState);
        this.elementSystem = new ElementSystem(gameState);
        this.typeSystem = new TypeSystem(gameState);
        this.shapeSystem = new ShapeSystem(gameState);
        this.durationSystem = new DurationSystem(gameState);
        this.scalingSystem = new ScalingSystem(gameState);
        this.spCostSystem = new SPCostSystem(gameState);
    }

    executeSkill(skill) {
        if (!skill) return;

        // Check if we have enough SP to use the skill
        if (!this.spCostSystem.canUseSkill(skill)) {
            console.log('Not enough SP to use skill');
            return;
        }

        const { shape, element, type, effectDuration, scalesWith } = skill;
        const baseValue = 100; // Base value for scaling calculations

        // Calculate scaled value based on stats
        const scaledValue = this.scalingSystem.calculateScaling(skill, baseValue);

        // Apply shape modifiers first
        this.shapeSystem.applyShape(shape);

        // Execute the skill based on range
        this.rangeSystem.execute(skill);

        // Apply elemental effects
        this.elementSystem.applyElement(element);

        // Create the effect object with scaled values
        const effect = {
            value: typeof scaledValue === 'object' ? scaledValue.value : scaledValue,
            speed: scaledValue.speed,
            critChance: scaledValue.critChance,
            critMultiplier: scaledValue.critMultiplier,
            cooldownReduction: scaledValue.cooldownReduction,
            start: () => this.typeSystem.applyType(type),
            cleanup: () => this.cleanupEffect(skill),
            tick: () => this.typeSystem.applyType(type) // For channeled skills
        };

        // Apply duration system
        this.durationSystem.applyDuration(skill, effect);

        // Consume SP
        this.spCostSystem.consumeSP(skill);
    }

    cleanupEffect(skill) {
        // Cleanup logic for when effects end
        console.log(`Cleaning up effect for ${skill.name}`);
    }
} 