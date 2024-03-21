let timerBlockId;
let timerBlockId2;
let isSoundOn = false
const assets = new Map();

const AssetType = {
    IMAGE: 'image',
    SOUND: 'sound' 
};
const AssetTypeLookup = {
    png: AssetType.IMAGE,
    mp3: AssetType.SOUND,
    wav: AssetType.SOUND 
};
const assetList = [
    ['logo', './img/ElementalLogo.png'],
    ['instructions', './img/instructions.png'],
    ['beep', './music/mixkit-video-game-mystery-alert-234.wav'],
    ['select', './music/mixkit-arcade-bonus-alert-767.wav'],

    ["fire_SpriteSheet_288x128_right","./img/Fighters/fire/fire_SpriteSheet_288x128_right.png"],
    ["fire_SpriteSheet_288x128_left","./img/Fighters/fire/fire_SpriteSheet_288x128_left.png"],
    ["ground_SpriteSheet_288x128_right", "./img/Fighters/ground/ground_SpriteSheet_288x128_right.png"],
    ["ground_SpriteSheet_288x128_left", "./img/Fighters/ground/ground_SpriteSheet_288x128_left.png"],
    ["wind_SpriteSheet_288x128_right","./img/Fighters/wind/wind_SpriteSheet_288x128_right.png"],
    ["wind_SpriteSheet_288x128_left","./img/Fighters/wind/wind_SpriteSheet_288x128_left.png"],
    ["water_SpriteSheet_288x128_right", "./img/Fighters/water/water_SpriteSheet_288x128_right.png"],
    ["water_SpriteSheet_288x128_left", "./img/Fighters/water/water_SpriteSheet_288x128_left.png"],
    ["metal_SpriteSheet_288x128_right","./img/Fighters/metal/metal_SpriteSheet_288x128_right.png"],
    ["metal_SpriteSheet_288x128_left","./img/Fighters/metal/metal_SpriteSheet_288x128_left.png"],
    ["name","./img/Fighters/fire/name.png"],
    
    ["fire_idle","./img/Fighters/fire/fire_idle.png"],
    ["ground_idle","./img/Fighters/ground/ground_idle.png"],
    ["wind_idle","./img/Fighters/wind/wind_idle.png"],
    ["water_idle","./img/Fighters/water/water_idle.png"],
    ["metal_idle","./img/Fighters/metal/metal_idle.png"],
    
    ["fire_idle_bw","./img/Fighters/fire/fire_idle_bw.png"],
    ["ground_idle_bw","./img/Fighters/ground/ground_idle_bw.png"],
    ["wind_idle_bw","./img/Fighters/wind/wind_idle_bw.png"],
    ["water_idle_bw","./img/Fighters/water/water_idle_bw.png"],
    ["metal_idle_bw","./img/Fighters/metal/metal_idle_bw.png"],
    
    ["background-fire", "./img/bgs/background-fire.png"],
    ["background-metal", "./img/bgs/background-metal.png"], 
    ["background-water", "./img/bgs/background-water.png"], 
    ["background-wind", "./img/bgs/background-wind.png"],
    ["background-ground", "./img/bgs/background-ground.png"],

    ["rtb-bg1", './img/rtb/background.png'],
    ["rtb-bg2", './img/rtb/background2.png'],
    ["rtb-bg3", './img/rtb/background3.png'],
    ["rtb-bg4", './img/rtb/background4.png'],
    
    ["MagicCliffs-bg1", './img/MagicCliffs/sky.png'],
    ["MagicCliffs-bg2", './img/MagicCliffs/clouds.png'],
    ["MagicCliffs-bg3", './img/MagicCliffs/sea.png'],
    ["MagicCliffs-bg4", './img/MagicCliffs/far-grounds.png'],

    ["RockyPass-bg1", './img/RockyPass/back.png'],
    ["RockyPass-bg2", './img/RockyPass/middle.png'],
    ["RockyPass-bg3", './img/RockyPass/near.png'],

    ["PixelFantasyCaves-bg1", './img/PixelFantasyCaves/background1.png'],
    ["PixelFantasyCaves-bg2", './img/PixelFantasyCaves/background2.png'],
    ["PixelFantasyCaves-bg3", './img/PixelFantasyCaves/background3.png'],
    ["PixelFantasyCaves-bg4a", './img/PixelFantasyCaves/background4a.png'],
    ["PixelFantasyCaves-bg4b", './img/PixelFantasyCaves/background4b.png'],

    ["power_bar_2", "./img/ui/power_bar_2.png"],
    ["power_bar_3", "./img/ui/power_bar_3.png"],
    ["power_bar_4", "./img/ui/power_bar_4.png"],
    ["power_bar_5", "./img/ui/power_bar_5.png"],
    ["power_bar_6", "./img/ui/power_bar_6.png"],
    ["power_bar_2_bw", "./img/ui/power_bar_2_bw.png"],
    ["power_bar_3_bw", "./img/ui/power_bar_3_bw.png"],
    ["power_bar_4_bw", "./img/ui/power_bar_4_bw.png"],
    ["power_bar_5_bw", "./img/ui/power_bar_5_bw.png"],
    ["power_bar_6_bw", "./img/ui/power_bar_6_bw.png"],

    ["hp_bar_2", "./img/ui/hp_bar_2.png"],
    ["hp_bar_3", "./img/ui/hp_bar_3.png"],
    ["hp_bar_4", "./img/ui/hp_bar_4.png"],
    ["hp_bar_5", "./img/ui/hp_bar_5.png"],
    ["hp_bar_6", "./img/ui/hp_bar_6.png"],
    ["hp_bar_3_bw", "./img/ui/hp_bar_3_bw.png"],
    ["hp_bar_4_bw", "./img/ui/hp_bar_4_bw.png"],
    ["hp_bar_5_bw", "./img/ui/hp_bar_5_bw.png"],
    ["hp_bar_6_bw", "./img/ui/hp_bar_6_bw.png"],

    ["arrow_p1p", "./img/arrow_p1p.png"],
    ["arrow_p2p", "./img/arrow_p2p.png"],
    ["fire_name", "./img/Fighters/fire/name.png"],
    ["ground_name", "./img/Fighters/ground/name.png"],
    ["wind_name", "./img/Fighters/wind/name.png"],
    ["water_name", "./img/Fighters/water/name.png"],
    ["metal_name", "./img/Fighters/metal/name.png"],
]
// const introMusic = new Audio('./music/PerituneMaterial_RetroRPG_Battle2.mp3');
const battleMusic = new Audio('./music/KensTheme(SSF2VRC7).wav');
const battleMusic2 = new Audio('./music/Guile_Theme.mp3');
let currentMusic = battleMusic

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
    if (isSoundOn) {
        audio.pause();
        audio.currentTime=0;
        audio.play();
    }
}


