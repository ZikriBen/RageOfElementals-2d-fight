let currentScreen = 'gameScreen'

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
c.textAlign = "center";
canvas.width  = 1024
canvas.height = 576

const gravity = 0.7
const overlay = {
    opacity: 0
}
c.fillRect(0, 0, canvas.width, canvas.height)


let player;
let enemy;

startScreenIns = new StartScreenCLS(c, canvas.width, canvas.height)
charSelectIns = new CharSelectCLS()
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

screens[currentScreen].init()


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

        // Detect Colision player attackBox
        if (rectCollision(player, enemy) && player.isAttcking && player.currentFrame === player.attackFrame) {
            enemy.takeHit(player, player.currentForce)
            player.isAttcking = false
            console.log('col')
            console.log(enemy.health)
            if (enemy.health < 0) {
                enemy.health = 0
            }
        }

        document.querySelector('#enemyHealth').style.width = enemy.health + '%'

        // Detect Colision enemy attackBox
        if (rectCollision(enemy, player) && enemy.isAttcking && enemy.currentFrame === enemy.attackFrame) {
            player.takeHit(enemy, enemy.currentForce)
            enemy.isAttcking = false
            console.log('col')
            console.log(player.health)
            if (player.health < 0) {
                player.health = 0
            }
        }

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

animate()


window.addEventListener('keydown', (event) => {
    screens[currentScreen].keyFunc(event.key)
})


window.addEventListener('keyup', (event) => {
    switch (event.key) {
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
})
