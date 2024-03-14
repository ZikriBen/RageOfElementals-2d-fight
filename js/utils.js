let timerBlockId;
let timerBlockId2;
let isSoundOn = false

// const introMusic = new Audio('./music/Guile_Theme.mp3');
const introMusic = new Audio('./music/PerituneMaterial_RetroRPG_Battle2.mp3');
const battleMusic = new Audio('./music/KensTheme(SSF2VRC7).wav');
let currentMusic = introMusic

const svgPathSoundOn = "M11 2h2v20h-2v-2H9v-2h2V6H9V4h2V2zM7 8V6h2v2H7zm0 8H3V8h4v2H5v4h2v2zm0 0v2h2v-2H7zm10-6h-2v4h2v-4zm2-2h2v8h-2V8zm0 8v2h-4v-2h4zm0-10v2h-4V6h4z"
const svgPathSoundOff = "M13 2h-2v2H9v2H7v2H3v8h4v2h2v2h2v2h2V2zM9 18v-2H7v-2H5v-4h2V8h2V6h2v12H9zm10-6.777h-2v-2h-2v2h2v2h-2v2h2v-2h2v2h2v-2h-2v-2zm0 0h2v-2h-2v2z"

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

function toggleMusic(){
    isSoundOn = !isSoundOn
    if (isSoundOn) {
        playMusic(currentMusic, setOn='resume')
        document.querySelector('#svgPath').setAttribute('d', svgPathSoundOn)
    }
    else {
        playMusic(currentMusic, action='pause')
        document.querySelector('#svgPath').setAttribute('d', svgPathSoundOff)
    }
}

function playSound(audio) {
    audio.pause();
    audio.currentTime=0;
    audio.play();
}


function playMusic(audio, action='play') {
    currentMusic.pause();
    currentMusic = audio
    currentMusic.volume = 0.2

    if (action === 'play') {
        audio.pause();
        audio.currentTime=0;
        audio.play();
    }
    else if (action === 'pause') {
        audio.pause();
    }
    else if (action === 'resume') {
        audio.play();
    }
    else if (action === 'stop') {
        audio.pause();
        audio.currentTime=0;
    }
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


function _doActionNoSpam(attacker, type, timeout=40) {
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
    }, timeout); //40ms Timeout
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

function resetHealth() {
    playerHealthBar = document.getElementById('player_health_bar');
    enemyHealthBar = document.getElementById('enemy_health_bar');
    
    const playerLostElement = document.getElementById('playerLost');
    const playerActualElement = document.getElementById('playerActual');
    const enemyLostElement = document.getElementById('enemyLost');
    const enemyActualElement = document.getElementById('enemyActual');
    
    playerLostElement.style.width = Math.floor(100)+"%";
    playerLostElement.style.left = Math.floor(0)+"%"; 
    playerActualElement.style.transform = "scaleX(1)";
    
    enemyLostElement.style.width = Math.floor(100)+"%";
    enemyLostElement.style.left = Math.floor(0)+"%"; 
    enemyActualElement.style.transform = "scaleX(1)";
}

function changeLife(attacker, life, lifeLost) {
    let lostElement;
    let actualElement;

    if (attacker === "player") {
        lostElement = document.getElementById('playerLost');
        actualElement = document.getElementById('playerActual');
    }
    else {
        lostElement = document.getElementById('enemyLost');
        actualElement = document.getElementById('enemyActual');
    }

    let webAnim; // Create a separate animation variable for each health bar

    if(lifeLost > life) {
        lifeLost = life
    }
    life -= lifeLost;
    
    if (life < 0) {
        life = 0;
    }
      
    lostElement.style.width = Math.floor(lifeLost)+"%";
    lostElement.style.left = Math.floor(life)+"%";
      
    if(webAnim) {
        webAnim.cancel();
    }
      
    webAnim = lostElement.animate([
      // keyframes
      { transform: 'scaleX(1)' }, 
      { transform: 'scaleX(0)' }
  
    ], { 
      // timing options
      duration: 300,
      iterations: 1,
      fill: 'both',
      delay: 100
    });

    actualElement.style.transform = "scaleX("+life/100+")";
    console.log(" " + attacker + ": " + life)
}