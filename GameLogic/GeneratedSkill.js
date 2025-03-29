export class GeneratedSkill {
    constructor() {
        this.currentSkill = null;
        this.subscribers = new Set();
    }

    // Parse the AI response into a structured skill object
    parseAIResponse(response) {
        const lines = response.split('\n');
        const result = {};
        
        const categoryMap = {
            '1': 'name',
            '2': 'range',
            '3': 'element',
            '4': 'type',
            '5': 'shape',
            '6': 'effectDuration',
            '7': 'scalesWith',
            '8': 'spCost'
        };

        for (const line of lines) {
            const match = line.match(/^(\d)\.\s*([\w\s]+?)\s*-\s*(.+)$/);
            if (match) {
                const [, number, category, value] = match;
                if (categoryMap[number]) {
                    result[categoryMap[number]] = value.trim();
                }
            }
        }

        result.id = 'skill_' + Date.now();
        return result;
    }

    // Update the current skill and notify subscribers
    updateSkill(aiResponse) {
        this.currentSkill = this.parseAIResponse(aiResponse);
        this.notifySubscribers();
        return this.currentSkill;
    }

    // Get current skill data
    getCurrentSkill() {
        return this.currentSkill;
    }

    // Subscribe to skill updates
    subscribe(callback) {
        this.subscribers.add(callback);
    }

    // Unsubscribe from skill updates
    unsubscribe(callback) {
        this.subscribers.delete(callback);
    }

    // Notify all subscribers of skill updates
    notifySubscribers() {
        for (const callback of this.subscribers) {
            callback(this.currentSkill);
        }
    }

    // Generate tooltip HTML for the skill
    generateTooltipHTML() {
        if (!this.currentSkill) {
            return '<div class="tooltip-content">No skill generated yet</div>';
        }

        return `
            <div class="tooltip-content">
                <div class="tooltip-header">${this.currentSkill.name || 'Unknown Skill'}</div>
                <div class="tooltip-stats">
                    <div class="tooltip-row">
                        <span class="tooltip-label">Range:</span>
                        <span class="tooltip-value ${this.currentSkill.range?.toLowerCase()}">${this.currentSkill.range || '---'}</span>
                    </div>
                    <div class="tooltip-row">
                        <span class="tooltip-label">Element:</span>
                        <span class="tooltip-value ${this.currentSkill.element?.toLowerCase()}">${this.currentSkill.element || '---'}</span>
                    </div>
                    <div class="tooltip-row">
                        <span class="tooltip-label">Type:</span>
                        <span class="tooltip-value">${this.currentSkill.type || '---'}</span>
                    </div>
                    <div class="tooltip-row">
                        <span class="tooltip-label">Shape:</span>
                        <span class="tooltip-value">${this.currentSkill.shape || '---'}</span>
                    </div>
                    <div class="tooltip-row">
                        <span class="tooltip-label">Duration:</span>
                        <span class="tooltip-value">${this.currentSkill.effectDuration || '---'}</span>
                    </div>
                    <div class="tooltip-row">
                        <span class="tooltip-label">Scales With:</span>
                        <span class="tooltip-value">${this.currentSkill.scalesWith || '---'}</span>
                    </div>
                    <div class="tooltip-row">
                        <span class="tooltip-label">SP Cost:</span>
                        <span class="tooltip-value">${this.currentSkill.spCost || '---'}</span>
                    </div>
                </div>
            </div>
        `;
    }
} 