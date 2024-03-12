const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width  = 1277
canvas.height = 576

const computedStyle = window.getComputedStyle(canvas);
const compCanvasWidth = parseFloat(computedStyle.width);
const compCanvasHeight =  parseFloat(computedStyle.height);

const overlay = {
    opacity: 0
}

c.fillRect(0, 0, canvas.width, canvas.height)

let player;
let enemy;

let currentScreen = 'startScreen' // # Original
// let currentScreen = 'gameScreen'

startScreenIns = new StartScreenCLS(c, canvas.width, canvas.height)
charSelectIns = new CharSelectCLS(c, canvas.width, canvas.height)
GameScreenIns = new GameScreenCLS(c, canvas.width, canvas.height)
GameOverScreenIns = new GameOverScreenCLS(c, canvas.width, canvas.height)

let enemyAIOn = false
let gameMode = ''

const screens = {
    'startScreen': {
        init: () => {
            startScreenIns.init()     
        },
        draw: () => {
            startScreenIns.draw()
        },
        keyFunc: (key) => {
            startScreenIns.keyFunc(key)
        }
    },
    'charSelectScreen': {
        init: () => {
            charSelectIns.init()
        },
        draw: () => {
            charSelectIns.draw()
        },        
        keyFunc: (key) => {
            charSelectIns.keyFunc(key)
        }
    },
    'gameScreen': {
        init: () => {
            GameScreenIns.init(charSelectIns.getPlayerFighter(), charSelectIns.getEnemyFighter())
            player = GameScreenIns.getPlayer()
            enemy = GameScreenIns.getEnemy()
        },
        draw: () => {
            GameScreenIns.draw()

        },
        keyFunc: (key) => {
            GameScreenIns.keyFunc(key)
        }
	},
    'gameOverScreen': {
        init: () => {
            GameOverScreenIns.init()
        },
        draw: () => {
            GameOverScreenIns.draw()
        },
        keyFunc: (key) => {
            GameOverScreenIns.keyFunc(key)
        }
    }
}
screens[currentScreen].init() // # Original

// screens['charSelectScreen'].init()
// screens['gameScreen'].init()
// gameMode = 'pve'
// currentScreen = 'gameScreen'

setTimeout(() => { enemyAIOn= true }, 1500)

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
            attack_seed = Math.random()
            if (attack_seed < 0.1){
                enemy.switchSprite('idle');
            }
            else if (attack_seed > 0.96)
                _doActionNoSpam(enemy, 'sp_attack2');
            else
                if (enemy.velocity.y != 0)
                    _doActionNoSpam(enemy, 'air_attack');
                else {
                    _doActionNoSpam(enemy, 'attack1', 80);
                    // enemy.attack1()
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
                enemy.facing = "right"
            }
            else {
                direction = -1;
                enemy.facing = "left"
            }
            enemy.velocity.x = direction * 2;
            enemy.switchSprite('run');
        }
    }
    else {
        enemy.velocity.x = 0;
        enemy.switchSprite('idle');
    }
}

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    screens[currentScreen].draw()

    if (player && enemy) {
        // Player Movement
        player.velocity.x = 0
        if (keys.a.pressed && player.lastKey === 'a') {
            player.switchSprite('run')
            player.velocity.x = -5
        }
        else if (keys.d.pressed && player.lastKey === 'd') {
            player.switchSprite('run')
            player.velocity.x = 5
        }
        else if (keys.d.double >= 2) {
            player.velocity.x += 7
            player.roll()
        }
        else if (keys.a.double >= 2) {
            player.velocity.x -= 7
            player.roll()
        }
        else {
            player.switchSprite('idle')
        }
        if (player.velocity.y < 0) {
            player.switchSprite('jump')
        }
        else if (player.velocity.y > 0) {
            player.switchSprite('fall')
        }
        // if (startScreenIns.gameMode === 'pve') { // can be optimize! # Original
        if (gameMode === 'pve') { // can be optimize!
            enemyAI();
        }
        else {
            // Enemy Movement
            enemy.velocity.x = 0
            if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
                enemy.switchSprite('run')
                enemy.velocity.x = 5
            }
            else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
                enemy.switchSprite('run')
                enemy.velocity.x = -5
            }
            else if (keys.ArrowRight.double >= 2) {
                enemy.velocity.x += 7
                enemy.roll()
            }
            else if (keys.ArrowLeft.double >= 2) {
                enemy.velocity.x -= 7
                enemy.roll()
            }
            else {
                enemy.switchSprite('idle')
            }
            
            if (enemy.velocity.y < 0) {
                enemy.switchSprite('jump')
            }
            else if (enemy.velocity.y > 0) {
                enemy.switchSprite('fall')
            }
        }
        // Detect Colision player attackBox
        if (rectCollision(player, enemy) && player.isAttcking && player.currentFrame === player.attackFrame) {
            enemy.takeHit(player.currentForce)
            player.isAttcking = false
            if (enemy.health < 0) {
                enemy.health = 0
            }
        }
        
        // Detect Colision enemy attackBox
        if (rectCollision(enemy, player) && enemy.isAttcking && enemy.currentFrame === enemy.attackFrame) {
            player.takeHit(enemy.currentForce)
            enemy.isAttcking = false
            if (player.health < 0) {
                player.health = 0
            }
        }
        
        // Charcters Health hanlder
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        document.querySelector('#playerHealth').style.width = player.health + '%'
        
        if (GameScreenIns.isStarted && (enemy.health <= 0 || player.health <= 0)) {
            enemyAIOn = false
            GameScreenIns.determineWinner()
        }
        
    }

    // Fade effect between screens
    c.save()
    c.globalAlpha = overlay.opacity
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.restore()
}

window.addEventListener('keydown', (event) => {
    screens[currentScreen].keyFunc(event.key)
})

window.addEventListener('keyup', (event) => {
    keyUpFunc(event.key)
})


animate()