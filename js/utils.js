let timerBlockId;
let timerBlockId2;
let isSoundOn = false
const music = new Audio('./music/Guile_Theme.mp3');

const keys = {
    a: {
        pressed : false,
        double: 0
    },
    d: {
        pressed: false,
        double: 0
    },
    ArrowRight: {
        pressed: false,
        double: 0
    },
    ArrowLeft: {
        pressed: false,
        double: 0
    }
}

function keyUpFunc(key) {
    switch (key) {
        case 'd':
            keys.d.pressed = false
            keys.d.double++
            setTimeout(() => (keys.d.double = 0), 450)
            break
        case 'a':
            keys.a.pressed = false
            keys.a.double++

            setTimeout(() => (keys.a.double = 0), 450)
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            keys.ArrowRight.double++
            setTimeout(() => (keys.ArrowRight.double = 0), 450)
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            keys.ArrowLeft.double++
            setTimeout(() => (keys.ArrowLeft.double = 0), 450)
            break
    }
}

function rectCollision(rect1, rect2) {
    return (
        rect1.attackBox.position.x < rect2.position.x + rect2.width && 
        rect1.attackBox.position.x + rect1.attackBox.width > rect2.position.x &&
        rect1.attackBox.position.y < rect2.position.y + rect2.height &&
        rect1.attackBox.position.y + rect1.attackBox.height > rect2.position.y
    )
}

function playMusic(){
    playSound(music)
    isSoundOn = true
}

function playSound(audio) {
    audio.pause();
    audio.currentTime=0;
    audio.play();
}

function fadeFunc(func) {
    gsap.to(overlay, {opacity: 1, duration: 0.8})
    setTimeout(func, 1000);
    document.querySelector('#start_pve_btn').style.display = 'none'
    document.querySelector('#start_pvp_btn').style.display = 'none'
    setTimeout(gsap.to, 1500, overlay, {opacity: 0, duration: 2})
}

function startScreen(){
    GameOverScreenIns.delete()
    currentScreen = 'startScreen'
    screens[currentScreen].init()
}

function charSelect(){
    currentScreen = 'charSelectScreen'
    screens[currentScreen].init()
}

function startGame(){
    isStarted = true
    playMusic()
    currentScreen = 'gameScreen'
    screens[currentScreen].init()
	timer = 100
}

function gameOver(){
    isStarted = false
    GameScreenIns.delete()
    currentScreen = 'gameOverScreen'
    screens[currentScreen].init()
}

function turn(character, key, oppositKey, side) {
    if (character.animationName === 'death') 
        return
    keys[key].pressed = true
    character.lastKey = key
    if (character.animationName === 'sp_attack2') 
        return
    character.facing = side
    if (keys[oppositKey].pressed === true) {
        keys[oppositKey].pressed = false
        character.changeAnimationName('run', character.facing)
        return
    }
}


function _doActionNoSpam(attacker, type) {
    //Reset Timeout if function is called before it ends
    if (!(attacker.attackTimer == null)) {
        clearTimeout(attacker.attackTimer);
    }
    attacker.attackTimer = setTimeout(function () {
        switch (type) {
            case "attack1":
                attacker.attack()
                break
            case "attack2":
                attacker.changeAnimationName("attack2", attacker.facing)
                attacker.framesMax = attacker.spriteAnimations[attacker.animationName].loc.length
                attacker.attack2()
                break
            case "sp_attack1":
                attacker.changeAnimationName("sp_attack1", attacker.facing)
                attacker.framesMax = attacker.spriteAnimations[attacker.animationName].loc.length
                attacker.sp_attack1()
                break
            case "sp_attack2":
                attacker.sp_attack2()
                break
            case "air_attack":
                attacker.air_attack()
                break
            case "meditate":
                attacker.meditate()
                break
        }
    }, 40); //40ms Timeout
};

function _doFuncNoSpam(func, args) {
    //Reset Timeout if function is called before it ends
    if (!(timerBlockId2 == null)) {
        clearTimeout(timerBlockId2);
    }
    timerBlockId2 = setTimeout(function () {
        func(args)
    }, 200);
};
