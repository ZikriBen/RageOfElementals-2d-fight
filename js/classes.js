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
        this.mana = 100
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
        if (this.animationName === "sp_attack1") {
            return
        }
        console.log("attack")
        this.switchSprite(this.attackInfo.attack.name)
        this.attackBox.width = this.attackInfo.attack.attackBox.width
        this.attackBox.height = this.attackInfo.attack.attackBox.height
        this.attackBox.offset = this.attackInfo.attack.attackBox.offset
        this.attackFrame = this.attackInfo.attack.attackFrame
        this.currentForce = this.attackInfo.attack.force
        this.isAttcking = true
    }
    attack2() {
        console.log("attack2")
        this.attackBox.width = this.attackInfo.attack2.attackBox.width
        this.attackBox.height = this.attackInfo.attack2.attackBox.height
        this.attackBox.offset = this.attackInfo.attack2.attackBox.offset
        this.attackFrame = this.attackInfo.attack2.attackFrame
        this.currentForce = this.attackInfo.attack2.force
        this.switchSprite(this.attackInfo.attack2.name)
        this.isAttcking = true
    }
    sp_attack1() {
        console.log("sp_attack1")
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
        console.log("sp_attack2")
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

    roll() {
        this.switchSprite('roll')
        this.defending = true
    }

    meditate() {
        if (!this.attackInfo.hasOwnProperty('meditate'))
            return
        else
            if (this.animationName === "meditate" || this.mana < this.attackInfo.meditate.mana) {
                // playSound(errorSound)
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

    takeHit(attacker, force) {
        if (this.defending) 
            this.health -= Math.round(force / 10)
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
            x = this.position.x - this.attackBox.offset.x - this.attackBox.width
        }
        else {
            x = this.position.x + this.width + this.attackBox.offset.x
        }
        this.attackBox.position.x = x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
        

        c.fillStyle = 'rgba(255, 0, 0, 0.35)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.fillStyle ='rgba(0, 0, 0, 0.35)'
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

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
            console.log("Combo")
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
    constructor(imagesSrc, x, y, width, height, speed, scaleX = 1, scaleY = 1) {
        this.image = new Image()
        this.image.src = imagesSrc
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleX = scaleX
        this.scaleY = scaleY

        this.bg1 = new ScrollingSprite(this.image, this.x, this.y, canvas.width, canvas.height, this.speed, this.scaleX, this.scaleY)
        this.bg2 = new ScrollingSprite(this.image, -this.width, this.y, canvas.width, canvas.height, this.speed, this.scaleX, this.scaleY);
    
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


class RTB extends BG{
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight)
        this.layers = []
        this.scaleX=1.005
        this.layers.push(new FullScrollingSprite('./img/rtb/background.png', 0, 0, canvas.width, canvas.height, 0.2))
        this.layers.push(new FullScrollingSprite('./img/rtb/background2.png', 0, 0, canvas.width, canvas.height, 0.5, this.scaleX))
        this.layers.push(new FullScrollingSprite('./img/rtb/background3.png', 0, 0, canvas.width, canvas.height, 1.2, this.scaleX))
        this.layers.push(new FullScrollingSprite('./img/rtb/background4.png', 0, 0, canvas.width, canvas.height, 1.6, this.scaleX))
    }

    draw() {
        this.drawBG()
    }
}

class MagicCliffs extends BG{
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

class RockyPass extends BG{
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

class PixelFantasyCaves extends BG{
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

class StartScreenCLS {
    constructor(ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.currentBG = 0
        this.bgs = []
        this.bgs.push(new RTB(this.ctx, this.canvasWidth, this.canvasHeight))
        this.bgs.push(new PixelFantasyCaves(this.ctx, this.canvasWidth, this.canvasHeight))
        this.bgs.push(new RockyPass(this.ctx, this.canvasWidth, this.canvasHeight))
        this.bgs.push(new MagicCliffs(this.ctx, this.canvasWidth, this.canvasHeight))
        this.mainSprite
        this.switchDuration = 5000
        this.selections = [' 1P vs 2P ', ' Controls ']
        this.currentSelection = 0
        this.interval
    }

    init() {
        this.mainSprite = this.logo = new Sprite({position: {x: 240, y: 180}, imagesSrc: './img/ElementalLogo.png', scale: 2, framesMax: 1})
        this.instructions = new Sprite({position: {x: 150, y: 60}, imagesSrc: './img/instructions.png', scale: 2.5, framesMax: 1})
        document.querySelector('#start_btn').style.display = 'block'
        document.querySelector('#start_btn').style.left = '42%'
        document.querySelector('#info_btn').style.left = '42%'
        document.querySelector('#start_btn').value = '• 1P vs 2P •'
        document.querySelector('#info_btn').value = '  Controls  '
        
        this.switchBG()
    }

    delete() {
        clearInterval(this.interval)
        this.logo = null
        this.instructions = null
        document.querySelector('#start_btn').style.display = 'none'
        document.querySelector('#info_btn').style.display = 'none'
        setTimeout(()=> {this.mainSprite = null}, 1500)
    }

    draw() {
        this.bgs[this.currentBG].draw(this.ctx)
        this.mainSprite.update()
    }

    switchBG() {
        this.interval = setInterval(() => {
            console.log("Fading")
            gsap.to(overlay, {opacity: 1, duration: 0.8})
            
            setTimeout( ()=> {this.currentBG = (this.currentBG + 1) % this. bgs.length}, 1500)
   
            setTimeout(gsap.to, 1500, overlay, {opacity: 0, duration: 2})
        }, this.switchDuration)
    }
    
    showInstructions() {
        this.mainSprite = this.instructions
    }

    showLogo() {
        this.mainSprite = this.logo
    }

    setSelection() {
        if (this.currentSelection === 0) {
            document.querySelector('#start_btn').value = "•" + this.selections[0] + "•"
            document.querySelector('#info_btn').value = " " + this.selections[1] + " "
        }
        else if (this.currentSelection === 1) {
            document.querySelector('#start_btn').value = " " + this.selections[0] + " "
            document.querySelector('#info_btn').value = "•" + this.selections[1] + "•"
        }
    }

    keyFunc(key) {
        if (key === "Enter" || key === " ") {
            this.invokeSelection()
        }
        else if (key === "y") {
            startScreenIns.showInstructions()
        }
        else if (key === "ArrowUp" || 'w') {
            this.currentSelection = (this.currentSelection + 1) % this.selections.length
            startScreenIns.setSelection()
        }
        else if (key === "ArrowDown" || 'd') {
            this.currentSelection = (this.currentSelection - 1) % this.selections.length
            if (this.currentSelection < 0)
                this.currentSelection = this.selections.length - 1
            startScreenIns.setSelection()
        }
    }

    invokeSelection() {
        if (this.currentSelection === 0) {
            _doFuncNoSpam(fadeFunc, charSelect)
            this.delete()
        }
        else if (this.currentSelection === 1) {
            this.showInstructions()
        }
    }
}

class CharSelectCLS {
    constructor() {
        this.arrow1Pos = 0
        this.arrow2Pos = 1
        this.arrowStartPos = 115
        this.charStartPos = -220
        this.charOffset = 200
        this.beepSound = new Audio('./music/mixkit-video-game-mystery-alert-234.wav');
        this.selectSound = new Audio('./music/mixkit-arcade-bonus-alert-767.wav');
        this.playerSelected = false
        this.enemySelected = false
        this.fighters = []
        this.characters = []
    }

    init() {
        document.querySelector('#start_btn').style.display = 'none'
        document.querySelector('#displayText').style.display = 'flex'
        document.querySelector('#displayText').innerHTML = 'Select Character:'
        
        this.arrow1 = new Sprite({position: {x: this.arrowStartPos, y: 295}, imagesSrc: './img/arrow_p1p.png', scale: 0.3, framesMax: 5})
        this.arrow2 = new Sprite({position: {x: this.arrowStartPos + this.charOffset, y: 295}, imagesSrc: './img/arrow_p2p.png', scale: 0.3, framesMax: 5, framsHold: 3})
        
        this.fighters = [fireFighter, groundFighter, windFighter, waterFighter, metalFighter]
    
        for (let i = 0; i < this.fighters.length; i++){
            this.characters.push(new Sprite({position: {x: this.charStartPos, y: 160}, imagesSrc: this.fighters[i].idle_bw_png, scale: 2.5, framesMax: this.fighters[i].idle_frames}))
            this.charStartPos += this.charOffset
        }
    }

    delete() {
        // this.playerSelected = false
        // this.enemySelected = false
        // this.arrow1Pos = 0
        // this.arrow2Pos = 1
        this.arrowStartPos = 115
        this.charStartPos = -220
        document.querySelector('#displayText').style.display = 'none'
    }

    draw() {
        this.arrow1.update()
        this.arrow2.update()

        for (let i = 0; i < this.characters.length; i++){
            this.characters[i].update()
        }

        this.characters[this.arrow1Pos].image.src = this.fighters[this.arrow1Pos].idle_png
        this.characters[this.arrow2Pos].image.src = this.fighters[this.arrow2Pos].idle_png
    }

    keyFunc(key) {
        switch (key) {
            case 'ArrowRight':
                if (!this.enemySelected) 
                this.arrow2Pos = this.moveArrow(this.arrow2, this.arrow2Pos, 1)
                if (this.arrow1Pos == this.arrow2Pos)
                        this.arrow2Pos = this.moveArrow(this.arrow2, this.arrow2Pos, 1)
                break
            case 'ArrowLeft':
                if (!this.enemySelected) 
                    this.arrow2Pos = this.moveArrow(this.arrow2, this.arrow2Pos, -1)
                    if (this.arrow1Pos == this.arrow2Pos)
                        this.arrow2Pos = this.moveArrow(this.arrow2, this.arrow2Pos, -1)
                break
            case 'Enter':
                this.enemyFighter = this.fighters[this.arrow2Pos]
                this.enemySelected = true
                this.arrow2.framsHold = 0
                console.log(this.enemyFighter.name)
                this.invokeSelection()
                break
            
            case 'd':
                if (!this.playerSelected) 
                    this.arrow1Pos = this.moveArrow(this.arrow1, this.arrow1Pos, 1)
                    if (this.arrow1Pos == this.arrow2Pos)
                        this.arrow1Pos = this.moveArrow(this.arrow1, this.arrow1Pos, 1)
                break
            case 'a':
                if (!this.playerSelected) 
                    this.arrow1Pos = this.moveArrow(this.arrow1, this.arrow1Pos, -1)
                    if (this.arrow1Pos == this.arrow2Pos)
                        this.arrow1Pos = this.moveArrow(this.arrow1, this.arrow1Pos, -1)
                break
            case ' ':
                this.playerFighter = this.fighters[this.arrow1Pos]
                this.playerSelected = true
                this.arrow1.framsHold = 0
                console.log(this.playerFighter.name)
                this.invokeSelection()
                break
        }
    }
    
    moveArrow(arrow, arrowPos, direcrtion) {
        playSound(this.beepSound)
        this.characters[arrowPos].image.src = this.fighters[arrowPos].idle_bw_png
        arrowPos = (arrowPos + direcrtion) % this.characters.length
        if (arrowPos < 0)
            arrowPos = this.characters.length - 1
            arrow.position.x = this.arrowStartPos + (arrowPos * this.charOffset)
        return arrowPos
    }

    invokeSelection() {
        playSound(this.selectSound)
        if (this.playerSelected && this.enemySelected) {
            this.delete()
            _doFuncNoSpam(fadeFunc, startGame)
        }
    }

    getPlayerFighter() {
        if (this.playerSelected) {
            console.log(this.arrow1Pos)
            return this.fighters[this.arrow1Pos]
        }
        return fireFighter
    }

    getEnemyFighter() {
        if (this.enemySelected) {
            console.log(this.arrow2Pos)
            return this.fighters[this.arrow2Pos]
        }
        return waterFighter
    }
}

class GameScreenCLS {
    constructor(ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.gameBackgorund
        this.shop
        this.gameTime = 100
        this.player
        this.enemy
        this.manaInterval
        this.timerInterval
    }

    init(playerFighter, enemyFighter) {
        console.log("Game screen init")
        this.gameBackgorund = new Sprite({position: {x: 0, y: 0}, imagesSrc: './img/background.png'})
        this.shop = new Sprite({position: {x: 625, y: 160}, imagesSrc: './img/shop.png', scale: 2.5, framesMax: 6})
        this.player = new newFighter({
            position: {x: 250, y: 0}, 
            velocity: {x: 0, y: 0}, 
            offset: playerFighter.offset,
            rightImagesSrc: playerFighter.SpriteSheetRight, 
            leftImagesSrc: playerFighter.SpriteSheetLeft, 
            animationsStates: playerFighter.AnimationStates, 
            attackInfo: playerFighter.AttackInfo, 
            scale: playerFighter.scale,
            animationName: "idle",
            facing: "right",
            attackBox :{
                offset: {
                    x: 0,
                    y: 50
                },
                width: 100,
                height: 50
            }
        })
    
        this.enemy = new newFighter({
            position: {x: 600, y: 0}, 
            velocity: {x: 0, y: 0}, 
            offset: enemyFighter.offset, 
            rightImagesSrc: enemyFighter.SpriteSheetRight, 
            leftImagesSrc: enemyFighter.SpriteSheetLeft, 
            animationsStates: enemyFighter.AnimationStates, 
            attackInfo: enemyFighter.AttackInfo, 
            scale: enemyFighter.scale,
            animationName: "idle",
            facing: "left",
            attackBox :{
                offset: {
                    x: 0,
                    y: 50
                },
                width: 100,
                height: 50
            }
        })
        document.querySelector('#health_bars').style.display = 'flex'
        document.querySelector('#player_health_bar').style.display = 'flex'
        document.querySelector('#enemy_health_bar').style.display = 'flex'
        document.querySelector('#start_btn').style.display = 'none'
        document.querySelector('#playerName').innerHTML = playerFighter.name
        document.querySelector('#enemyName').innerHTML = enemyFighter.name
        document.querySelector('#displayText').style.display = 'none'
        
        document.querySelector('#playerMana').style.width = '100%'
        document.querySelector('#enemyMana').style.width = '100%'
        document.querySelector('#enemyMana').style.left = '0%'
        this.isStarted = true
        this.decreaseTimer()
        this.manaRaise()
    }

    delete() {
        this.isStarted = false
        this.gameTime = 100
        this.gameBackgorund = null
        this.shop = null
        this.player = null
        this.enemy = null
        clearInterval(this.manaInterval)
        clearInterval(this.timerInterval)
        // clearTimeout(this.timerId)
    }

    draw() {
        this.gameBackgorund.update()
        this.shop.update()
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.player.update();
        this.enemy.update();
    }

    keyFunc(key) {
        if (!this.player.isDead) {
            this.player.determineCombo(key)
            switch (key) {
                case 'd':
                    turn(this.player, 'd', 'a', 'right')
                    break
                case 'a':
                    turn(this.player, 'a', 'd', 'left')
                    break
                case 'w':
                    this.player.velocity.y = -18
                    break
                case 'e':
                    this.player.defend()
                    break
                case ' ':
                    if (this.player.velocity.y !== 0) {
                        _doActionNoSpam(this.player, 'air_attack')
                        break
                    }
                    if (this.player.animationName === 'attack1' && this.player.currentFrame >= this.player.attackFrame) {
                        _doActionNoSpam(player, 'attack2')
                        break
                    }
                    else if (this.player.animationName === 'attack2' && this.player.currentFrame >= this.player.attackFrame) {
                        _doActionNoSpam(this.player, 'sp_attack1')
                        break
                    }
                    else {
                        _doActionNoSpam(this.player, 'attack1')
                    }
                    break
                case 'r':
                    _doActionNoSpam(this.player, 'meditate')
                    break
                case 'q':
                    _doActionNoSpam(this.player, 'sp_attack2')
                    break
                case 'z':
                    this.player.lastKey = 'z'
                    break
                case 'x':
                    this.player.lastKey = 'x'
                    break
                case 'c':
                    this.player.lastKey = 'c'
                    break
            }
        }
        if (!this.enemy.isDead) {
            this.enemy.determineCombo(key)
            switch (key) {
                case 'ArrowRight':
                    turn(this.enemy, 'ArrowRight', 'ArrowLeft', 'right')
                    break
                case 'ArrowLeft':
                    turn(this.enemy, 'ArrowLeft', 'ArrowRight', 'left')
                    break
                case 'ArrowUp':
                    this.enemy.velocity.y = -18
                    break
                case '0':
                    if (this.enemy.velocity.y !== 0) {
                        _doActionNoSpam(this.enemy, 'air_attack')
                        break
                    }
                    if (this.enemy.animationName === 'attack1' && this.enemy.currentFrame >= this.player.attackFrame) {
                        _doActionNoSpam(this.enemy, 'attack2')
                        break
                    }
                    else if (this.enemy.animationName === 'attack2' && this.enemy.currentFrame >= this.player.attackFrame) {
                        _doActionNoSpam(this.enemy, 'sp_attack1')
                        break
                    }
                    else {
                        _doActionNoSpam(this.enemy, 'attack1')
                    }
                    break
                case '1':
                    _doActionNoSpam(this.enemy, 'sp_attack2')
                    break
                case '9':
                    this.enemy.defend()
                    break
                case '7':
                    _doActionNoSpam(this.enemy, 'meditate')
                    break
            }
        }
    }
    
    manaRaise() {
        this.manaInterval = setInterval(() => {
            if (player.mana < 100) {
                console.log("ASD")
                player.mana += 2
                document.querySelector('#playerMana').style.width = player.mana + '%'
            }
            if (enemy.mana < 100) {
                enemy.mana += 2
                document.querySelector('#enemyMana').style.width = enemy.mana + '%'
                document.querySelector('#enemyMana').style.left = Math.abs(100 - enemy.mana) + '%'
            }
        }, 1000)
    }

    decreaseTimer() {
        this.timerInterval = setInterval(() => {
            if (this.gameTime > 0) {
                this.timerId = setTimeout(this.decreaseTimer, 1000)
                this.gameTime--
                document.querySelector('#timer').innerHTML = this.gameTime
            }
            if (this.gameTime === 0) {
                // this.delete()
                this.determineWinner()
            }
        }, 1000)
             
    }

    determineWinner() {
        // if (this.isStarted === false)
        //     return
        document.querySelector('#timer').innerHTML = '00'
        // clearTimeout(timerId)
        document.querySelector('#displayText').style.display = 'flex'
    
        if (this.player.health === this.enemy.health) {
            document.querySelector('#displayText').innerHTML = 'Tie'
        }
        else if(this.player.health > this.enemy.health) {
            document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
            
        }
        else if(this.player.health < this.enemy.health) {
            document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
        }
    }

    getPlayer() {
        return this.player
    }
    getEnemy() {
        return this.enemy
    }
    
}