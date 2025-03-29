export class AISystem {
    constructor() {
        // Mock skill templates
        this.mockSkills = [
            {
                id: 'skill_1',
                name: "Fireball",
                range: "Ranged",
                element: "Fire",
                type: "Damage",
                shape: "Single Target",
                effectDuration: "Bursted",
                scalesWith: "INT",
                spCost: 20,
                description: "A powerful fireball that deals fire damage"
            },
            {
                id: 'skill_2',
                name: "Ice Shield",
                range: "Melee",
                element: "Water",
                type: "Shield",
                shape: "Circle",
                effectDuration: "Medium",
                scalesWith: "INT",
                spCost: 30,
                description: "Creates a protective shield of ice"
            },
            {
                id: 'skill_3',
                name: "Wind Slash",
                range: "Melee",
                element: "Wind",
                type: "Damage",
                shape: "Cone",
                effectDuration: "Instant",
                scalesWith: "STR",
                spCost: 15,
                description: "A quick slashing attack imbued with wind"
            }
        ];
    }

    async analyzePrompt(prompt) {
        // For now, just return a random mock skill
        const randomSkill = this.mockSkills[Math.floor(Math.random() * this.mockSkills.length)];
        return {
            ...randomSkill,
            id: 'skill_' + Date.now() // Ensure unique ID per skill creation
        };
    }
} 