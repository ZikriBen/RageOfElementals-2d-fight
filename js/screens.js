
// import { loadImage, loadSound } from "./assetLoader";

class Screen {
    constructor(ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
    }

    init() {}
    delete() {}
    draw() {}
    keyFunc(key) {}
}

class StartScreenCLS extends Screen{
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight)
        this.currentBG = 0
        this.bgs = []
        this.bgs.push(new RTB(this.ctx, this.canvasWidth, this.canvasHeight))
        this.bgs.push(new PixelFantasyCaves(this.ctx, this.canvasWidth, this.canvasHeight))
        this.bgs.push(new RockyPass(this.ctx, this.canvasWidth, this.canvasHeight))
        this.bgs.push(new MagicCliffs(this.ctx, this.canvasWidth, this.canvasHeight))
        this.mainSprite
        this.switchDuration = 8000
        this.selections = [' 1P vs PC ', ' 1P vs 2P ', ' Controls ']
        this.currentSelection = 0
        this.interval
        this.startPveBtn
        this.startPvpBtn
        this.infoBtn
        this.beepSound = assets.get('beep')
        this.selectSound = assets.get('select')
    }

    init() {
        this.mainSprite = this.logo = new BaseSprite({position: {x: 375, y: 180}, imagesSrc: './img/ElementalLogo.png', scale: 2, framesMax: 1}, 'logo')
        this.instructions = new BaseSprite({position: {x: 300, y: 60}, imagesSrc: './img/instructions.png', scale: 2.5, framesMax: 1}, 'instructions')
        document.querySelector('#baseDiv').style.width = compCanvasWidth
        document.querySelector('#baseDiv').style.height = compCanvasHeight
        
        this.handleTouch = this.handleTouch.bind(this);
        this.startPveBtn = document.getElementById('start_pve_btn');
        this.startPvpBtn = document.getElementById('start_pvp_btn');
        this.infoBtn = document.getElementById('info_btn');

        // Add touchstart event listeners to the buttons
        this.startPveBtn.addEventListener('touchstart', this.handleTouch);
        this.startPvpBtn.addEventListener('touchstart', this.handleTouch);
        this.infoBtn.addEventListener('touchstart', this.handleTouch);
        this.resetButtons()
        this.showLogo()
        this.switchBG()

        // if (isSoundOn) {
        //     playMusic(battleMusic, 'play')
        // }
        // const intro = assets.get('intro');
        // intro.play()
    }


    delete() {
        clearInterval(this.interval)
        this.logo = null
        this.instructions = null
        document.querySelector('#start_pve_btn').style.display = 'none'
        document.querySelector('#start_pvp_btn').style.display = 'none'
        document.querySelector('#info_btn').style.display = 'none'
        setTimeout(()=> {this.mainSprite = null}, 1500)
    }

    draw() {
        this.bgs[this.currentBG].draw(this.ctx)
        this.mainSprite.update()
    }

    switchBG() {
        this.interval = setInterval(() => {
            gsap.to(overlay, {opacity: 1, duration: 0.8})
            
            setTimeout( ()=> {this.currentBG = (this.currentBG + 1) % this. bgs.length}, 1500)
   
            setTimeout(gsap.to, 1500, overlay, {opacity: 0, duration: 2})
        }, this.switchDuration)
    }
    
    resetButtons() {
        this.currentSelection = 0
        
        document.querySelector('#start_pve_btn').style.display = 'block'
        document.querySelector('#info_btn').style.display = 'block'
        if (isMobile) {
            document.querySelector('#start_pve_btn').value =  this.selections[0]
            document.querySelector('#start_pvp_btn').style.display = 'none'
        }
        else{
            document.querySelector('#start_pvp_btn').style.display = 'block'
            document.querySelector('#start_pve_btn').value = "•" + this.selections[0] + "•"
        }
        
        document.querySelector('#start_pvp_btn').value = " " + this.selections[1] + " "
        document.querySelector('#info_btn').value = " " + this.selections[2] + " "
    }

    showInstructions() {
        if (this.mainSprite === this.instructions) {
            this.resetButtons()
            this.showLogo()
        }
        else {
            this.mainSprite = this.instructions
            document.querySelector('#start_pve_btn').style.display = 'none'
            document.querySelector('#start_pvp_btn').style.display = 'none'
            if (isMobile)
                document.querySelector('#info_btn').value = " Back "
            else
                document.querySelector('#info_btn').value = "•  Back  •"
        }
    }

    showLogo() {
        this.mainSprite = this.logo
    }

    setSelection() {
        _doFuncNoSpam(playSound, this.beepSound, 10)
        if (this.currentSelection === 0) {
            document.querySelector('#start_pve_btn').value = "•" + this.selections[0] + "•"
            document.querySelector('#start_pvp_btn').value = " " + this.selections[1] + " "
            document.querySelector('#info_btn').value = " " + this.selections[2] + " "
        }
        else if (this.currentSelection === 1) {
            document.querySelector('#start_pve_btn').value = " " + this.selections[0] + " "
            document.querySelector('#start_pvp_btn').value = "•" + this.selections[1] + "•"
            document.querySelector('#info_btn').value = " " + this.selections[2] + " "
        }
        else if (this.currentSelection === 2) {
            document.querySelector('#start_pve_btn').value = " " + this.selections[0] + " "
            document.querySelector('#start_pvp_btn').value = " " + this.selections[1] + " "
            document.querySelector('#info_btn').value = "•" + this.selections[2] + "•"
        }
    }

    keyFunc(key) {
        if (key === "Enter" || key === " ") {
            playSound(this.selectSound)
            this.invokeSelection()
        }
        else if (this.mainSprite === this.instructions) {
            return
        }
        else if (key === "ArrowUp" || key === "w") {
            this.currentSelection = (this.currentSelection - 1) % this.selections.length
            if (this.currentSelection < 0)
                this.currentSelection = this.selections.length - 1
            startScreenIns.setSelection()
        }
        else if (key === "ArrowDown" || key === "s") {
            this.currentSelection = (this.currentSelection + 1) % this.selections.length
            if (this.currentSelection < 0)
                this.currentSelection = this.selections.length - 1
            startScreenIns.setSelection()
        }
    }

    invokeSelection() {
        
        if (this.currentSelection === 0) {
            _doFuncNoSpam(fadeFunc, charSelect)
            gameMode = 'pve'
            this.delete()
        }
        else if (this.currentSelection === 1) {
            _doFuncNoSpam(fadeFunc, charSelect)
            gameMode = 'pvp'
            this.delete()
        }
        else if (this.currentSelection === 2) {
            this.showInstructions()
        }
    }

    // Function to handle touch events
    handleTouch(event) {
        // Prevent the default behavior to avoid unwanted interactions
        event.preventDefault();

        // Your code to handle the touch event goes here
        if (event.target.id === 'start_pvp_btn') {
            _doFuncNoSpam(fadeFunc, charSelect)
            gameMode = 'pvp'
            this.delete()
        }
        else if (event.target.id === 'start_pve_btn') {
            _doFuncNoSpam(fadeFunc, charSelect)
            gameMode = 'pve'
            this.delete()
        }
        else {
            this.showInstructions()
        }
    }
}

