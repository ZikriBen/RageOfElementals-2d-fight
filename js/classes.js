class BaseSprite {
    constructor({position, imagesSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}, framsHold = 5}, key="") {
        this.position = position
        this.width = 50
        this.height = 150
        if (key === "") {
            this.image = new Image()
            this.image.src = imagesSrc
        }
        else {
            this.image = assets.get(key)
        }
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

class ComplexSprite {
    constructor({position, rightImagesSrc, leftImagesSrc, animationsStates, animationName, staggerFrames = 5, scale = 1, offset = {x: 0, y: 0}, keyLeft="", keyRight=""}) {
        this.position = position
        this.width = 50
        this.height = 150
        if (keyLeft === "") {
            this.lImage = new Image()
            this.lImage.src = leftImagesSrc
        }
        else {
            this.lImage = assets.get(keyLeft)
        }

        if (keyRight === "") {
            this.rImage = new Image()
            this.rImage.src = rightImagesSrc
        }
        else {
            this.rImage = assets.get(keyRight)
        }

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
        this.gameFrame++
        if (this.gameFrame % this.staggerFrames === 0) {
            this.currentFrame = (this.currentFrame + 1) % this.framesMax
        }
        this.frameX = this.spriteWidth * this.currentFrame
        // TODO: this Crashes!
        try {
            this.frameY = this.spriteAnimations[this.animationName].loc[this.currentFrame].y
        }
        catch {
        }
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

class Fighter extends ComplexSprite {
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
        type,
        offset = {x: 0, y: 0}, 
        facing = 'right',
        attackBox = { offset: {}, width: undefined, height: undefined },
        keyLeft="",
        keyRight=""
    }) {
        super({
            position,
            rightImagesSrc, 
            leftImagesSrc,
            animationName,
            animationsStates,
            scale,
            offset,
            keyLeft,
            keyRight
        })
        this.velocity = velocity
        this.gravity = 0.7
        this.defaulPos = structuredClone(position)
        this.width = 50
        this.height = 150
        this.isAttcking
        this.color = color
        this.type = type
        this.health = 100
        this.mana = 100
        this.currentFrame = 0
        this.framsTotal = 0
        this.framsHold = 5
        this.facing = facing
        this.isDead = false
        this.attackFrame = 0
        this.currentForce = 10
        this.defending = false
        this.lastKey
        this.comboStart = Date.now()
        this.comboIndex = 0
        this.combo = ['z', 'x', 'c']
        this.attackInfo = attackInfo
        this.attackTimer = null
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
        if (this.animationName === "sp_attack1") {
            return
        }
        this.switchSprite(this.attackInfo.attack.name, true)
        this.attackBox.width = this.attackInfo.attack.attackBox.width
        this.attackBox.height = this.attackInfo.attack.attackBox.height
        this.attackBox.offset = this.attackInfo.attack.attackBox.offset
        this.attackFrame = this.attackInfo.attack.attackFrame
        this.currentForce = this.attackInfo.attack.force
        this.isAttcking = true
    }
    attack2() {
        this.attackBox.width = this.attackInfo.attack2.attackBox.width
        this.attackBox.height = this.attackInfo.attack2.attackBox.height
        this.attackBox.offset = this.attackInfo.attack2.attackBox.offset
        this.attackFrame = this.attackInfo.attack2.attackFrame
        this.currentForce = this.attackInfo.attack2.force
        this.switchSprite(this.attackInfo.attack2.name)
        this.isAttcking = true
    }
    sp_attack1() {
        this.switchSprite(this.attackInfo.sp_attack1.name)
        this.attackBox.width = this.attackInfo.sp_attack1.attackBox.width
        this.attackBox.height = this.attackInfo.sp_attack1.attackBox.height
        this.attackBox.offset = this.attackInfo.sp_attack1.attackBox.offset
        this.attackFrame = this.attackInfo.sp_attack1.attackFrame
        this.currentForce = this.attackInfo.sp_attack1.force
        this.isAttcking = true
    }
    sp_attack2() {
        if (this.animationName === "sp_attack2" || this.mana < this.attackInfo.sp_attack2.mana) {
            // playSound(errorSound)
            return
        }
        this.attackBox.width = this.attackInfo.sp_attack2.attackBox.width
        this.attackBox.height = this.attackInfo.sp_attack2.attackBox.height
        this.attackBox.offset = this.attackInfo.sp_attack2.attackBox.offset
        this.attackFrame = this.attackInfo.sp_attack2.attackFrame
        this.currentForce = this.attackInfo.sp_attack2.force
        this.switchSprite(this.attackInfo.sp_attack2.name)
        this.isAttcking = true
        this.mana -= this.attackInfo.sp_attack2.mana
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

    turn(key, oppositKey, side) {
        if (this.animationName === 'death') 
            return
        
        keys[key].pressed = true
        this.lastKey = key
        if (this.animationName === 'sp_attack2') 
            return
        this.facing = side
        if (keys[oppositKey].pressed === true) {
            keys[oppositKey].pressed = false
            this.changeAnimationName('run', this.facing)
            return
        }
    }

    roll() {
        this.switchSprite('roll')
        this.defending = true
    }

    meditate() {
        if (!this.attackInfo.hasOwnProperty('meditate'))
            return
        else
            if (this.animationName === "meditate" || this.mana < this.attackInfo.meditate.mana) {
                return
            }
            this.switchSprite('meditate')
            this.mana -= this.attackInfo.meditate.mana
    }

    defend() {
        this.switchSprite('defend')
        this.defending = true
    }

    heal(hp) {
        if (this.health >= 100) 
            return
        else if (hp + this.health > 100)
            this.health == 100
        else
            this.health += hp
    }

    takeHit(force) {
        let hit;
        if (this.defending) 
            hit = Math.round(force / 10)
        else
            hit = force

        changeLife(this.type, this.health, hit)
        this.health -= hit
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
            x = this.position.x - this.attackBox.offset.x - this.attackBox.width
        }
        else {
            x = this.position.x + this.width + this.attackBox.offset.x
        }
        this.attackBox.position.x = x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
        

        // c.fillStyle = 'rgba(255, 0, 0, 0.35)'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        // c.fillStyle ='rgba(0, 0, 0, 0.35)'
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
            this.velocity.y += this.gravity
        }
    }

    switchSprite(sprite, force) {
        
        if (force && this.animationName !== 'death') {
            this.changeAnimationName(sprite, this.facing)
            this.framesMax = this.spriteAnimations[this.animationName].loc.length
            this.currentFrame = 0
            return
        }

        if (this.animationName === 'death') {    
            if (this.currentFrame < this.spriteAnimations['death'].loc.length - 1) 
                return
            this.isDead = true
        }
        if (this.animationName === 'air_attack' && sprite !== 'death') {   
            if (this.currentFrame < this.spriteAnimations['air_attack'].loc.length - 1) {
                return
            }
            this.isAttcking = false
        }
        if (this.animationName === 'take_hit' && sprite !== 'death') {    
            if (this.currentFrame < this.spriteAnimations['take_hit'].loc.length - 1) {
                return
            }
        }
        if (this.animationName === 'attack1' && sprite !== 'death') {
            if (this.currentFrame < this.spriteAnimations['attack1'].loc.length - 1) {
                return
            }
            this.isAttcking = false
        }
        if (this.animationName === 'attack2' && sprite !== 'death') { 
            if (this.currentFrame < this.spriteAnimations['attack2'].loc.length - 1) {
                return
            }
            this.isAttcking = false
        }
        if (this.animationName === 'sp_attack1' && sprite !== 'death') {   
            if (this.currentFrame < this.spriteAnimations['sp_attack1'].loc.length - 1) {
                return
            }
        }
        if (this.animationName === 'sp_attack2' && sprite !== 'death') {    
            if (this.currentFrame < this.spriteAnimations['sp_attack2'].loc.length - 1) {
                return
            }
            this.isAttcking = false
        }
        if (this.animationName === 'defend' && sprite !== 'death') {    
            if (this.currentFrame < this.spriteAnimations['defend'].loc.length - 1) {
                return
            }
            this.defending = false
        }
        if (this.animationName === 'meditate' && sprite !== 'death') {    
            if (this.currentFrame < this.spriteAnimations['meditate'].loc.length - 1) {
                return
            }
            this.heal(this.attackInfo.meditate.force)
        }
        if (this.animationName === 'roll' && sprite !== 'death') {    
            if (this.currentFrame < this.spriteAnimations['roll'].loc.length - 1) {
                return
            }
            this.defending = false
        }
        if (sprite !== this.animationName) {
            this.changeAnimationName(sprite, this.facing)
            this.framesMax = this.spriteAnimations[this.animationName].loc.length
            this.currentFrame = 0
        }
    }

    determineCombo(key) {
        if (this.attackInfo.sp_attack2.combo.length - 1 === this.comboIndex && (Date.now() - this.comboStart) < 800) {
            _doActionNoSpam(this, 'sp_attack1')
            player.comboIndex = 0
        }
    
        else if (key === this.attackInfo.sp_attack2.combo[this.comboIndex]) {
            this.comboIndex++
            return
        }
        this.comboStart = Date.now()
        this.comboIndex = 0
    }
    resetPosition() {
        this.position.x = this.defaulPos.x
    }
}

