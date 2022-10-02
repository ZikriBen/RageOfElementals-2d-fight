const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width  = 1024
canvas.height = 576
const gravity = 0.7
c.fillRect(0, 0, canvas.width, canvas.height)

const background = new Sprite({position: {x: 0, y: 0}, imagesSrc: './img/background.png'})

const shop = new Sprite({position: {x: 625, y: 160}, imagesSrc: './img/shop.png', scale: 2.5, framesMax: 6})

const player = new Fighter({
    position:{
        x: 250, 
        y: 100
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: 'red',
    scale: 2, 
    offset: {x:175, y:94},
    facing: 'right',
    imagesSrc: './img/Samurai/Idle.png',
    framesMax: 8,
    sprites: {
        idle_right: {
            imagesSrc: './img/Samurai/Idle_right.png', 
            framesMax: 8,
        },
        idle_left: {
            imagesSrc: './img/Samurai/Idle_left.png', 
            framesMax: 8,
        },
        run_right: {
            imagesSrc: './img/Samurai/Run_right.png', 
            framesMax: 8,
        },
        run_left: {
            imagesSrc: './img/Samurai/Run_left.png', 
            framesMax: 8,
        },
        jump_right: {
            imagesSrc: './img/Samurai/Jump_right.png', 
            framesMax: 2,
        },
        jump_left: {
            imagesSrc: './img/Samurai/Jump_left.png', 
            framesMax: 2,
        },
        fall_right: {
            imagesSrc: './img/Samurai/Fall_right.png', 
            framesMax: 2,
        },
        fall_left: {
            imagesSrc: './img/Samurai/Fall_left.png', 
            framesMax: 2,
        },
        attack1_right: {
            imagesSrc: './img/Samurai/Attack1_right.png', 
            framesMax: 6,
        },
        attack1_left: {
            imagesSrc: './img/Samurai/Attack1_left.png', 
            framesMax: 6,
        },
        take_hit_right: {
            imagesSrc: './img/Samurai/TakeHit_right.png', 
            framesMax: 4,
        },
        take_hit_left: {
            imagesSrc: './img/Samurai/TakeHit_left.png', 
            framesMax: 4,
        },
        death_right: {
            imagesSrc: './img/Samurai/Death_right.png', 
            framesMax: 6,
        },
        death_left: {
            imagesSrc: './img/Samurai/Death_right.png', 
            framesMax: 6,
        },
    },
    attackBox :{
        offset: {
            x: 0,
            y: 50
        },
        width: 200,
        height: 50
    }
});

const enemy = new Fighter({
    position:{
        x: 650, 
        y: 100
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: 'green',
    scale: 2, 
    offset: {x:180, y:107},
    imagesSrc: './img/Kenji/Idle_right.png',
    framesMax: 4,
    facing: 'left',
    sprites: {
        idle_right: {
            imagesSrc: './img/Kenji/Idle_right.png', 
            framesMax: 4,
        },
        idle_left: {
            imagesSrc: './img/Kenji/Idle_left.png', 
            framesMax: 4,
        },
        run_right: {
            imagesSrc: './img/Kenji/Run_right.png', 
            framesMax: 8,
        },
        run_left: {
            imagesSrc: './img/Kenji/Run_left.png', 
            framesMax: 8,
        },
        jump_right: {
            imagesSrc: './img/Kenji/Jump_right.png', 
            framesMax: 2,
        },
        jump_left: {
            imagesSrc: './img/Kenji/Jump_left.png', 
            framesMax: 2,
        },
        fall_right: {
            imagesSrc: './img/Kenji/Fall_right.png', 
            framesMax: 2,
        },
        fall_left: {
            imagesSrc: './img/Kenji/Fall_left.png', 
            framesMax: 2,
        },
        attack1_right: {
            imagesSrc: './img/Kenji/Attack1_right.png', 
            framesMax: 4,
        },
        attack1_left: {
            imagesSrc: './img/Kenji/Attack1_left.png', 
            framesMax: 4,
        },
        take_hit_right: {
            imagesSrc: './img/Kenji/TakeHit_right.png', 
            framesMax: 3,
        },
        take_hit_left: {
            imagesSrc: './img/Kenji/TakeHit_left.png', 
            framesMax: 3,
        },
        death_right: {
            imagesSrc: './img/Kenji/Death_right.png', 
            framesMax: 7,
        },
        death_left: {
            imagesSrc: './img/Kenji/Death_right.png', 
            framesMax: 7,
        }
    },
    attackBox :{
        offset: {
            x: 0,
            y: 50
        },
        width: 200,
        height: 50
    }
});

const keys = {
    a: {
        pressed : false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()


function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    background.update()
    shop.update()
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update();
    enemy.update();
    
    
    // Player Movement
    player.velocity.x = 0
    if (keys.a.pressed && player.lastKey === 'a') {
        player.switchSprite('run' + '_' + player.facing)
        player.velocity.x = -5
    }
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.switchSprite('run' + '_' + player.facing)
        player.velocity.x = 5
    }
    else {
        player.switchSprite('idle' + '_' + player.facing)
    }
    
    if (player.velocity.y < 0) {
        player.switchSprite('jump' + '_' + player.facing)
    }
    else if (player.velocity.y > 0) {
        player.switchSprite('fall' + '_' + player.facing)
    }

    // Enemy Movement
    enemy.velocity.x = 0
    if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.switchSprite('run' + '_' + enemy.facing)
        enemy.velocity.x = 5
    }
    else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.switchSprite('run' + '_' + enemy.facing)
        enemy.velocity.x = -5
    }
    else {
        enemy.switchSprite('idle' + '_' + enemy.facing)
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump' + '_' + enemy.facing)
    }
    else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall' + '_' + enemy.facing)
    }

    // Detect Colision attackBox
    if (rectCollision(player, enemy) && player.isAttcking && player.currentFrame === 4) {
        enemy.takeHit()
        player.isAttcking = false
        console.log('col')
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (player.isAttcking && player.currentFrame === 4) {
        player.isAttcking = false
    }

    if (rectCollision(enemy, player) && enemy.isAttcking && enemy.currentFrame === 2) {
        player.takeHit()
        enemy.isAttcking = false
        console.log('col')
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    if (enemy.isAttcking && enemy.currentFrame === 2) {
        enemy.isAttcking = false
    }

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }

}

animate()


window.addEventListener('keydown', (event) => {
    // console.log(event)
    if (!player.isDead) {

        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                player.facing = 'right'
                break
            case 'a':
                player.lastKey = 'a'
                keys.a.pressed = true
                player.facing = 'left'
                break
            case 'w':
                player.velocity.y = -18
                break
            case ' ':
                player.attack()
                break
        }
    }
    if (!enemy.isDead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                enemy.facing = 'right'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                enemy.facing = 'left'
                break
            case 'ArrowUp':
                enemy.velocity.y = -18
                break
            case '0':
                enemy.attack()
                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    // console.log(event)
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break

    }
})