class CharSelectCLS extends Screen{
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight)
        this.arrow1Pos = 0
        this.arrow2Pos = 1
        this.arrowStartPos = 145
        this.charStartPos = -190
        this.charOffset = 230
        this.beepSound = new Audio('./music/mixkit-video-game-mystery-alert-234.wav');
        this.selectSound = new Audio('./music/mixkit-arcade-bonus-alert-767.wav');
        this.playerSelected = false
        this.enemySelected = false
        this.selectedPlayer
        this.selectedEnemy
        this.fighters = []
        this.characters = []
        this.power = []
        this.hp = []
        this.names = []
        this.touchArrowLeft
        this.touchArrowRight
        this.circleButton
    }

    init() {
        this.arrow1Pos = 0
        this.arrow2Pos = 1
        document.querySelector('#start_pve_btn').style.display = 'none'
        document.querySelector('#start_pvp_btn').style.display = 'none'
        
        document.querySelector('#displayText').style.display = 'flex'
        document.querySelector('#displayText').style.top = '-200'
        document.querySelector('#displayText').innerHTML = 'Select Character:'

        
        if (isMobile) {
            document.querySelector('#leftArrow').style.display = 'inline'
            document.querySelector('#rightArrow').style.display = 'inline'
            document.querySelector('#circleButton1').style.display = 'inline'
            this.handleTouchLeft = this.handleTouchLeft.bind(this);
            this.handleTouchRight = this.handleTouchRight.bind(this);
            this.touchArrowLeft = document.getElementById('leftArrow');
            this.touchArrowRight = document.getElementById('rightArrow');
            this.touchArrowLeft.addEventListener('touchstart', this.handleTouchLeft);
            this.touchArrowRight.addEventListener('touchstart', this.handleTouchRight);
    
            this.handleTouchCircle = this.handleTouchCircle.bind(this);
            this.circleButton = document.getElementById('circleButton1');
            this.circleButton.addEventListener('touchstart', this.handleTouchCircle);
        }
        
        this.arrow1 = new BaseSprite({position: {x: this.arrowStartPos, y: 235}, imagesSrc: './img/arrow_p1p.png', scale: 0.3, framesMax: 5})
        this.arrow2 = new BaseSprite({position: {x: this.arrowStartPos + this.charOffset, y: 235}, imagesSrc: './img/arrow_p2p.png', scale: 0.3, framesMax: 5, framsHold: 3})
        
        this.fighters = [fireFighter, groundFighter, windFighter, waterFighter, metalFighter]
        console.log(assets.get(`${this.fighters[0].keyPower}_bw`))
        if (this.characters.length === 0) {
            for (let i = 0; i < this.fighters.length; i++){
                this.names.push(new BaseSprite({position: {x: this.charStartPos+ 280, y: 440}, imagesSrc: this.fighters[i].name_png, scale: 2, framesMax: 1}))
                this.power.push(new BaseSprite({position: {x: this.charStartPos + 280, y: 460}, imagesSrc: this.fighters[i].pwr_bw_png, scale: 2, framesMax: 1}))
                this.hp.push(new BaseSprite({position: {x: this.charStartPos + 280, y: 480}, imagesSrc: this.fighters[i].hp_bw_png, scale: 2, framesMax: 1}))
                this.characters.push(new BaseSprite({position: {x: this.charStartPos, y: 100}, imagesSrc: this.fighters[i].idle_bw_png, scale: 2.5, framesMax: this.fighters[i].idle_frames}))
                this.charStartPos += this.charOffset
            }
        }
        
        for (let i = 0; i < this.characters.length; i++){
            this.characters[i].image.src = this.fighters[i].idle_bw_png
        }
    }

    delete() {
        this.playerSelected = false
        this.enemySelected = false

        if (isMobile) {
            this.touchArrowLeft.style.display = 'none'
            this.touchArrowRight.style.display = 'none'
            this.touchArrowLeft.removeEventListener('touchstart', this.handleTouchLeft)
            this.touchArrowRight.removeEventListener('touchstart', this.handleTouchRight)
            
            this.circleButton.removeEventListener('touchstart', this.handleTouchCircle)
        }
        document.querySelector('#displayText').style.display = 'none'
    }

    draw() {
        this.arrow1.update()
        if (gameMode === 'pvp')
            this.arrow2.update()

        for (let i = 0; i < this.characters.length; i++){
            this.characters[i].update()
            this.power[i].update()
            this.hp[i].update()
            this.names[i].update()
        }
        
        this.characters[this.arrow1Pos].image.src = this.fighters[this.arrow1Pos].idle_png
        this.power[this.arrow1Pos].image.src = this.fighters[this.arrow1Pos].pwr_png
        this.hp[this.arrow1Pos].image.src = this.fighters[this.arrow1Pos].hp_png

        if (gameMode === 'pvp') {
            this.characters[this.arrow2Pos].image.src = this.fighters[this.arrow2Pos].idle_png
            this.power[this.arrow2Pos].image.src = this.fighters[this.arrow2Pos].pwr_png
            this.hp[this.arrow2Pos].image.src = this.fighters[this.arrow2Pos].hp_png
        }
        

    }
    handleTouchLeft(event) {
        event.preventDefault();
        this.keyFunc('a')
    }
    handleTouchRight(event) {
        event.preventDefault();
        this.keyFunc('d')
    }
    handleTouchCircle(event) {
        event.preventDefault();
        this.keyFunc(' ')
    }
    keyFunc(key) {
        switch (key) {
            case 'ArrowRight':
                if (gameMode === 'pvp') {
                    if (!this.enemySelected) 
                    this.arrow2Pos = this.moveArrow(this.arrow2, this.arrow2Pos, 1)
                    if (this.arrow1Pos == this.arrow2Pos)
                            this.arrow2Pos = this.moveArrow(this.arrow2, this.arrow2Pos, 1)
                }
                break
            case 'ArrowLeft':
                if (gameMode === 'pvp') {
                    if (!this.enemySelected) 
                        this.arrow2Pos = this.moveArrow(this.arrow2, this.arrow2Pos, -1)
                        if (this.arrow1Pos == this.arrow2Pos)
                            this.arrow2Pos = this.moveArrow(this.arrow2, this.arrow2Pos, -1)
                }
                break
            case 'Enter':
                if (gameMode === 'pvp') {
                    this.enemyFighter = this.fighters[this.arrow2Pos]
                    this.enemySelected = true
                    this.arrow2.framsHold = 0
                    this.invokeSelection()
                }
                break
            case 'd':
                if (!this.playerSelected) 
                    this.arrow1Pos = this.moveArrow(this.arrow1, this.arrow1Pos, 1)
                    if (gameMode === 'pvp')
                        if (this.arrow1Pos == this.arrow2Pos)
                            this.arrow1Pos = this.moveArrow(this.arrow1, this.arrow1Pos, 1)
                break
            case 'a':
                if (!this.playerSelected) 
                    this.arrow1Pos = this.moveArrow(this.arrow1, this.arrow1Pos, -1)
                    if (gameMode === 'pvp')
                        if (this.arrow1Pos == this.arrow2Pos)
                            this.arrow1Pos = this.moveArrow(this.arrow1, this.arrow1Pos, -1)
                break
            case ' ':
                if (gameMode === 'pve') {
                    this.enemySelected = true
                }
                this.playerFighter = this.fighters[this.arrow1Pos]
                this.playerSelected = true
                this.arrow1.framsHold = 0
                this.invokeSelection()
                break
        }
    }
    
    moveArrow(arrow, arrowPos, direcrtion) {
        _doFuncNoSpam(playSound, this.beepSound, 10)

        this.characters[arrowPos].image.src = this.fighters[arrowPos].idle_bw_png
        this.power[arrowPos].image.src = this.fighters[arrowPos].pwr_bw_png
        this.hp[arrowPos].image.src = this.fighters[arrowPos].hp_bw_png
        arrowPos = (arrowPos + direcrtion) % this.characters.length
        if (arrowPos < 0)
            arrowPos = this.characters.length - 1
            arrow.position.x = this.arrowStartPos + (arrowPos * this.charOffset)
        return arrowPos
    }

    invokeSelection() {
        playSound(this.selectSound)

        if (this.playerSelected && this.enemySelected) {
            let tempEnemySelection = 0
            if (gameMode === 'pvp') {
                tempEnemySelection = this.arrow2Pos
            }
            else {
                tempEnemySelection = Math.floor(Math.random() * (this.characters.length + 1) + 0)
                if (tempEnemySelection === this.arrow1Pos)
                tempEnemySelection = (tempEnemySelection + 1) % this.characters.length
            }
            this.selectedPlayer = this.fighters[this.arrow1Pos]
            this.selectedEnemy = this.fighters[tempEnemySelection]
            this.delete()
            _doFuncNoSpam(fadeFunc, startGame)
        }
    }

    getPlayerFighter() {
        if (!this.selectedPlayer)
            return fireFighter
        return this.selectedPlayer
    }

    getEnemyFighter() {
        if (!this.selectedEnemy)
            return waterFighter
        return this.selectedEnemy
    }
}

