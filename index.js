const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width  = 1024
canvas.height = 576

const overlay = {
    opacity: 0
}

c.fillRect(0, 0, canvas.width, canvas.height)

let player;
let enemy;

let currentScreen = 'startScreen'
startScreenIns = new StartScreenCLS(c, canvas.width, canvas.height)
charSelectIns = new CharSelectCLS(c, canvas.width, canvas.height)
GameScreenIns = new GameScreenCLS(c, canvas.width, canvas.height)
GameOverScreenIns = new GameOverScreenCLS(c, canvas.width, canvas.height)

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

screens[currentScreen].init()

function enemyAI() {
    // if (enemy.animationName !== 'death'){
        const distanceX = player.position.x - enemy.position.x;

        if (rectCollision(player, enemy)) {
            enemy.velocity.x = 0;
            // enemy.switchSprite('idle');
            _doActionNoSpam(enemy, 'attack1')
        } else {
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
    // }
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
        if (startScreenIns.gameMode === 'pve') { // can be optimize!
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