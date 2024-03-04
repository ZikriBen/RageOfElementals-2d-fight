
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
    }

    init() {
        this.mainSprite = this.logo = new BaseSprite({position: {x: 240, y: 180}, imagesSrc: './img/ElementalLogo.png', scale: 2, framesMax: 1})
        this.instructions = new BaseSprite({position: {x: 150, y: 60}, imagesSrc: './img/instructions.png', scale: 2.5, framesMax: 1})
        document.querySelector('#start_pve_btn').style.display = 'block'
        document.querySelector('#start_pve_btn').style.left = '42%'
        document.querySelector('#start_pve_btn').value = '• 1P vs PC •'
        document.querySelector('#start_pvp_btn').style.display = 'block'
        document.querySelector('#start_pvp_btn').style.left = '42%'
        document.querySelector('#start_pvp_btn').value = '  1P vs 2P  '
        document.querySelector('#info_btn').style.left = '42%'
        document.querySelector('#info_btn').style.display = 'block'
        document.querySelector('#info_btn').value = '  Controls  '
        this.switchBG()
        if (isSoundOn) {
            playMusic(battleMusic, 'play')
        }
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
    
    showInstructions() {
        this.mainSprite = this.instructions
    }

    showLogo() {
        this.mainSprite = this.logo
    }

    setSelection() {
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
            this.invokeSelection()
        }
        else if (key === "ArrowUp" || key === "w") {
            this.currentSelection = (this.currentSelection - 1) % this.selections.length
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
}

class CharSelectCLS extends Screen{
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight)
        this.arrow1Pos = 0
        this.arrow2Pos = 1
        this.arrowStartPos = 115
        this.charStartPos = -220
        this.charOffset = 200
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
    }

    init() {
        this.arrow1Pos = 0
        this.arrow2Pos = 1
        this.arrowStartPos = 115
        this.charStartPos = -220
        document.querySelector('#start_pve_btn').style.display = 'none'
        document.querySelector('#start_pvp_btn').style.display = 'none'
        document.querySelector('#displayText').style.display = 'flex'
        document.querySelector('#displayText').style.top = '-200'
        document.querySelector('#displayText').innerHTML = 'Select Character:'
        
        this.arrow1 = new BaseSprite({position: {x: this.arrowStartPos, y: 235}, imagesSrc: './img/arrow_p1p.png', scale: 0.3, framesMax: 5})
        this.arrow2 = new BaseSprite({position: {x: this.arrowStartPos + this.charOffset, y: 235}, imagesSrc: './img/arrow_p2p.png', scale: 0.3, framesMax: 5, framsHold: 3})
        
        this.fighters = [fireFighter, groundFighter, windFighter, waterFighter, metalFighter]
        
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
        if (gameMode === 'pvp')
            this.characters[this.arrow2Pos].image.src = this.fighters[this.arrow2Pos].idle_png

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
                    console.log(this.enemyFighter.name)
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
                console.log(this.playerFighter.name)
                this.invokeSelection()
                break
        }
    }
    
    moveArrow(arrow, arrowPos, direcrtion) {
        playSound(this.beepSound)
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
        this.bgs = ['./img/bgs/background-fire.png', './img/bgs/background-metal.png', './img/bgs/background-water.png', './img/bgs/background-wind.png', './img/bgs/background-ground.png',]
        this.gameBackgorunds = []
    }

    init(playerFighter, enemyFighter) {
        console.log("Game screen init")
        
        if (this.gameBackgorunds.length === 0) {
            for (let i = 0; i < this.bgs.length; i++){
                this.gameBackgorunds.push(new BaseSprite({position: {x: 0, y: 0}, imagesSrc: this.bgs[i]}))
            }
        }
         
        this.gameBackgorund = this.gameBackgorunds[Math.floor(Math.random() * this.gameBackgorunds.length)]
        // this.shop = new BaseSprite({position: {x: 625, y: 160}, imagesSrc: './img/shop.png', scale: 2.5, framesMax: 6})
        
        this.player = new Fighter({
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
    
        this.enemy = new Fighter({
            position: {x: 675, y: 0}, 
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
        this.playerScore = 0
        this.enemyScore = 0

        document.querySelector('#health_bars').style.display = 'flex'
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
    }

    draw() {
        this.gameBackgorund.update()
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
                    this.player.turn('d', 'a', 'right')
                    break
                case 'a':
                    this.player.turn('a', 'd', 'left')
                    break
                case 'w':
                    if (this.player.animationName !== "death") 
                        this.player.velocity.y = -18
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
    }
}

class GameOverScreenCLS extends Screen{
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight)
    }

    init() {
        document.querySelector('#displayText').style.display = 'flex'
        document.querySelector('#displayText').innerHTML = 'Game Over'
        document.querySelector('#health_bars').style.display = 'none'
        document.querySelector('#player_health_bar').style.display = 'none'
        document.querySelector('#enemy_health_bar').style.display = 'none'
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
        
        setTimeout(() => {
            document.querySelector('#start_pve_btn').style.display = 'block'
            document.querySelector('#start_pve_btn').style.left = '32%'
            document.querySelector('#start_pve_btn').value = 'Press any key to continue...'
            // if (isSoundOn) {
            //     music.pause()
            // }
        }, 1000);
    }

    delete() {
        document.querySelector('#start_pve_btn').value = ' '
        document.querySelector('#displayText').style.display = 'none'
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