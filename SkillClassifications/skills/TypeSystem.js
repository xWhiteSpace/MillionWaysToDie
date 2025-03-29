export class TypeSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.typeHandlers = {
            damage: this.handleDamage.bind(this),
            heal: this.handleHeal.bind(this),
            shield: this.handleShield.bind(this),
            buff: this.handleBuff.bind(this),
            debuff: this.handleDebuff.bind(this),
            'crowd control': this.handleCrowdControl.bind(this),
            summon: this.handleSummon.bind(this),
            dodge: this.handleDodge.bind(this),
            teleport: this.handleTeleport.bind(this)
        };
    }

    applyType(type) {
        const handler = this.typeHandlers[type.toLowerCase()];
        if (handler) {
            handler();
        }
    }

    handleDamage() {
        const damage = Math.floor(Math.random() * 20) + 10;
        this.showDamageNumber(damage);
    }

    handleHeal() {
        const heal = Math.floor(Math.random() * 15) + 5;
        this.showHealNumber(heal);
    }

    handleShield() {
        const shield = document.createElement('div');
        shield.className = 'shield-barrier';
        shield.style.transform = `translate(${this.gameState.player.x}px, ${this.gameState.player.y}px)`;
        document.getElementById('game-container').appendChild(shield);
        
        setTimeout(() => shield.remove(), 10000);
    }

    handleBuff() {
        const buff = document.createElement('div');
        buff.className = 'buff-effect';
        buff.style.transform = `translate(${this.gameState.player.x}px, ${this.gameState.player.y}px)`;
        document.getElementById('game-container').appendChild(buff);
        
        setTimeout(() => buff.remove(), 500);
    }

    handleDebuff() {
        const debuff = document.createElement('div');
        debuff.className = 'debuff-effect';
        debuff.style.transform = `translate(${this.gameState.player.x}px, ${this.gameState.player.y}px)`;
        document.getElementById('game-container').appendChild(debuff);
        
        setTimeout(() => debuff.remove(), 500);
    }

    handleCrowdControl() {
        const cc = document.createElement('div');
        cc.className = 'cc-effect';
        cc.style.transform = `translate(${this.gameState.player.x}px, ${this.gameState.player.y}px)`;
        document.getElementById('game-container').appendChild(cc);
        
        setTimeout(() => cc.remove(), 500);
    }

    handleSummon() {
        const clone = document.createElement('div');
        clone.className = 'player-clone';
        clone.style.width = '30px';
        clone.style.height = '30px';
        clone.style.transform = `translate(${this.gameState.player.x + 40}px, ${this.gameState.player.y}px)`;
        document.getElementById('game-container').appendChild(clone);

        const summonEffect = document.createElement('div');
        summonEffect.className = 'summon-effect';
        summonEffect.style.transform = `translate(${this.gameState.player.x + 40}px, ${this.gameState.player.y}px)`;
        document.getElementById('game-container').appendChild(summonEffect);

        setTimeout(() => {
            clone.remove();
            summonEffect.remove();
        }, 15000);
    }

    handleDodge() {
        const player = this.gameState.player.element;
        player.style.opacity = '0.5';
        
        const dodge = document.createElement('div');
        dodge.className = 'dodge-effect';
        dodge.style.transform = `translate(${this.gameState.player.x}px, ${this.gameState.player.y}px)`;
        document.getElementById('game-container').appendChild(dodge);

        setTimeout(() => {
            player.style.opacity = '1';
            dodge.remove();
        }, 2000);
    }

    handleTeleport() {
        const { player, mouseX, mouseY } = this.gameState;
        const maxDistance = 200;
        
        // Calculate direction and distance
        const dx = mouseX - player.x;
        const dy = mouseY - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Limit teleport distance
        const actualDistance = Math.min(distance, maxDistance);
        const ratio = actualDistance / distance;
        
        // Create teleport trail
        const trail = document.createElement('div');
        trail.className = 'teleport-trail';
        trail.style.transform = `translate(${player.x}px, ${player.y}px)`;
        document.getElementById('game-container').appendChild(trail);

        // Update player position
        player.x += dx * ratio;
        player.y += dy * ratio;
        player.element.style.transform = `translate(${player.x}px, ${player.y}px)`;

        // Create teleport effect at destination
        const effect = document.createElement('div');
        effect.className = 'teleport-effect';
        effect.style.transform = `translate(${player.x}px, ${player.y}px)`;
        document.getElementById('game-container').appendChild(effect);

        setTimeout(() => {
            trail.remove();
            effect.remove();
        }, 300);
    }

    showDamageNumber(amount) {
        const text = document.createElement('div');
        text.className = 'damage-text';
        text.textContent = amount;
        text.style.transform = `translate(${this.gameState.player.x}px, ${this.gameState.player.y - 20}px)`;
        document.getElementById('game-container').appendChild(text);
        
        setTimeout(() => text.remove(), 1000);
    }

    showHealNumber(amount) {
        const text = document.createElement('div');
        text.className = 'heal-text';
        text.textContent = '+' + amount;
        text.style.transform = `translate(${this.gameState.player.x}px, ${this.gameState.player.y - 20}px)`;
        document.getElementById('game-container').appendChild(text);
        
        setTimeout(() => text.remove(), 1000);
    }
} 