function playMusic(audio, action='play') {
    currentMusic.pause();
    currentMusic = audio
    currentMusic.volume = 0.3

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
    document.querySelector('#info_btn').style.display = 'none'
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

function _doFuncNoSpam(func, args, timeout=200) {
    //Reset Timeout if function is called before it ends
    if (!(timerBlockId2 == null)) {
        clearTimeout(timerBlockId2);
    }
    timerBlockId2 = setTimeout(function () {
        func(args)
    }, timeout);
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
}

function loadImage(key, filename, onComplete) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve({key, filename, asset: image});
            if (typeof onComplete === 'function') onComplete({ filename, image });
        }, { once: true });
        image.addEventListener('error', (event) => reject({filename, event}));
        image.src = filename;
    });
}

function loadSound(key, filename, onComplete) {
    return new Promise((resolve, reject) => {
        const sound = new Audio()
        sound.addEventListener('canplay', () => {
            resolve({key, filename, asset: sound})
            if (typeof onComplete === 'function') onComplete({filename, sound})
        }, {once: true});
        sound.addEventListener('error', (event) => reject({filename, event}));
        sound.src = filename;
    });
}

async function load(assetsArray, onComplete) {
    const promises = assetsArray.map(([key, filename]) => {
        const extenstion = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        const type = AssetTypeLookup[extenstion];

        if (type === AssetType.IMAGE) {
            return loadImage(key, filename, onComplete)
        } else if (type === AssetType.SOUND) {
            return loadSound(key, filename, onComplete)
        } else {
            throw new TypeError('Unknown file type error')
        }
    });

    return Promise.all(promises).then((loadAssets) => {
        for (const {key, asset} of loadAssets) {
            assets.set(key, asset);
        }
    });
}

function handleAssetDownload({filename, image}) {
    console.log(`${filename} has been downaloded!`);
    LoadingScreenIns.setSpeed(Math.round(100 / assetList.length))
}

function enemyAI() {
    const distanceX = player.position.x - enemy.position.x;
    if (enemyAIOn) {
        if (rectCollision(player, enemy)) {
            if (player.isAttcking && player.currentFrame < 2) {
            if (Math.random() < 0.015) {
            enemy.defend();
            return;
            }
            }
            enemy.velocity.x = 0;
            attack_seed = Math.random();
            if (attack_seed < 0.1){
                enemy.switchSprite('idle');
            } else if (attack_seed > 0.96) {
                _doActionNoSpam(enemy, 'sp_attack2');
            } else {
                if (enemy.velocity.y != 0) {
                    _doActionNoSpam(enemy, 'air_attack');
                } else {
                    _doActionNoSpam(enemy, 'attack1', 80);
                }
            }
        } else {
            if (Math.random() < 0.04) {
                if (player.velocity.y > 0) {
                    enemy.velocity.y = -10;
                    enemy.switchSprite('jump');
                }
            }
            let direction = 1;
            if (distanceX > 0) {
                enemy.facing = "right";
            
        } else {
                direction = -1;
                enemy.facing = "left";
            }
            enemy.velocity.x = direction * 2;
            enemy.switchSprite('run');
        }
    
    } else {
        enemy.velocity.x = 0;
        enemy.switchSprite('idle');
    }
}

