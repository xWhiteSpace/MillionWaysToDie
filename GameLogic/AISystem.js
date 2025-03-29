export class AISystem {
    constructor(gameState) {
        this.gameState = gameState;
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

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnalysisButton());
        } else {
            this.setupAnalysisButton();
        }
    }

    setupAnalysisButton() {
        const analyzeBtn = document.getElementById('analyze-btn');
        if (!analyzeBtn) {
            console.error('Analyze button not found!');
            return;
        }

        analyzeBtn.addEventListener('click', async () => {
            const prompt = document.getElementById('prompt-input').value;
            const result = await this.analyzePrompt(prompt);
            const resultDisplay = document.getElementById('result-display');
            resultDisplay.style.display = 'block';
            resultDisplay.innerHTML = Object.entries(result)
                .map(([key, value]) => `${key}: ${value}`)
                .join('<br>');
            
            this.gameState.currentSkill = result;
        });
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