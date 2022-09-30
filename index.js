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
    color: 'blue'
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
    background.update()
    shop.update()
    player.update();
    enemy.update();
    
    // Player Movement
    player.velocity.x = 0
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    }
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }

    // Enemy Movement
    enemy.velocity.x = 0
    if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }
    else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    }

    // Detect Colision attackBox
    if (rectCollision(player, enemy) && player.isAttcking) {
        player.isAttcking = false
        console.log('col')
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (rectCollision(enemy, player) && enemy.isAttcking) {
        enemy.isAttcking = false
        console.log('col')
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }

}

animate()


window.addEventListener('keydown', (event) => {
    // console.log(event)
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