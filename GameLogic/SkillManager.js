export class SkillManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.skills = {
            1: null,
            2: null,
            3: null,
            4: null
        };
        this.keyBindings = {
            1: '1',
            2: '2',
            3: '3',
            4: '4'
        };
        this.selectedSlot = '1'; // Default selected slot
        this.isRebinding = false; // Track if we're currently rebinding a key
        this.rebindingSlot = null; // Which slot is being rebound
        this.reservedKeys = ['w', 'a', 's', 'd']; // Movement keys that can't be bound
        this.setupSkillButtons();
        this.setupKeyBindingSystem();
    }

    setupSkillButtons() {
        const slots = ['1', '2', '3', '4'];
        slots.forEach(slot => {
            const button = document.getElementById(`skill-${slot}-button`);
            if (!button) return;

            // Update key text
            const keyText = button.querySelector('.key-text');
            if (keyText) {
                keyText.textContent = this.keyBindings[slot];
            }

            // Setup hover events for tooltip
            const tooltip = button.querySelector('.skill-tooltip');
            if (tooltip) {
                button.addEventListener('mouseenter', () => {
                    tooltip.innerHTML = this.generateTooltipHTML(this.skills[slot]);
                    tooltip.style.display = 'block';
                });

                button.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                });
            }

            // Setup click event for slot selection
            button.addEventListener('click', () => {
                this.selectSlot(slot);
            });
        });
    }

    setupKeyBindingSystem() {
        // Add right-click handler for rebinding
        const slots = ['1', '2', '3', '4'];
        slots.forEach(slot => {
            const button = document.getElementById(`skill-${slot}-button`);
            if (!button) return;

            button.addEventListener('contextmenu', (e) => {
                e.preventDefault(); // Prevent context menu
                this.startRebinding(slot);
            });
        });

        // Add global key listener for skill execution and rebinding
        document.addEventListener('keydown', (e) => {
            // Check if prompt input is focused
            const promptInput = document.getElementById('prompt-input');
            if (promptInput && document.activeElement === promptInput) {
                return; // Don't handle skill keys when typing in prompt
            }

            // Check if the pressed key is bound to any skill
            const isKeyBound = Object.values(this.keyBindings)
                .some(binding => binding.toLowerCase() === e.key.toLowerCase());

            // Always prevent default for space to avoid scrolling
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
            }

            // Handle rebinding mode
            if (this.isRebinding) {
                e.preventDefault();
                const keyToUse = e.key === ' ' ? 'Space' : e.key;
                this.completeRebinding(keyToUse);
                return;
            }

            // Handle skill execution
            if (isKeyBound) {
                e.preventDefault();
                this.handleKeyPress(e.key === ' ' ? 'Space' : e.key);
            }
        }, true); // Use capture phase to handle before movement system
    }

    startRebinding(slot) {
        this.isRebinding = true;
        this.rebindingSlot = slot;
        const button = document.getElementById(`skill-${slot}-button`);
        if (button) {
            button.classList.add('rebinding');
            const keyText = button.querySelector('.key-text');
            if (keyText) {
                keyText.textContent = 'Press a key...';
            }
        }
    }

    completeRebinding(newKey) {
        if (!this.rebindingSlot || !this.isRebinding) return;

        // Check if the key is reserved (WASD)
        if (this.reservedKeys.includes(newKey.toLowerCase())) {
            // Show error state
            const button = document.getElementById(`skill-${this.rebindingSlot}-button`);
            if (button) {
                button.classList.remove('rebinding');
                button.classList.add('error');
                const keyText = button.querySelector('.key-text');
                if (keyText) {
                    keyText.textContent = this.keyBindings[this.rebindingSlot];
                }
                
                // Reset back to original key after showing error
                setTimeout(() => {
                    button.classList.remove('error');
                    const keyText = button.querySelector('.key-text');
                    if (keyText) {
                        keyText.textContent = this.keyBindings[this.rebindingSlot];
                    }
                }, 1000);
            }
            
            this.isRebinding = false;
            this.rebindingSlot = null;
            return;
        }

        // Check for key conflicts
        const conflictSlot = Object.entries(this.keyBindings)
            .find(([slot, key]) => key.toLowerCase() === newKey.toLowerCase())?.[0];

        if (conflictSlot) {
            // Swap bindings if there's a conflict
            const oldKey = this.keyBindings[this.rebindingSlot];
            this.setKeyBinding(conflictSlot, oldKey);
        }

        // Set new binding
        this.setKeyBinding(this.rebindingSlot, newKey);

        // Reset rebinding state
        const button = document.getElementById(`skill-${this.rebindingSlot}-button`);
        if (button) {
            button.classList.remove('rebinding');
        }
        this.isRebinding = false;
        this.rebindingSlot = null;
    }

    setKeyBinding(slot, key) {
        if (this.skills.hasOwnProperty(slot)) {
            this.keyBindings[slot] = key;
            const button = document.getElementById(`skill-${slot}-button`);
            if (button) {
                const keyText = button.querySelector('.key-text');
                if (keyText) {
                    keyText.textContent = key.toUpperCase();
                }
                // Update tooltip
                const tooltip = button.querySelector('.skill-tooltip');
                if (tooltip) {
                    tooltip.innerHTML = this.generateTooltipHTML(this.skills[slot]);
                }
            }
            // Save bindings to localStorage
            this.saveKeyBindings();
        }
    }

    saveKeyBindings() {
        try {
            localStorage.setItem('skillKeyBindings', JSON.stringify(this.keyBindings));
        } catch (e) {
            console.warn('Failed to save key bindings:', e);
        }
    }

    loadKeyBindings() {
        try {
            const saved = localStorage.getItem('skillKeyBindings');
            if (saved) {
                const bindings = JSON.parse(saved);
                Object.entries(bindings).forEach(([slot, key]) => {
                    this.setKeyBinding(slot, key);
                });
            }
        } catch (e) {
            console.warn('Failed to load key bindings:', e);
        }
    }

    getKeyForSlot(slot) {
        return this.keyBindings[slot];
    }

    handleKeyPress(key) {
        // Find which slot this key is bound to
        const slot = Object.entries(this.keyBindings)
            .find(([_, binding]) => binding.toLowerCase() === key.toLowerCase())?.[0];
        
        if (slot) {
            this.executeSkill(slot);
        }
    }

    selectSlot(slot) {
        this.selectedSlot = slot;
        // Update UI to show selected slot
        document.querySelectorAll('.skill-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        const button = document.getElementById(`skill-${slot}-button`);
        if (button) {
            button.classList.add('selected');
        }
    }

    findNextEmptySlot() {
        // Try to find the first empty slot
        for (let i = 1; i <= 4; i++) {
            if (!this.skills[i]) {
                return i.toString();
            }
        }
        // If no empty slots, return slot 1 (will overwrite)
        return '1';
    }

    setSkill(slot, skill) {
        if (this.skills.hasOwnProperty(slot)) {
            this.skills[slot] = skill;
            this.updateSkillButton(slot);
            
            // After setting the skill, automatically select next empty slot
            const nextSlot = this.findNextEmptySlot();
            this.selectSlot(nextSlot);
        }
    }

    updateSkillButton(slot) {
        const button = document.getElementById(`skill-${slot}-button`);
        if (!button) return;

        const tooltip = button.querySelector('.skill-tooltip');
        if (tooltip) {
            tooltip.innerHTML = this.generateTooltipHTML(this.skills[slot]);
        }

        // Update button appearance based on whether it has a skill
        if (this.skills[slot]) {
            button.classList.add('has-skill');
        } else {
            button.classList.remove('has-skill');
        }
    }

    executeSkill(slot) {
        const skill = this.skills[slot];
        if (!skill || this.gameState.skillCooldown) return;

        // Start cooldown
        this.gameState.skillCooldown = true;
        const button = document.getElementById(`skill-${slot}-button`);
        if (button) {
            button.classList.add('disabled');
        }

        // Display skill name
        this.displaySkillName(skill);

        // Execute skill using SkillSystem
        this.gameState.skillSystem.executeSkill(skill);

        // Reset cooldown after 1 second
        setTimeout(() => {
            this.gameState.skillCooldown = false;
            if (button) {
                button.classList.remove('disabled');
            }
        }, 1000);
    }

    displaySkillName(skill) {
        // Create floating text element
        const text = document.createElement('div');
        text.className = 'skill-name-display';
        text.textContent = skill.name;
        
        // Position near the player
        const { player } = this.gameState;
        text.style.transform = `translate(${player.x}px, ${player.y - 40}px)`;
        
        // Add to game container
        document.getElementById('game-container').appendChild(text);
        
        // Animate and remove
        requestAnimationFrame(() => {
            text.style.transform = `translate(${player.x}px, ${player.y - 80}px)`;
            text.style.opacity = '0';
        });
        
        setTimeout(() => text.remove(), 1000);
    }

    generateTooltipHTML(skill) {
        if (!skill) {
            return `
                <div class="empty-skill">
                    No skill assigned
                    <div class="binding-hint">Right-click to rebind key</div>
                </div>`;
        }

        return `
            <div class="skill-name">${skill.name}</div>
            <div class="skill-stats">
                <div class="stat"><span>Key:</span> ${this.keyBindings[this.selectedSlot]}</div>
                <div class="stat"><span>Range:</span> ${skill.range}</div>
                <div class="stat"><span>Element:</span> ${skill.element}</div>
                <div class="stat"><span>Type:</span> ${skill.type}</div>
                <div class="stat"><span>Shape:</span> ${skill.shape}</div>
                <div class="stat"><span>Duration:</span> ${skill.effectDuration}</div>
                <div class="stat"><span>Scales:</span> ${skill.scalesWith}</div>
                <div class="stat"><span>SP Cost:</span> ${skill.spCost}</div>
            </div>
            <div class="binding-hint">Right-click to rebind key</div>
        `;
    }

    getCurrentSlot() {
        return this.selectedSlot;
    }
} 