class GameScreenCLS extends Screen{
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight)
        this.gameBackgorund
        this.shop
        this.gameTime = 100
        this.player
        this.enemy
        this.playerScore = 0
        this.enemyScore = 0
        this.manaInterval
        this.timerInterval
        this.bgs = ['background-fire', 'background-metal', 'background-water', 'background-wind', 'background-ground']
        this.gameBackgorunds = []
        this.touchArrowLeft
        this.touchArrowRight
        this.circleButton
        this.joystick
    }

    init(playerFighter, enemyFighter) {
        const canvas = document.getElementById('canvas1'); // replace 'canvas1' with the actual ID of your canvas element
        const scaleX = canvas.width / compCanvasWidth
        const scaleY = canvas.height / compCanvasHeight
        document.querySelector('#healthBars').style.width = compCanvasWidth

        if (isMobile) {
            // Joystick
            this.joystick = new Joystick(80, compCanvasHeight - 90, 70, 35, scaleX * 1.06, scaleY * 1.06)

            // Circle Button
            this.handleTouchCircle = this.handleTouchCircle.bind(this);
            this.circleButton = document.getElementById('circleButton1');
            this.circleButton.addEventListener('touchstart', this.handleTouchCircle);
        }
        
        if (this.gameBackgorunds.length === 0) {
            for (let i = 0; i < this.bgs.length; i++){
                this.gameBackgorunds.push(new SingleBG(this.ctx, "", this.canvasWidth, this.canvasHeight, this.bgs[i]))
            }
        }
         
        this.gameBackgorund = this.gameBackgorunds[Math.floor(Math.random() * this.gameBackgorunds.length)]
        
        this.player = new Fighter({
            position: {x: 250, y: 0}, 
            velocity: {x: 0, y: 0}, 
            offset: playerFighter.offset,
            rightImagesSrc: "", 
            leftImagesSrc: "", 
            animationsStates: playerFighter.AnimationStates, 
            attackInfo: playerFighter.AttackInfo, 
            scale: playerFighter.scale,
            animationName: "idle",
            facing: "right",
            type:'player',
            attackBox :{
                offset: {
                    x: 0,
                    y: 50
                },
                width: 100,
                height: 50
            },
            keyLeft:playerFighter.keyLeft,
            keyRight:playerFighter.keyRight
        })
    
        this.enemy = new Fighter({
            position: {x: 675, y: 0}, 
            velocity: {x: 0, y: 0}, 
            offset: enemyFighter.offset, 
            rightImagesSrc: "", 
            leftImagesSrc: "", 
            animationsStates: enemyFighter.AnimationStates, 
            attackInfo: enemyFighter.AttackInfo, 
            scale: enemyFighter.scale,
            animationName: "idle",
            facing: "left",
            type:'enemy',
            attackBox :{
                offset: {
                    x: 0,
                    y: 50
                },
                width: 100,
                height: 50
            },
            keyLeft:enemyFighter.keyLeft,
            keyRight:enemyFighter.keyRight
        })
        this.playerScore = 0
        this.enemyScore = 0

        document.querySelector('#healthBars').style.display = 'flex'
        document.querySelector('#player_health_bar').style.display = 'flex'
        document.querySelector('#enemy_health_bar').style.display = 'flex'
        document.querySelector('#start_pve_btn').style.display = 'none'
        document.querySelector('#start_pvp_btn').style.display = 'none'
        document.querySelector('#playerName').innerHTML = playerFighter.name
        document.querySelector('#enemyName').innerHTML = enemyFighter.name
        document.querySelector('#displayText').style.display = 'none'
        
        document.querySelector('#playerMana').style.width = '100%'
        document.querySelector('#enemyMana').style.width = '100%'
        document.querySelector('#enemyMana').style.left = '0%'
        document.querySelector('#enemyScore1').style.color = '#440000'
        document.querySelector('#enemyScore2').style.color = '#440000'
        document.querySelector('#playerScore1').style.color = '#440000'
        document.querySelector('#playerScore2').style.color = '#440000'
        
        this.isStarted = true
        resetHealth()
        this.decreaseTimer()
        this.manaRaise()
        if (isSoundOn) {
            playMusic(battleMusic, 'play')
        }
    }

    delete() {
        this.gameTime = 100
        this.enemyScore = 0
        this.playerScore = 0
        this.gameBackgorund = null
        this.shop = null
        this.player = null
        this.enemy = null
        clearInterval(this.manaInterval)
        clearInterval(this.timerInterval)
        
        if (isMobile) {
            // Arrows
            // this.touchArrowLeft.style.display = 'none'
            // this.touchArrowRight.style.display = 'none'
            
            // this.touchArrowLeft.removeEventListener('touchstart', this.handleTouchLeft);
            // this.touchArrowRight.removeEventListener('touchstart', this.handleTouchRight);
            
            // this.touchArrowLeft.removeEventListener('touchend', this.handleTouchEndLeft);
            // this.touchArrowRight.removeEventListener('touchend', this.handleTouchEndRight);
            
            // Circle Button
            this.circleButton.style.display = 'none'
            this.circleButton.removeEventListener('touchstart', this.handleTouchCircle);
        }

    }

    draw() {
        this.gameBackgorund.draw()
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.player.update();
        this.enemy.update();
        if (isMobile) {
            this.joystick.update()
            this.keyFunc(this.joystick.lastDirection)
        }
    }
    handleTouchLeft(event) {
        event.preventDefault();
        this.keyFunc('a')
    }
    handleTouchRight(event) {
        event.preventDefault();
        this.keyFunc('d')
    }
    handleTouchEndLeft(event) {
        event.preventDefault();
        keyUpFunc('a')
    }
    handleTouchEndRight(event) {
        event.preventDefault();
        keyUpFunc('d')
    }
    handleTouchCircle(event) {
        event.preventDefault();
        this.keyFunc(' ')
    }
    keyFunc(key) {
        if (!this.player.isDead) {
            this.player.determineCombo(key)
            switch (key) {
                case 'd':
                    this.player.turn('d', 'a', 'right')
                    break
                case 'a':
                    this.player.turn('a', 'd', 'left')
                    break
                case 'w':
                    if (this.player.animationName !== "death") 
                        this.player.velocity.y = -10
                    break
                case 'e':
                    this.player.defend()
                    break
                case ' ':
                    if (this.player.animationName === "death")
                        break
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
                    this.enemy.turn('ArrowRight', 'ArrowLeft', 'right')
                    break
                case 'ArrowLeft':
                    this.enemy.turn('ArrowLeft', 'ArrowRight', 'left')
                    break
                case 'ArrowUp':
                    if (this.enemy.animationName !== "death")
                        this.enemy.velocity.y = -18
                    break
                case '0':
                    if (this.enemy.animationName === "death")
                        break
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
                player.mana += 2
                document.querySelector('#playerMana').style.width = player.mana + '%'
            }
            if (enemy.mana < 100) {
                enemy.mana += 2
                document.querySelector('#enemyMana').style.width = enemy.mana + '%'
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
                this.determineWinner()
            }
        }, 1000)
    }

    determineWinner() {
        this.isStarted = false
        document.querySelector('#timer').innerHTML = '00'
        document.querySelector('#displayText').style.display = 'flex'
    
        if (this.player.health === this.enemy.health) {
            document.querySelector('#displayText').innerHTML = 'Tie'
            this.playerScore++
            this.enemyScore++
        }
        else if(this.player.health > this.enemy.health) {
            document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
            this.playerScore++
            
        }
        else if(this.player.health < this.enemy.health) {
            document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
            this.enemyScore++
        }
        
        if (this.playerScore >= 2) {
            document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
            setTimeout(() => {fadeFunc(gameOver)}, 1500)
            return
        }
        else if (this.enemyScore >= 2) {
            document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
            setTimeout(() => {fadeFunc(gameOver)}, 1500)
            return
        }

        setTimeout(() => {this.resetRound()}, 2000)
    }

    getPlayer() {
        return this.player
    }

    getEnemy() {
        return this.enemy
    }

    resetRound() {
        document.querySelector('#displayText').style.display = 'none'
        this.player.resetPosition()
        this.enemy.resetPosition()
        this.gameBackgorund = this.gameBackgorunds[Math.floor(Math.random() * this.gameBackgorunds.length)]
        this.player.health = 100
        this.enemy.health = 100
        resetHealth()
        this.player.mana = 98
        this.enemy.mana = 98
        this.player.defending = false
        this.enemy.defending = false

        if (this.player.isDead) {
            this.player.switchSprite('idle', true)
            document.querySelector('#enemyScore' + this.enemyScore).style.color = '#ff0000'
        }
        
        if (this.enemy.isDead) {
            this.enemy.switchSprite('idle', true)
            document.querySelector('#playerScore' + this.playerScore).style.color = '#ff0000'
        }
        
        this.gameTime = 100
        this.isStarted = true
        this.enemy.isDead = false
        this.player.isDead = false
        enemyAIOn = true
        if (isSoundOn)
            playMusic(battleMusic2, 'play')
    }
}

