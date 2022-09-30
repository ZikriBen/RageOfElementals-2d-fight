const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width  = 1024
canvas.height = 576
const gravity = 0.7
c.fillRect(0, 0, canvas.width, canvas.height)

class Sprite {
    constructor({position, velocity, color = 'red'}) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.isAttcking
        this.color = color
        this.health = 100
        this.facing

        this.attackBox = {
            position: this.position,
            offset: 0,
            width: 100,
            height: 50
        }
    }

    attack() {
        this.isAttcking = true
        setTimeout(()=>{
            this.isAttcking = false
        }, 100)
    }
    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        
        // AttckBox
        if (this.isAttcking) {
            c.fillStyle = 'green'
            if (this.facing === 'left') {
                this.attackBox.offset = -this.width
            }
            else {
                this.attackBox.offset = 0
            }
            c.fillRect(this.attackBox.position.x + this.attackBox.offset, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.lastKey

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        }
        else {
            this.velocity.y += gravity
        }
    }
};

const player = new Sprite({
    position:{
        x: 250, 
        y: 100
    },
    velocity: {
        x: 0,
        y: 0,
    }
});

const enemy = new Sprite({
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

console.log(player);

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

function determineWinner({player, enemy, timerId}) {
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
}

let timer = 60
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

decreaseTimer()

function rectCollision(rect1, rect2) {
    return (
        rect1.attackBox.position.x + rect1.attackBox.offset < rect2.position.x + rect2.width && 
        rect1.attackBox.position.x + rect1.attackBox.offset + rect1.attackBox.width > rect2.position.x &&
        rect1.attackBox.position.y < rect2.position.y + rect2.height &&
        rect1.attackBox.position.y + rect1.attackBox.height > rect2.position.y
    )
}

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
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