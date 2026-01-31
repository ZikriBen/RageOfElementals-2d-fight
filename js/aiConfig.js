// AI Difficulty Configuration
// Defines parameters for Easy, Medium, and Hard difficulty levels

const AI_DIFFICULTY = {
    easy: {
        name: 'Easy',
        reactionDelay: 300,      // ms delay before AI makes decisions
        attackChance: 0.6,       // 60% attack accuracy/chance
        defendChance: 0.05,      // 5% chance to defend
        comboChance: 0,          // Never chains combos
        moveSpeed: 1.5,          // Slow movement
        specialAttackChance: 0.02, // Rare special attacks
        jumpChance: 0.02,        // Rarely jumps
        retreatHealthThreshold: 0.15, // Retreats at 15% health
        aggressiveHealthThreshold: 0.7, // Aggressive above 70% health
        optimalDistance: 150,    // Preferred fighting distance
        stateChangeChance: 0.1,  // Low chance to change states
        counterAttackChance: 0.05, // Rarely counter-attacks
        airAttackChance: 0.1,    // Low air attack usage
    },
    medium: {
        name: 'Normal',
        reactionDelay: 150,      // Faster reactions
        attackChance: 0.8,       // 80% attack accuracy
        defendChance: 0.15,      // 15% defend chance
        comboChance: 0.3,        // Sometimes chains combos
        moveSpeed: 2,            // Normal speed
        specialAttackChance: 0.08, // Moderate special attacks
        jumpChance: 0.06,        // Normal jumping
        retreatHealthThreshold: 0.25, // Retreats at 25% health
        aggressiveHealthThreshold: 0.6, // Aggressive above 60% health
        optimalDistance: 120,    // Closer fighting distance
        stateChangeChance: 0.2,  // Moderate state changes
        counterAttackChance: 0.15, // Sometimes counter-attacks
        airAttackChance: 0.25,   // Moderate air attack usage
    },
    hard: {
        name: 'Hard',
        reactionDelay: 50,       // Near-instant reactions
        attackChance: 0.95,      // 95% attack accuracy
        defendChance: 0.30,      // 30% defend chance
        comboChance: 0.6,        // Frequently chains combos
        moveSpeed: 3,            // Fast movement
        specialAttackChance: 0.15, // Strategic special attacks
        jumpChance: 0.1,         // Tactical jumping
        retreatHealthThreshold: 0.3, // Retreats at 30% health
        aggressiveHealthThreshold: 0.5, // More balanced aggression
        optimalDistance: 100,    // Close combat preferred
        stateChangeChance: 0.3,  // Frequent state changes
        counterAttackChance: 0.35, // Often counter-attacks
        airAttackChance: 0.4,    // High air attack usage
    }
};

// AI States
const AI_STATE = {
    AGGRESSIVE: 'aggressive',
    DEFENSIVE: 'defensive',
    NEUTRAL: 'neutral',
    RETREATING: 'retreating'
};

// Global AI difficulty setting (default to medium)
let aiDifficulty = 'medium';

// Helper function to get current difficulty config
function getAIDifficultyConfig() {
    return AI_DIFFICULTY[aiDifficulty] || AI_DIFFICULTY.medium;
}