class ScrollingSprite {
    constructor(image, x, y, width, height, speed, scaleX = 1, scaleY = 1) {
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

class FullScrollingSprite {
    constructor(imagesSrc, x, y, width, height, speed, scaleX = 1, scaleY = 1, key="") {
        if (key === "") {
            this.image = new Image()
            this.image.src = imagesSrc
        }
        else {
            this.image = assets.get(key)
        }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleX = scaleX
        this.scaleY = scaleY

        this.bg1 = new ScrollingSprite(this.image, this.x, this.y, this.width, this.height, this.speed, this.scaleX, this.scaleY)
        this.bg2 = new ScrollingSprite(this.image, -this.width, this.y, this.width, this.height, this.speed, this.scaleX, this.scaleY);
    
    }

    draw(ctx) {
        this.bg1.scroll()
        this.bg1.draw(ctx)
        this.bg2.scroll()
        this.bg2.draw(ctx)
    }
}

class BG {
    constructor(ctx, canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.ctx = ctx
        this.layers = []
    }
    
    drawBG() {
        for (let i = 0; i < this.layers.length; i++){
            this.layers[i].draw(this.ctx)
        }
    }
}
class SingleBG extends BG{
    constructor(ctx, imagesSrc, canvasWidth, canvasHeight, key="") {
        super(ctx, canvasWidth, canvasHeight)
        this.layers = []
        this.scaleX=1.005
        this.scaleY=1
        this.layers.push(new FullScrollingSprite(imagesSrc, 0, 0, canvasWidth, canvasHeight, 0, this.scaleX, this.scaleY, key))
    }

    draw() {
        this.drawBG()
    }
}

class RTB extends BG{
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight)
        this.layers = []
        this.scaleX=1.005
        this.layers.push(new FullScrollingSprite('./img/rtb/background.png', 0, 0, canvasWidth, canvasHeight, 0.2))
        this.layers.push(new FullScrollingSprite('./img/rtb/background2.png', 0, 0, canvasWidth, canvasHeight, 0.5, this.scaleX))
        this.layers.push(new FullScrollingSprite('./img/rtb/background3.png', 0, 0, canvasWidth, canvasHeight, 1.2, this.scaleX))
        this.layers.push(new FullScrollingSprite('./img/rtb/background4.png', 0, 0, canvasWidth, canvasHeight, 1.6, this.scaleX))
    }