class GameOverScreenCLS extends Screen{
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight)
    }

    init() {
        document.querySelector('#displayText').style.display = 'flex'
        document.querySelector('#displayText').innerHTML = 'Game Over'
        document.querySelector('#healthBars').style.display = 'none'
        document.querySelector('#player_health_bar').style.display = 'none'
        document.querySelector('#enemy_health_bar').style.display = 'none'
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.handleTouchStart = this.handleTouchStart.bind(this);
        document.addEventListener('touchstart', this.handleTouchStart);
        
        setTimeout(() => {
            document.querySelector('#start_pve_btn').style.display = 'block'
            document.querySelector('#start_pve_btn').value = 'Press any key to continue...'
        }, 1000);
    }

    delete() {
        document.querySelector('#start_pve_btn').value = ' '
        document.querySelector('#displayText').style.display = 'none'
        document.removeEventListener('touchstart', this.handleTouchStart);
    }

    handleTouchStart() {
        this.keyFunc(' ')
    }

    draw() {
    }

    keyFunc(key) {
        if (key) {
            this.delete()
            _doFuncNoSpam(fadeFunc, startScreen)
        }
    }
}

class LoadingScreenCLS extends Screen{
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight)
    }

    init() {
        if (this.speed > 0.1) {
            return
        }
        // document.querySelector('#displayText').style.display = 'flex'
        // document.querySelector('#displayText').innerHTML = 'Loading...'
        document.querySelector('#healthBars').style.display = 'none'
        document.querySelector('#player_health_bar').style.display = 'none'
        document.querySelector('#enemy_health_bar').style.display = 'none'
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.switchDuration = 1500
        this.interval
        // this.fadeScreen()
        this.textOpacity = 1;
        this.speed = 0.1;
        this.barWidth = 400;
        this.barHeight = 20;
        this.barFactor = this.barWidth / 100;
        // setTimeout(() => {
        //     document.querySelector('#start_pve_btn').style.display = 'block'
        //     document.querySelector('#start_pve_btn').value = 'Press any key to continue...'
        // }, 1000);
    }

    delete() {
        document.querySelector('#start_pve_btn').value = ' '
        document.querySelector('#displayText').style.display = 'none'
        document.removeEventListener('touchstart', this.handleTouchStart);
    }

    fadeScreen() {
        // Define a function to fade the text out
        const fadeOut = () => {
            gsap.to(this, { textOpacity: 0.2, duration: 0.8, onComplete: fadeIn }); // Fade out over 2 seconds, then call fadeIn
        };
    
        // Define a function to fade the text in
        const fadeIn = () => {
            gsap.to(this, { textOpacity: 1, duration: 0.8, onComplete: fadeOut }); // Fade in over 0.8 seconds, then call fadeOut
        };
    
        // Start the fade in
        fadeIn();
    }
    
    draw() {
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
    
        // Draw the loading text with the current opacity
        // this.ctx.font = '16px "Press Start 2P", sans-serif'; // Set the font family and size
        // this.ctx.fillStyle = `rgba(255, 255, 255, ${this.textOpacity})`;
        // this.ctx.fillText('loading...', this.canvasWidth/2 - 80, this.canvasHeight/2 - 24);
        this.drawFrame()
    }
    text(){
        this.ctx.save();
        this.ctx.fillStyle = "#30263d";
        this.ctx.font = '16px "Press Start 2P", sans-serif';
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText('Loading ' +  this.speed.toFixed(0)+"%", this.canvasWidth/2, this.canvasHeight/2 + 10);
        this.ctx.restore();
      }
      
      rect(){
        this.ctx.beginPath();
        this.ctx.rect(this.canvasWidth/2 - this.barWidth/2, this.canvasHeight/2 , this.barWidth, this.barHeight);
        this.ctx.lineWidth = 6;
        this.ctx.strokeStyle = 'white';
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.ctx.stroke();
      }
      
      rect1(){
        this.ctx.beginPath();
        this.ctx.rect(this.canvasWidth/2 - this.barWidth/2, this.canvasHeight/2 , this.speed * this.barFactor, this.barHeight);
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = '#ffab00';
        this.ctx.fill();
        this.ctx.stroke();
      }

    keyFunc(key) {
    }
    setSpeed(speed) {
        this.speed += speed
    }
    drawFrame(){      
        this.rect();
        this.rect1();
        this.text();
        if(this.speed > 100) this.speed = 100;
        // this.speed += 1;
    }
}

