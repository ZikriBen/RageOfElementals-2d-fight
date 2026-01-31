// New AI Brain with State Machine
// Replaces the old random-based enemyAI function

class EnemyAI {
    constructor() {
        this.state = AI_STATE.NEUTRAL;
        this.lastDecisionTime = 0;
        this.comboState = 0; // 0 = none, 1 = attack1, 2 = attack2, 3 = sp_attack1
        this.playerActionHistory = []; // Track player's recent actions (for hard mode)
        this.maxHistoryLength = 10;
        this.targetPosition = null;
        this.config = null;
    }

    // Initialize/reset with current difficulty
    init() {
        this.config = getAIDifficultyConfig();
        this.state = AI_STATE.NEUTRAL;
        this.lastDecisionTime = 0;
        this.comboState = 0;
        this.playerActionHistory = [];
    }

    // Main update function - called every frame
    update(player, enemy, deltaTime) {
        if (!enemyAIOn || !this.config) {
            enemy.velocity.x = 0;
            enemy.switchSprite('idle');
            return;
        }

        const currentTime = performance.now();

        // Check if enough time has passed since last decision (reaction delay)
        if (currentTime - this.lastDecisionTime < this.config.reactionDelay) {
            // Continue current action but don't make new decisions
            this.continueCurrentAction(enemy);
            return;
        }

        this.lastDecisionTime = currentTime;

        // Track player actions (for pattern recognition in hard mode)
        this.trackPlayerAction(player);

        // Evaluate and potentially change state
        this.evaluateState(player, enemy);

        // Execute behavior based on current state
        this.executeBehavior(player, enemy);
    }

    // Track player's recent actions for pattern recognition
    trackPlayerAction(player) {
        if (player.isAttcking || player.animationName.includes('attack')) {
            this.playerActionHistory.push({
                action: player.animationName,
                time: performance.now()
            });

            // Keep history limited
            if (this.playerActionHistory.length > this.maxHistoryLength) {
                this.playerActionHistory.shift();
            }
        }
    }

    // Check if player is currently attacking
    isPlayerAttacking(player) {
        return player.isAttcking ||
               player.animationName === 'attack1' ||
               player.animationName === 'attack2' ||
               player.animationName === 'sp_attack1' ||
               player.animationName === 'sp_attack2' ||
               player.animationName === 'air_attack';
    }

    // Calculate distance between fighters
    getDistance(player, enemy) {
        return Math.abs(player.position.x - enemy.position.x);
    }

    // Determine which direction enemy should face
    getFacingDirection(player, enemy) {
        return player.position.x > enemy.position.x ? 'right' : 'left';
    }

    // Evaluate and update AI state based on conditions
    evaluateState(player, enemy) {
        const healthPercent = enemy.health / 100;
        const distance = this.getDistance(player, enemy);
        const playerHealthPercent = player.health / 100;

        // State transition logic (no retreating)
        if (healthPercent >= this.config.aggressiveHealthThreshold &&
                   playerHealthPercent < 0.5) {
            // High health and player is hurt - be aggressive
            if (Math.random() < this.config.stateChangeChance * 2) {
                this.state = AI_STATE.AGGRESSIVE;
            }
        } else if (this.isPlayerAttacking(player)) {
            // Player is attacking - defensive opportunity
            if (Math.random() < this.config.stateChangeChance) {
                this.state = AI_STATE.DEFENSIVE;
            }
        } else if (distance < this.config.optimalDistance) {
            // Close range - be aggressive or defensive
            if (Math.random() < 0.6) {
                this.state = AI_STATE.AGGRESSIVE;
            } else {
                this.state = AI_STATE.DEFENSIVE;
            }
        } else {
            // Default to neutral with chance to change
            if (Math.random() < this.config.stateChangeChance) {
                const rand = Math.random();
                if (rand < 0.5) {
                    this.state = AI_STATE.AGGRESSIVE;
                } else if (rand < 0.7) {
                    this.state = AI_STATE.DEFENSIVE;
                } else {
                    this.state = AI_STATE.NEUTRAL;
                }
            }
        }
    }

    // Execute behavior based on current state
    executeBehavior(player, enemy) {
        switch (this.state) {
            case AI_STATE.AGGRESSIVE:
                this.aggressiveBehavior(player, enemy);
                break;
            case AI_STATE.DEFENSIVE:
                this.defensiveBehavior(player, enemy);
                break;
            case AI_STATE.NEUTRAL:
            default:
                this.neutralBehavior(player, enemy);
                break;
        }
    }

    // Aggressive state: pursue and attack, use combos
    aggressiveBehavior(player, enemy) {
        const distance = this.getDistance(player, enemy);
        const direction = this.getFacingDirection(player, enemy);
        enemy.facing = direction;

        // Close enough to attack
        if (rectCollision(player, enemy) || distance < 80) {
            enemy.velocity.x = 0;

            // Handle combo chains
            if (this.comboState > 0 && this.config.comboChance > 0) {
                this.executeCombo(enemy);
                return;
            }

            // Try special attack if has mana
            if (enemy.mana >= 50 && Math.random() < this.config.specialAttackChance) {
                _doActionNoSpam(enemy, 'sp_attack2');
                return;
            }

            // Regular attack with accuracy check
            if (Math.random() < this.config.attackChance) {
                if (enemy.velocity.y !== 0 && Math.random() < this.config.airAttackChance) {
                    _doActionNoSpam(enemy, 'air_attack');
                } else {
                    _doActionNoSpam(enemy, 'attack1', 80);
                    // Start combo chain
                    if (Math.random() < this.config.comboChance) {
                        this.comboState = 1;
                    }
                }
            } else {
                enemy.switchSprite('idle');
            }
        } else {
            // Chase player
            this.moveTowardsPlayer(player, enemy, direction);

            // Jump if player is in air or to close distance
            if (player.velocity.y !== 0 || Math.random() < this.config.jumpChance) {
                if (enemy.velocity.y === 0) {
                    enemy.jump(-12);
                    enemy.switchSprite('jump');
                }
            }
        }
    }

