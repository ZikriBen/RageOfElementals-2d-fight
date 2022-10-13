function determineWinner({player, enemy, timerId}) {
    if (isStarted === false)
        return
    document.querySelector('#timer').innerHTML = '00'
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'

    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie'
    }
    else if(player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
        
    }
    else if(player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }
    setTimeout(() => {
        fadeFunc(gameOver)
    }, 1000);
}

let timer = 100
let timerId

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0) {
        determineWinner({player, enemy, timerId})
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

let isSoundOn = false
var music = new Audio('./music/Guile_Theme.mp3');

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
    document.querySelector('#start_btn').style.display = 'none'
    setTimeout(gsap.to, 1500, overlay, {opacity: 0, duration: 2})
}

function startScreen(){
    currentScreen = 'startScreen'
    screens[currentScreen].init()
}

function charSelect(){
    currentScreen = 'charSelectScreen'
    screens[currentScreen].init()
}

function startGame(){
    isStarted = true
    // playMusic()
    currentScreen = 'gameScreen'
    screens[currentScreen].init()
	timer = 100
}

function gameOver(){
    isStarted = false
    clearTimeout(manaTimer)
    manaTimer = null
    currentScreen = 'gameOverScreen'
    screens[currentScreen].init()
}

function turn(character, key, oppositKey, side) {
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
let manaTimer;

function manaRaise() {
    if (player.mana < 100) {
        player.mana += 2
        document.querySelector('#playerMana').style.width = player.mana + '%'
    }
    if (enemy.mana < 100) {
        enemy.mana += 2
        document.querySelector('#enemyMana').style.width = enemy.mana + '%'
        document.querySelector('#enemyMana').style.left = Math.abs(100 - enemy.mana) + '%'
        console.log(enemy.mana)
    }
    if (isStarted === true) {
        manaTimer = setTimeout(manaRaise, 1000)
    }
}

// function manaRaise() {
//     newPlayerMana = player.mana + 10
//     document.querySelector('#playerMana').style.width = player.mana + '%'
//     document.querySelector('#enemyMana').style.width = enemy.mana + '%'
//     document.querySelector('#enemyMana').style.left = 100 - enemy.mana + '%'
// }

let timerBlockId;

function _doActionNoSpam(attacker, type) {
    //Reset Timeout if function is called before it ends
    if (!(timerBlockId == null)) {
        clearTimeout(timerBlockId);
    }
    timerBlockId = setTimeout(function () {
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
    //Place code that can be spammed here (UI updates, etc)
};

let timerBlockId2;

function _doFuncNoSpam(func, args) {
    //Reset Timeout if function is called before it ends
    if (!(timerBlockId2 == null)) {
        clearTimeout(timerBlockId2);
    }
    timerBlockId2 = setTimeout(function () {
        func(args)
    }, 200);
};

function moveArrow(arrow, arrowPos, direcrtion, characters, fighters) {
    playSound(beepSound)
    characters[arrowPos].image.src = fighters[arrowPos].idle_bw_png
    arrowPos = (arrowPos + direcrtion) % characters.length
    if (arrowPos < 0)
        arrowPos = characters.length - 1
    arrow.position.x = arrowStartPos + (arrowPos * charOffset)
    return arrowPos
}