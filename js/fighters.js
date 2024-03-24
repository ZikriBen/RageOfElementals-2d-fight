const fireAnimationsStates = [
    {
        name: 'idle',
        frames: 8,
    },
    {
        name: 'run',
        frames: 8,
    },
    {
        name: 'jump',
        frames: 3,
    },
    {
        name: 'fall',
        frames: 3,
    },
    {
        name: 'jump_down',
        frames: 8,
    },
    {
        name: 'air_attack',
        frames: 8,
    },
    {
        name: 'roll',
        frames: 8,
    },
    {
        name: 'attack1',
        frames: 11,
    },
    {
        name: 'attack2',
        frames: 19,
    },
    {
        name: 'sp_attack1',
        frames: 28,
    },
    {
        name: 'sp_attack2',
        frames: 18,
    },
    {
        name: 'defend',
        frames: 10,
    },
    {
        name: 'take_hit',
        frames: 6,
    },
    {
        name: 'death',
        frames: 13,
    }
    
]

const fireAttckInfo = {
    attack: {
        name: 'attack1',
        next: 'attack2',
        attackFrame: 4,
        frames: 11,
        force: 10,
        attackBox :{offset: {x: 0, y: 50}, width: 120, height: 50}
    },
    attack2: {
        name: 'attack2',
        next: 'sp_attack1',
        attackFrame: 12,
        frames: 19,
        force: 10,
        attackBox :{offset: {x: 0, y: 50}, width: 120, height: 50}
    },
    air_attack: {
        name: 'air_attack',
        frames: 8,
        attackFrame: 5,
        force: 10,
        attackBox :{offset: {x: 0, y: 50}, width: 120, height: 50}
    },
    defend: {
        name: 'defend',
        frames: 10,
    },
    sp_attack1: {
        name: 'sp_attack1',
        frames: 28,
        combo: ['z', 'x', 'c'],
        attackFrame: 23,
        force: 10,
        attackBox :{offset: {x: 20, y: 50}, width: 150, height: 50}
    },
    sp_attack2: {
        name: 'sp_attack2',
        mana: 50,
        frames: 18,
        combo: ['z', 'x', 'c'],
        attackFrame: 12,
        force: 50,
        attackBox :{offset: {x: 0, y: 0}, width: 170, height: 150}
    }
}

const groundAnimationsStates = [
    {
        name: 'idle',
        frames: 6,
    },
    {
        name: 'run',
        frames: 8,
    },
    {
        name: 'jump',
        frames: 3,
    },
    {
        name: 'fall',
        frames: 3,
    },
    {
        name: 'air_attack',
        frames: 7,
    },
    {
        name: 'attack1',
        frames: 6,
    },
    {
        name: 'attack2',
        frames: 12,
    },
    {
        name: 'sp_attack1',
        frames: 23,
    },
    {
        name: 'sp_attack2',
        frames: 25,
    },
    {
        name: 'meditate',
        frames: 16,
    },
    {
        name: 'roll',
        frames: 6,
    },
    {
        name: 'defend',
        frames: 13,
    },
    {
        name: 'take_hit',
        frames: 6,
    },
    {
        name: 'death',
        frames: 15,
    }
]

const groundAttckInfo = {
    attack: {
        name: 'attack1',
        frames: 6,
        attackFrame: 2,
        force: 10,
        attackBox :{offset: {x: 0, y: 50}, width: 80, height: 50}
    },
	attack2: {
        name: 'attack2',
        frames: 12,
        attackFrame: 10,
        force: 6,
        attackBox :{offset: {x: 0, y: 50}, width: 80, height: 50}
    },
    air_attack: {
        name: 'air_attack',
        frames: 7,
        attackFrame: 4,
        force: 10,
        attackBox :{offset: {x: 0, y: 50}, width: 80, height: 50}
    },
    defend: {
        name: 'defend',
        frames: 13,
    },
    meditate: {
        name: 'meditate',
        force: 5,
        mana: 15,
        frames: 16,
    },
	sp_attack1: {
        name: 'sp_attack1',
        frames: 23,
        combo: ['z', 'x', 'c'],
        attackFrame: 18,
        force: 10,
        attackBox :{offset: {x: 75, y: 0}, width: 80, height: 150}
    },
    sp_attack2: {
        name: 'sp_attack2',
        mana: 50,
        frames: 25,
        combo: ['b', 'n', 'm'],
        attackFrame: 18,
        force: 50,
        attackBox :{offset: {x: 45, y: 0}, width: 50, height: 150}
    }
}

