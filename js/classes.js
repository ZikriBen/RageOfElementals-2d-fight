class Sprite {
    constructor({position, imagesSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}) {
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
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image, 
            this.currentFrame * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax, 
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            this.image.width / this.framesMax * this.scale, 
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framsTotal++
        if (this.framsTotal % this.framsHold === 0) {
            this.currentFrame = (this.currentFrame + 1) % this.framesMax
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({
        position, 
        velocity,
        color,
        imagesSrc, 
        scale = 1, 
        framesMax = 1, 
        offset = {x: 0, y: 0}, 
        facing = 'right', 
        sprites, 
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
        super({
            position,
            imagesSrc,
            scale,
            framesMax,
            offset
        })
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.isAttcking
        this.color = color
        this.health = 100
        this.currentFrame = 0
        this.framsTotal = 0
        this.framsHold = 5
        this.facing = facing
        this.sprites = sprites

        for (const sprite in this.sprites) {
            this.sprites[sprite].image = new Image()
            this.sprites[sprite].image.src = this.sprites[sprite].imagesSrc
        }

        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        
        this.facingOffset = 0
    }

    attack() {
        this.switchSprite('attack1' + '_' + this.facing)
        this.isAttcking = true
    }

    update() {
        this.draw()
        this.animateFrames()
        
        if (this.facing === 'left') {
            this.facingOffset = -(this.attackBox.offset.x + this.attackBox.width - this.width)
        }
        else {
            this.facingOffset = 0
        }

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x + this.facingOffset
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
        
        // c.fillStyle = this.color
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        // c.fillStyle = 'black'
        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

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
            this.position.y = 330
        }
        else {
            this.velocity.y += gravity
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites['attack1' + '_' + this.facing].image) {
            if (this.currentFrame < this.sprites['attack1' + '_' + this.facing].framesMax - 1) {
                return
            }
        }
       
        if (this.image !== this.sprites[sprite].image) {
            this.image = this.sprites[sprite].image
            this.framesMax = this.sprites[sprite].framesMax
            this.currentFrame = 0
        }
    }
}