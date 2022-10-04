class newSprite {
    constructor({position, rightImagesSrc, leftImagesSrc, animationsStates, staggerFrames = 5, scale = 1, offset = {x: 0, y: 0}}) {
        this.position = position
        this.width = 50
        this.height = 150
        
        this.rImage = new Image()
        this.rImage.src = rightImagesSrc
        this.lImage = new Image()
        this.lImage.src = leftImagesSrc
   
        this.image = this.rImage
   
        
        this.scale = scale
        this.currentFrame = 0
        this.gameFrame = 0
        this.staggerFrames = staggerFrames
        this.offset = offset
        this.animationsStates = animationsStates
        
        this.spriteWidth = 288
        this.spriteHeight = 128

        this.animation_name = "sp_attack1"

        this.spriteAnimations = []

        this.animationsStates.forEach((state, index) => {
            let frames = {
                loc: []
            }
        
            for (let i = 0; i < state.frames; i++){
                let positionX = i * this.spriteWidth
                let positiony = index * this.spriteHeight
                
                frames.loc.push({x: positionX, y: positiony}) 
            }
        
            this.spriteAnimations[state.name] = frames
        })

    }
    
    draw() {

        this.currentFrame = Math.floor(this.gameFrame/this.staggerFrames) % this.spriteAnimations[this.animation_name].loc.length // #n of frames per row

        let frameX = this.spriteWidth * this.currentFrame
        let frameY = this.spriteAnimations[this.animation_name].loc[this.currentFrame].y
    
        c.drawImage(
            this.image, 
            frameX, frameY, 
            this.spriteWidth, this.spriteHeight, 
            this.position.x - this.offset.x, this.position.y - this.offset.y, 
            this.spriteWidth * this.scale, this.spriteHeight * this.scale
        )
        this.gameFrame++
    }

    update() {
        this.draw()
        
    }

    changeAnimationName(animation_name, facing) {
        if (facing === "left")
            this.image = this.lImage
        else {
            this.image = this.rImage
        }

        this.animation_name = animation_name
    }
}


class newFighter extends newSprite {
    constructor({
        position, 
        velocity,
        color,
        rightImagesSrc, 
        leftImagesSrc,
        animationsStates,
        scale = 1, 
        offset = {x: 0, y: 0}, 
        facing = 'right',
        sprites, 
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
        super({
            position,
            rightImagesSrc, 
            leftImagesSrc,
            animationsStates,
            scale,
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
        this.isDead = false
        this.coolPeriod = false

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
        this.switchSprite('attack1')
        this.isAttcking = true
        this.coolPeriod = true
        setTimeout(()=>{
            this.coolPeriod = false
        }, 100)
    }

    takeHit(attacker) {
        if (attacker.coolPeriod) {
            return
        } 
        console.log("unResisnting")
        this.health -= 10
        
        if (this.health <= 0) {
            this.switchSprite('death' + '_' + this.facing)
        }
        else {
            this.switchSprite('take_hit' + '_' + this.facing)
        }
    }
    update() {
        this.draw()
        
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
        if (this.animation_name === 'dead') {    
            if (this.currentFrame < this.spriteAnimations['dead'].loc.length - 1) {
                return
            }
        }
        if (this.animation_name === 'attack1') {    
            if (this.currentFrame < this.spriteAnimations['attack1'].loc.length - 1) {
                return
            }
        }
        if (this.animation_name === 'take_hit') {    
            if (this.currentFrame < this.spriteAnimations['take_hit'].loc.length - 1) {
                return
            }
        }

        this.changeAnimationName(sprite, this.facing)
        this.framesMax = this.spriteAnimations[this.animation_name].loc.length
        this.currentFrame = 0

    }
        // if (this.image === this.sprites['death' + '_' + this.facing].image) {
        //     if (this.currentFrame === this.sprites['death' + '_' + this.facing].framesMax - 1) 
        //         this.isDead = true
        //     return
        // }

        // if (this.image === this.sprites['attack1' + '_' + this.facing].image) {
        //     if (this.currentFrame < this.sprites['attack1' + '_' + this.facing].framesMax - 1) {
        //         return
        //     }
        // }

        // if (this.image === this.sprites['take_hit' + '_' + this.facing].image) {
        //     if (this.currentFrame < this.sprites['take_hit' + '_' + this.facing].framesMax - 1) {
        //         return
        //     }
        // }
       
        // if (this.image !== this.sprites[sprite].image) {
        //     this.image = this.sprites[sprite].image
        //     this.framesMax = this.sprites[sprite].framesMax
        //     this.currentFrame = 0
        // }
}














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
        if (!this.isDead) this.animateFrames()
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
        this.isDead = false
        this.coolPeriod = false

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
        this.coolPeriod = true
        setTimeout(()=>{
            this.coolPeriod = false
        }, 100)
    }

    takeHit(attacker) {
        if (attacker.coolPeriod) {
            return
        } 
        console.log("unResisnting")
        this.health -= 10
        
        if (this.health <= 0) {
            this.switchSprite('death' + '_' + this.facing)
        }
        else {
            this.switchSprite('take_hit' + '_' + this.facing)
        }
    }
    update() {
        this.draw()
        if (!this.isDead) this.animateFrames()
        
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
        if (this.image === this.sprites['death' + '_' + this.facing].image) {
            if (this.currentFrame === this.sprites['death' + '_' + this.facing].framesMax - 1) 
                this.isDead = true
            return
        }

        if (this.image === this.sprites['attack1' + '_' + this.facing].image) {
            if (this.currentFrame < this.sprites['attack1' + '_' + this.facing].framesMax - 1) {
                return
            }
        }

        if (this.image === this.sprites['take_hit' + '_' + this.facing].image) {
            if (this.currentFrame < this.sprites['take_hit' + '_' + this.facing].framesMax - 1) {
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