    // Defensive state: keep distance, wait for openings, defend/roll
    defensiveBehavior(player, enemy) {
        const distance = this.getDistance(player, enemy);
        const direction = this.getFacingDirection(player, enemy);
        enemy.facing = direction;

        // Player is attacking - try to defend or counter
        if (this.isPlayerAttacking(player) && player.currentFrame < 2) {
            if (Math.random() < this.config.defendChance) {
                enemy.defend();
                return;
            } else if (Math.random() < this.config.counterAttackChance && distance < 100) {
                // Counter attack opportunity
                _doActionNoSpam(enemy, 'attack1', 60);
                return;
            }
        }

        // Maintain optimal distance
        if (distance < this.config.optimalDistance * 0.7) {
            // Too close - back away
            this.moveAwayFromPlayer(player, enemy);
        } else if (distance > this.config.optimalDistance * 1.3) {
            // Too far - approach carefully
            this.moveTowardsPlayer(player, enemy, direction, 0.5);
        } else {
            // Good distance - wait and watch
            enemy.velocity.x = 0;
            enemy.switchSprite('idle');

            // Occasional attack when in range
            if (rectCollision(player, enemy) && Math.random() < this.config.attackChance * 0.5) {
                _doActionNoSpam(enemy, 'attack1', 100);
            }
        }
    }

    // Neutral state: balanced approach
    neutralBehavior(player, enemy) {
        const distance = this.getDistance(player, enemy);
        const direction = this.getFacingDirection(player, enemy);
        enemy.facing = direction;

        // Close range combat
        if (rectCollision(player, enemy) || distance < 90) {
            enemy.velocity.x = 0;

            // Defend against incoming attacks
            if (this.isPlayerAttacking(player) && player.currentFrame < 2) {
                if (Math.random() < this.config.defendChance) {
                    enemy.defend();
                    return;
                }
            }

            // Attack with moderate frequency
            if (Math.random() < this.config.attackChance * 0.7) {
                if (enemy.velocity.y !== 0 && Math.random() < this.config.airAttackChance) {
                    _doActionNoSpam(enemy, 'air_attack');
                } else {
                    _doActionNoSpam(enemy, 'attack1', 80);
                    if (Math.random() < this.config.comboChance * 0.5) {
                        this.comboState = 1;
                    }
                }
            } else {
                enemy.switchSprite('idle');
            }
        } else {
            // Move towards player at normal pace
            this.moveTowardsPlayer(player, enemy, direction);

            // Random jumping
            if (Math.random() < this.config.jumpChance) {
                if (player.velocity.y !== 0 || Math.random() < 0.3) {
                    if (enemy.velocity.y === 0) {
                        enemy.jump(-12);
                        enemy.switchSprite('jump');
                    }
                }
            }
        }
    }

    // Execute combo attacks
    executeCombo(enemy) {
        switch (this.comboState) {
            case 1:
                // After attack1, try attack2
                if (enemy.animationName === 'attack1' && enemy.currentFrame >= enemy.attackFrame) {
                    _doActionNoSpam(enemy, 'attack2');
                    this.comboState = 2;
                }
                break;
            case 2:
                // After attack2, try sp_attack1
                if (enemy.animationName === 'attack2' && enemy.currentFrame >= enemy.attackFrame) {
                    if (Math.random() < this.config.comboChance) {
                        _doActionNoSpam(enemy, 'sp_attack1');
                        this.comboState = 3;
                    } else {
                        this.comboState = 0;
                    }
                }
                break;
            case 3:
                // Combo complete
                if (enemy.animationName !== 'sp_attack1') {
                    this.comboState = 0;
                }
                break;
            default:
                this.comboState = 0;
        }
    }

    // Move towards player
    moveTowardsPlayer(player, enemy, direction, speedMod = 1) {
        const moveDir = direction === 'right' ? 1 : -1;
        enemy.velocity.x = moveDir * this.config.moveSpeed * speedMod;
        enemy.switchSprite('run');
    }

    // Move away from player
    moveAwayFromPlayer(player, enemy) {
        const direction = this.getFacingDirection(player, enemy);
        const moveDir = direction === 'right' ? -1 : 1;
        enemy.velocity.x = moveDir * this.config.moveSpeed * 0.8;
        enemy.switchSprite('run');
    }

    // Continue current action without making new decisions
    continueCurrentAction(enemy) {
        // Handle ongoing combos
        if (this.comboState > 0 && this.config.comboChance > 0) {
            this.executeCombo(enemy);
        }
    }
}

// Global AI instance
const enemyAIBrain = new EnemyAI();

// New enemyAI function that uses the AI brain
function enemyAI() {
    if (player && enemy) {
        enemyAIBrain.update(player, enemy, 16); // Assuming ~60fps = 16ms per frame
    }
}
