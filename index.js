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
            if (this.lastKey === 'a') {
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
    if (
        // (player.attackBox.position.x + player.attackBox.width >= enemy.position.x) && 
        // (player.attackBox.position.x <= enemy.position.x + enemy.width) &&
        // (player.attackBox.position.y + player.attackBox.height >= enemy.position.y ) && 
        // (player.attackBox.position.y <= enemy.position.y + enemy.height) &&
        
        (player.attackBox.position.x + player.attackBox.offset < enemy.position.x + enemy.width) && 
        (player.attackBox.position.x + player.attackBox.offset + player.attackBox.width > enemy.position.x) &&
        (player.attackBox.position.y < enemy.position.y + enemy.height) &&
        (player.attackBox.position.y + player.attackBox.height > enemy.position.y) &&
        (player.isAttcking)
    ) {
        player.isAttcking = false
        console.log('col')
    }
}

animate()


window.addEventListener('keydown', (event) => {
    // console.log(event)
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            player.lastKey = 'a'
            keys.a.pressed = true
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
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -18
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