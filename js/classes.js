class newSprite {
    constructor({position, rightImagesSrc, leftImagesSrc, animationsStates, animationName, staggerFrames = 5, scale = 1, offset = {x: 0, y: 0}}) {
        this.position = position
        this.width = 50
        this.height = 150
        
        this.rImage = new Image()
        this.rImage.src = rightImagesSrc
        this.lImage = new Image()
        this.lImage.src = leftImagesSrc
   
        this.image = this.lImage
        
        this.scale = scale
        this.currentFrame = 0
        this.gameFrame = 0
        this.staggerFrames = staggerFrames
        this.offset = offset
        this.animationsStates = animationsStates
        
        this.spriteWidth = 288
        this.spriteHeight = 128
        this.frameX = 0
        this.frameY = 0
        this.isDead = false


        this.animationName = animationName
        

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

        this.framesMax = this.spriteAnimations[this.animationName].loc.length
    }
    
    draw() {
        c.drawImage(
            this.image, 
            this.frameX, this.frameY, 
            this.spriteWidth, this.spriteHeight, 
            this.position.x - this.offset.x, this.position.y - this.offset.y, 
            this.spriteWidth * this.scale, this.spriteHeight * this.scale
        )
    }

    animateFrames() {
        // this.currentFrame = Math.floor(this.gameFrame/this.staggerFrames) % this.spriteAnimations[this.animationName].loc.length
        // this.frameX = this.spriteWidth * this.currentFrame
        // this.frameY = this.spriteAnimations[this.animationName].loc[this.currentFrame].y
        // console.log(this.currentFrame)
        // this.gameFrame++
        
        this.gameFrame++
        if (this.gameFrame % this.staggerFrames === 0) {
            this.currentFrame = (this.currentFrame + 1) % this.framesMax
        }
        this.frameX = this.spriteWidth * this.currentFrame
        this.frameY = this.spriteAnimations[this.animationName].loc[this.currentFrame].y
    }

    update() {
        this.draw()
        if (!this.isDead) this.animateFrames()
    }

    changeAnimationName(animationName, facing) {
        if (facing === "left") {
            this.image = this.lImage
        }
        else {
            this.image = this.rImage
        }
        this.animationName = animationName
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
        animationName,
        attackInfo,
        scale = 1, 
        offset = {x: 0, y: 0}, 
        facing = 'right',
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
        super({
            position,
            rightImagesSrc, 
            leftImagesSrc,
            animationName,
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
        this.animationsStates = animationsStates
        this.animationName = animationName
        this.isDead = false
        this.attackFrame = 0
        this.currentForce = 10
        this.defending = false
        this.lastKey
        this.comboStart = Date.now()
        this.comboIndex = 0
        this.combo = ['z', 'x', 'c']
        this.attackInfo = attackInfo

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
        this.switchSprite(this.attackInfo.attack.name)
        this.attackBox.width = this.attackInfo.attack.attackBox.width
        this.attackBox.height = this.attackInfo.attack.attackBox.height
        this.attackBox.offset = this.attackInfo.attack.attackBox.offset
        this.attackFrame = this.attackInfo.attack.attackFrame
        this.currentForce = this.attackInfo.attack.force
        this.isAttcking = true
    }
    air_attack() {
        this.switchSprite(this.attackInfo.air_attack.name)
        this.attackBox.width = this.attackInfo.air_attack.attackBox.width
        this.attackBox.height = this.attackInfo.air_attack.attackBox.height
        this.attackBox.offset = this.attackInfo.air_attack.attackBox.offset
        this.attackFrame = this.attackInfo.air_attack.attackFrame
        this.currentForce = this.attackInfo.air_attack.force
        this.isAttcking = true
    }
    sp_attack1() {
        this.switchSprite(this.attackInfo.combo1.name)
        this.attackBox.width = this.attackInfo.combo1.attackBox.width
        this.attackBox.height = this.attackInfo.combo1.attackBox.height
        this.attackBox.offset = this.attackInfo.combo1.attackBox.offset
        this.attackFrame = this.attackInfo.combo1.attackFrame
        this.currentForce = this.attackInfo.combo1.force
        this.isAttcking = true
    }
    defend() {
        this.switchSprite('defend')
        this.defending = true
    }

    takeHit(attacker, force) {
        if (this.defending) 
            console.log("defend")
        else
            this.health -= force
        
        if (this.health <= 0) {
            this.switchSprite('death')
        }
        else {
            this.switchSprite('take_hit')
        }
    }
    update() {
        this.draw()
        if (!this.isDead) this.animateFrames()
        let x;
        if (this.facing === 'left') {
            // this.facingOffset = this.attackBox.width + this.attackBox.offset.x - this.width // 50 + 50 - 50
            x = this.position.x - this.attackBox.offset.x - this.attackBox.width
        }
        else {
            x = this.position.x + this.width + this.attackBox.offset.x
        }
        // this.attackBox.position.x = this.position.x - this.attackBox.offset.x - this.attackBox.width
        this.attackBox.position.x = x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
        

        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        // c.fillStyle = 'black'
        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
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
        if (this.animationName === 'death') {    
            if (this.currentFrame >= this.spriteAnimations['death'].loc.length - 1) {
                this.isDead = true
            }
            return
        }
        if (this.animationName === 'air_attack') {   
            if (this.currentFrame < this.spriteAnimations['air_attack'].loc.length - 1) {
                return
            }
            this.isAttcking = false
        }
        if (this.animationName === 'attack1') {   
            if (this.currentFrame < this.spriteAnimations['attack1'].loc.length - 1) {
                return
            }
            this.isAttcking = false
        }
        if (this.animationName === 'sp_attack1') {    
            if (this.currentFrame < this.spriteAnimations['sp_attack1'].loc.length - 1) {
                return
            }
        }
        if (this.animationName === 'sp_attack2') {    
            if (this.currentFrame < this.spriteAnimations['sp_attack2'].loc.length - 1) {
                return
            }
            this.isAttcking = false
        }
        if (this.animationName === 'defend') {    
            if (this.currentFrame < this.spriteAnimations['defend'].loc.length - 1) {
                return
            }
            this.defending = false
        }
        if (this.animationName === 'take_hit') {    
            if (this.currentFrame < this.spriteAnimations['take_hit'].loc.length - 1) {
                return
            }
        }
        if (sprite !== this.animationName) {
            this.changeAnimationName(sprite, this.facing)
            this.framesMax = this.spriteAnimations[this.animationName].loc.length
            this.currentFrame = 0
        }
    }

    determineCombo(key) {
        if (this.attackInfo.combo1.combo.length - 1 === this.comboIndex && (Date.now() - this.comboStart) < 800) {
            console.log("Combo")
            _doActionNoSpam(this, 'sp_attack1')
            player.comboIndex = 0
        }
    
        else if (key === this.attackInfo.combo1.combo[this.comboIndex]) {
            this.comboIndex++
            return
        }
        this.comboStart = Date.now()
        this.comboIndex = 0
    }
}












class Sprite {
    constructor({position, imagesSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}, framsHold = 5}) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imagesSrc
        this.scale = scale
        this.framesMax = framesMax
        this.currentFrame = 0
        this.framsTotal = 0
        this.framsHold = framsHold
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
        // this.coolPeriod = false

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

    takeHit(attacker, force) {

        this.health -= force
        
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


class ScrollingSprite {
    constructor(image, x, y, width, height, speed,scaleX = 1, scaleY = 1) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleX = scaleX
        this.scaleY = scaleY

    }

    scroll() {
        this.x -= this.speed;
        if (this.x <= -this.width) {
            this.x = this.width - 1;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width * this.scaleX, this.height * this.scaleY);
    }
}