const windAnimationsStates = [
    {
        name: 'idle',
        frames: 8,
    },
    {
        name: 'run',
        frames: 8,
    },
    {
        name: 'jump',
        frames: 3,
    },
    {
        name: 'fall',
        frames: 3,
    },
    {
        name: 'air_attack',
        frames: 7,
    },
    {
        name: 'roll',
        frames: 6,
    },
    {
        name: 'attack1',
        frames: 8,
    },
    {
        name: 'attack2',
        frames: 17,
    },
    {
        name: 'sp_attack1',
        frames: 26,
    },
    {
        name: 'sp_attack2',
        frames: 30,
    },
    {
        name: 'defend',
        frames: 8,
    },
    {
        name: 'take_hit',
        frames: 6,
    },
    {
        name: 'death',
        frames: 19,
    }
]

const windAttckInfo = {
    attack: {
        name: 'attack1',
        frames: 8,
        attackFrame: 3,
        force: 10,
        attackBox :{offset: {x: 0, y: 50}, width: 80, height: 50}
    },
	attack2: {
        name: 'attack2',
        frames: 17,
        attackFrame: 11,
        force: 10,
        attackBox :{offset: {x: 0, y: 50}, width: 80, height: 50}
    },
    air_attack: {
        name: 'air_attack',
        frames: 7,
        attackFrame: 4,
        force: 10,
        attackBox :{offset: {x: 0, y: 50}, width: 80, height: 50}
    },
    defend: {
        name: 'defend',
        frames: 8,
    },
	sp_attack1: {
        name: 'sp_attack1',
        frames: 26,
        combo: ['z', 'x', 'c'],
        attackFrame: 18,
        force: 10,
        attackBox :{offset: {x: 0, y: 60}, width: 200, height: 90}
    },
    sp_attack2: {
        name: 'sp_attack2',
        mana: 50,
        frames: 30,
        combo: ['z', 'x', 'c'],
        attackFrame: 18,
        force: 50,
        attackBox :{offset: {x: -75, y: 60}, width: 100, height: 90}
    }
}

const waterAnimationsStates = [
    {
        name: 'idle',
        frames: 8,
    },
    {
        name: 'run',
        frames: 10,
    },
    {
        name: 'surf',
        frames: 8,
    },
    {
        name: 'jump',
        frames: 3,
    },
    {
        name: 'fall',
        frames: 3,
    },
    {
        name: 'air_attack',
        frames: 8,
    },
    {
        name: 'roll',
        frames: 6,
    },
    {
        name: 'attack1',
        frames: 7,
    },
    {
        name: 'attack2',
        frames: 21,
    },
    {
        name: 'sp_attack1',
        frames: 27,
    },
    {
        name: 'sp_attack2',
        frames: 32,
    },
    {
        name: 'meditate',
        frames: 12,
    },
    {
        name: 'defend',
        frames: 12,
    },
    {
        name: 'take_hit',
        frames: 7,
    },
    {
        name: 'death',
        frames: 16,
    }
]

const waterAttckInfo = {
    attack: {
        name: 'attack1',
        frames: 7,
        attackFrame: 3,
        force: 7,
        attackBox :{offset: {x: 0, y: 50}, width: 100, height: 50}
    },
	attack2: {
        name: 'attack2',
        frames: 21,
        attackFrame: 14,
        force: 8,
        attackBox :{offset: {x: 0, y: 50}, width: 100, height: 50}
    },
    air_attack: {
        name: 'air_attack',
        frames: 7,
        attackFrame: 4,
        force: 10,
        attackBox :{offset: {x: 0, y: 50}, width: 100, height: 50}
    },
    defend: {
        name: 'defend',
        frames: 8,
    },
    meditate: {
        name: 'meditate',
        force: 5,
        mana: 15,
        frames: 12,
    },
	sp_attack1: {
        name: 'sp_attack1',
        frames: 27,
        combo: ['z', 'x', 'c'],
        attackFrame: 23,
        force: 7,
        attackBox :{offset: {x: 60, y: 50}, width: 100, height: 100}
    },
    sp_attack2: {
        name: 'sp_attack2',
        frames: 30,
        mana: 50,
        combo: ['z', 'x', 'c'],
        attackFrame: 13,
        force: 50,
        attackBox :{offset: {x: 60, y: 0}, width: 100, height: 150}
    }
}

