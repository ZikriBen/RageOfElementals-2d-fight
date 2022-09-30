class Sprite {
    constructor({position, imagesSrc, scale = 1, framesMax = 1}) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imagesSrc
        this.scale = scale
        this.framesMax = framesMax
        this.currentFrame = 0
        this.framsTotal = 0
        this.framsHold = 5
    }

    draw() {
        c.drawImage(
            this.image, 
            this.currentFrame * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax, 
            this.image.height,
            this.position.x, 
            this.position.y, 
            this.image.width / this.framesMax * this.scale, 
            this.image.height * this.scale
        )
    }

    update() {
        this.draw()
        this.framsTotal++
        if (this.framsTotal % this.framsHold === 0) {
            this.currentFrame = (this.currentFrame + 1) % this.framesMax
        }
    }
}

class Fighter {
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
        
        if (this.position.x + this.width + this.velocity.x <= 0 + this.width) {
            this.position.x = 0
        }

        if (this.position.x + this.width + this.velocity.x >= canvas.width) {
            this.position.x = canvas.width - this.width
        }

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
        }
        else {
            this.velocity.y += gravity
        }
    }
}