import { GeneratedSkill } from './GeneratedSkill.js';

export class AISystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.DEBUG = true;
        this.OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate';
        this.MODEL = 'llama2';
        this.generatedSkill = new GeneratedSkill();
        this.SYSTEM_PROMPT = `You are an expert game designer specializing in RPG combat systems. Analyze the following skill description and categorize it according to these categories:

1. Name - Create a concise, thematic name (max 3 words) that reflects the skill's essence
2. Range - Choose one: Melee, Ranged
3. Element - Choose one: Neutral, Fire, Water, Wind, Earth, Poison, Holy, Shadow, Undead
4. Type - Choose one: Damage, Heal, Shield, Buff, Debuff, Crowd Control, Summon, Dodge, Teleport
5. Shape - Choose one: Single Target, Cone, Line, Circle
6. Effect Duration - Choose one: Passive, Instant, Short, Medium, Long, Permanent, Toggled, Channeled, Bursted
7. Scales With - Choose one: STR, DEX, AGI, HP, LUK
8. Sp cost - Choose between: 10 to 50

Respond ONLY with the numbered list of choices in the exact format:
1. Name - [your choice]
2. Range - [your choice]
3. Element - [your choice]
4. Type - [your choice]
5. Shape - [your choice]
6. Effect Duration - [your choice]
7. Scales With - [your choice]
8. Sp Cost - [your choice]`;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAnalysisButton();
            });
        } else {
            this.setupAnalysisButton();
        }
    }

    displayResult(result, type = 'normal') {
        const resultDisplay = document.getElementById('result-display');
        if (!resultDisplay) return;

        resultDisplay.innerHTML = '';
        resultDisplay.style.display = 'block';

        if (type === 'error') {
            resultDisplay.innerHTML = `<div class="error-message">${result}</div>`;
            return;
        }

        if (type === 'raw') {
            resultDisplay.innerHTML = `
                <div class="raw-response">
                    <div class="raw-header">Raw AI Response:</div>
                    <pre>${result}</pre>
                </div>`;
            return;
        }

        const skillInfo = document.createElement('div');
        skillInfo.className = 'skill-info';
        skillInfo.innerHTML = this.generatedSkill.generateTooltipHTML();
        resultDisplay.appendChild(skillInfo);
    }

    setupAnalysisButton() {
        const analyzeBtn = document.getElementById('analyze-btn');
        if (!analyzeBtn) return;

        analyzeBtn.addEventListener('click', async () => {
            try {
                const prompt = document.getElementById('prompt-input').value;
                if (!prompt.trim()) {
                    this.displayResult('Please enter a skill description', 'error');
                    return;
                }

                analyzeBtn.disabled = true;
                analyzeBtn.textContent = 'Analyzing...';
                
                const result = await this.analyzePrompt(prompt);
                this.displayResult(result);
            } catch (error) {
                this.displayResult('Failed to analyze skill. Please try again.', 'error');
            } finally {
                analyzeBtn.disabled = false;
                analyzeBtn.textContent = 'Analyze with AI';
            }
        });
    }

    async analyzePrompt(prompt) {
        try {
            const response = await fetch(this.OLLAMA_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    prompt: `${this.SYSTEM_PROMPT}\n\nSkill to analyze: ${prompt}`,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error('Failed to connect to AI');
            }

            const data = await response.json();
            const skill = this.generatedSkill.updateSkill(data.response);
            const currentSlot = this.gameState.skillManager.getCurrentSlot();
            this.gameState.skillManager.setSkill(currentSlot, skill);
            return skill;
        } catch (error) {
            if (this.DEBUG) {
                const mockResponse = `1. Name - Fireball
2. Range - Ranged
3. Element - Fire
4. Type - Damage
5. Shape - Circle
6. Effect Duration - Instant
7. Scales With - AGI
8. Sp Cost - 30`;
                const skill = this.generatedSkill.updateSkill(mockResponse);
                const currentSlot = this.gameState.skillManager.getCurrentSlot();
                this.gameState.skillManager.setSkill(currentSlot, skill);
                return skill;
            }
            throw error;
        }
    }
} 