const metalAnimationsStates = [
    {
        name: 'idle',
        frames: 8,
    },
    {
        name: 'run',
        frames: 8,
    },
    {
        name: 'jump',
        frames: 3,
    },
    {
        name: 'fall',
        frames: 3,
    },
    {
        name: 'jump_down',
        frames: 20,
    },
    {
        name: 'air_attack',
        frames: 8,
    },
    {
        name: 'roll',
        frames: 7,
    },
    {
        name: 'throw',
        frames: 7,
    },
    {
        name: 'trap',
        frames: 10,
    },
    {
        name: 'attack1',
        frames: 6,
    },
    {
        name: 'attack2',
        frames: 8,
    },
    {
        name: 'sp_attack1',
        frames: 18,
    },
    {
        name: 'sp_attack2',
        frames: 11,
    },
    {
        name: 'defend',
        frames: 12,
    },
    {
        name: 'take_hit',
        frames: 6,
    },
    {
        name: 'death',
        frames: 12,
    }
]

const metalAttckInfo = {
    attack: {
        name: 'attack1',
        frames: 6,
        attackFrame: 1,
        force: 7,
        attackBox :{offset: {x: 0, y: 50}, width: 80, height: 50}
    },
	attack2: {
        name: 'attack2',
        frames: 8,
        attackFrame: 6,
        force: 5,
        attackBox :{offset: {x: 0, y: 50}, width: 80, height: 50}
    },
    air_attack: {
        name: 'air_attack',
        frames: 8,
        attackFrame: 4,
        force: 10,
        attackBox :{offset: {x: 0, y: 50}, width: 120, height: 50}
    },
    defend: {
        name: 'defend',
        frames: 12,
    },
	sp_attack1: {
        name: 'sp_attack1',
        frames: 18,
        combo: ['z', 'x', 'c'],
        attackFrame: 12,
        force: 10,
        attackBox :{offset: {x: 0, y: 0}, width: 120, height: 150}
    },
    sp_attack2: {
        name: 'sp_attack2',
        frames: 11,
        mana: 50,
        combo: ['z', 'x', 'c'],
        attackFrame: 4,
        force: 30,
        attackBox :{offset: {x: -200, y: 40}, width: 400, height: 120}
    }
}

const fireFighter = {
    name: "Fire",
    AnimationStates: fireAnimationsStates,
    AttackInfo: fireAttckInfo,
    idle_frames: 8,
    scale: 2,
    offset: {x:250, y: 104},
    keyLeft: "fire_SpriteSheet_288x128_left",
    keyRight: "fire_SpriteSheet_288x128_right",
    keyIdle:"fire_idle",
    keyPower:"power_bar_3",
    keyHP: "hp_bar_6",
    keyName:"fire_name"
}

const groundFighter = {
    name: "Ground",
    AnimationStates: groundAnimationsStates,
    AttackInfo: groundAttckInfo,
    idle_frames: 6,
    scale: 2.5,
    offset: {x:350, y: 152},
    keyLeft: "ground_SpriteSheet_288x128_left",
    keyRight: "ground_SpriteSheet_288x128_right",
    keyIdle:"ground_idle",
    keyPower:"power_bar_4",
    keyHP: "hp_bar_4",
    keyName:"ground_name"
}

const windFighter = { 
    name: "Wind",
    AnimationStates: windAnimationsStates,
    AttackInfo: windAttckInfo,
    idle_frames: 8,
    scale: 2.4,
    offset: {x:320, y: 152},
    keyLeft: "wind_SpriteSheet_288x128_left",
    keyRight: "wind_SpriteSheet_288x128_right",
    keyIdle:"wind_idle",
    keyPower:"power_bar_6",
    keyHP: "hp_bar_3",
    keyName:"wind_name"
}

const waterFighter = {
    name: "Water",
    AnimationStates: waterAnimationsStates,
    AttackInfo: waterAttckInfo,
    idle_frames: 8,
    scale: 2.2,
    offset: {x:290, y: 130},
    keyLeft: "water_SpriteSheet_288x128_left",
    keyRight: "water_SpriteSheet_288x128_right",
    keyIdle:"water_idle",
    keyPower:"power_bar_4",
    keyHP: "hp_bar_5",
    keyName:"water_name"
}

const metalFighter = {
    name: "Metal",
    AnimationStates: metalAnimationsStates,
    AttackInfo: metalAttckInfo,
    idle_frames: 8,
    scale: 2.2,
    offset: {x:290, y: 130},
    keyLeft: "metal_SpriteSheet_288x128_left",
    keyRight: "metal_SpriteSheet_288x128_right",
    keyIdle:"metal_idle",
    keyPower:"power_bar_5",
    keyHP: "hp_bar_4",
    keyName:"metal_name"
}