    draw() {
        this.drawBG()
    }
}

class MagicCliffs extends BG {
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight)
        this.layers = []
        this.scaleX=1.005
        this.layers.push(new FullScrollingSprite('./img/MagicCliffs/sky.png', 0, 0, canvas.width, canvas.height, 0.3))
        this.layers.push(new FullScrollingSprite('./img/MagicCliffs/clouds.png', 0, 150, canvas.width, canvas.height, 0.8, 1.005))
        this.layers.push(new FullScrollingSprite('./img/MagicCliffs/sea.png', 0, 420, canvas.width, canvas.height, 1.2, 1.005, 0.3))
        this.layers.push(new FullScrollingSprite('./img/MagicCliffs/far-grounds.png', 0, 480, canvas.width, canvas.height, 1.5, 0.5, 0.2))
    }

    draw() {
        this.drawBG()
    }
}

class RockyPass extends BG {
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight)
        this.layers = []
        this.layers.push(new FullScrollingSprite('./img/RockyPass/back.png', 0, 0, canvas.width, canvas.height, 0.5, 1.005))
        this.layers.push(new FullScrollingSprite('./img/RockyPass/middle.png', 0, 0, canvas.width, canvas.height, 1, 1.005))
        this.layers.push(new FullScrollingSprite('./img/RockyPass/near.png', 0, 0, canvas.width, canvas.height, 1.5, 1.005))
    }

    draw() {
        this.drawBG()
    }
}

class PixelFantasyCaves extends BG {
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight)
        this.layers = []
        this.layers.push(new FullScrollingSprite('./img/PixelFantasyCaves/background1.png', 0, 0, canvas.width, canvas.height, 0.2, 1.005))
        this.layers.push(new FullScrollingSprite('./img/PixelFantasyCaves/background2.png', 0, 0, canvas.width, canvas.height, 0.5, 1.005))
        this.layers.push(new FullScrollingSprite('./img/PixelFantasyCaves/background3.png', 0, 0, canvas.width, canvas.height, 0.8, 1.005))
        this.layers.push(new FullScrollingSprite('./img/PixelFantasyCaves/background4a.png', 0, 0, canvas.width, canvas.height, 1.2, 1.005))
        this.layers.push(new FullScrollingSprite('./img/PixelFantasyCaves/background4b.png', 0, 0, canvas.width, canvas.height, 1.5, 1.005))
    }

    draw() {
        this.drawBG()
    }
}

class TestBG extends BG {
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight)
        this.layers = []
        this.layers.push(new FullScrollingSprite('./img/bgs/background-fire.png', 0, 0, canvas.width, canvas.height, 0, 1.005))
        
    }

    draw() {
        this.drawBG()
    }
}