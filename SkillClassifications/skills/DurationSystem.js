export class DurationSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.activeEffects = new Map();
        this.durations = {
            passive: -1,  // Runs continuously
            instant: 0,   // One-time effect
            short: 3000,  // 3 seconds
            medium: 6000, // 6 seconds
            long: 10000,  // 10 seconds
            permanent: Infinity,
            toggled: null,    // Managed by toggle state
            channeled: null,  // Managed by channel state
            bursted: 500     // 0.5 second burst
        };
    }

    applyDuration(skill, effect) {
        const durationType = skill.effectDuration.toLowerCase();
        const duration = this.durations[durationType];

        switch (durationType) {
            case 'passive':
                this.handlePassive(skill, effect);
                break;
            case 'instant':
                this.handleInstant(skill, effect);
                break;
            case 'toggled':
                this.handleToggled(skill, effect);
                break;
            case 'channeled':
                this.handleChanneled(skill, effect);
                break;
            case 'bursted':
                this.handleBursted(skill, effect);
                break;
            default:
                // Handle timed durations (short, medium, long, permanent)
                if (duration) {
                    this.handleTimed(skill, effect, duration);
                }
        }
    }

    handlePassive(skill, effect) {
        const effectId = `${skill.name}_passive`;
        this.activeEffects.set(effectId, {
            effect,
            skill,
            type: 'passive',
            startTime: Date.now()
        });
    }

    handleInstant(skill, effect) {
        effect();  // Execute immediately
    }

    handleToggled(skill, effect) {
        const effectId = `${skill.name}_toggled`;
        if (this.activeEffects.has(effectId)) {
            // Turn off
            const activeEffect = this.activeEffects.get(effectId);
            if (activeEffect.cleanup) activeEffect.cleanup();
            this.activeEffects.delete(effectId);
        } else {
            // Turn on
            this.activeEffects.set(effectId, {
                effect,
                skill,
                type: 'toggled',
                startTime: Date.now(),
                cleanup: effect.cleanup
            });
            effect.start();
        }
    }

    handleChanneled(skill, effect) {
        const effectId = `${skill.name}_channeled`;
        const channelEffect = {
            effect,
            skill,
            type: 'channeled',
            startTime: Date.now(),
            interval: setInterval(() => {
                effect.tick();
            }, 100)  // Tick every 100ms
        };

        this.activeEffects.set(effectId, channelEffect);

        // Setup channel end on key up
        const endChannel = () => {
            if (this.activeEffects.has(effectId)) {
                clearInterval(channelEffect.interval);
                if (effect.cleanup) effect.cleanup();
                this.activeEffects.delete(effectId);
                document.removeEventListener('keyup', endChannel);
            }
        };

        document.addEventListener('keyup', endChannel);
    }

    handleBursted(skill, effect) {
        effect.start();
        setTimeout(() => {
            if (effect.cleanup) effect.cleanup();
        }, this.durations.bursted);
    }

    handleTimed(skill, effect, duration) {
        const effectId = `${skill.name}_timed`;
        
        // Start the effect
        effect.start();

        // Set up cleanup
        const timeout = setTimeout(() => {
            if (effect.cleanup) effect.cleanup();
            this.activeEffects.delete(effectId);
        }, duration);

        // Store the effect
        this.activeEffects.set(effectId, {
            effect,
            skill,
            type: 'timed',
            startTime: Date.now(),
            duration,
            timeout
        });
    }

    // Cleanup method for when switching skills or ending the game
    cleanup() {
        for (const [effectId, activeEffect] of this.activeEffects) {
            if (activeEffect.cleanup) activeEffect.cleanup();
            if (activeEffect.interval) clearInterval(activeEffect.interval);
            if (activeEffect.timeout) clearTimeout(activeEffect.timeout);
        }
        this.activeEffects.clear();
    }
} 