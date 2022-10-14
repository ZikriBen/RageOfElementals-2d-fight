let currentScreen = 'startScreen'

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width  = 1024
canvas.height = 576
const gravity = 0.7
const overlay = {
    opacity: 0
}
c.fillRect(0, 0, canvas.width, canvas.height)

let startBackground1;
let startBackground2;
let startBackground3;
let startBackground4;
let logo;
let characters = [];
let gameBackgorund;
let shop;
let beepSound;
let selectSound;
let errorSound;
let playerFighter= fireFighter;
let enemyFighter = waterFighter;
let isStarted = false
let playerSelected = false
let enemySelected = false
let player;
let enemy;
let fighters;


const screens = {
    'startScreen': {
        init: () => {
            console.log("start screen init")
            
            // SunnyLand
            // startBackground1 = new FullScrollingSprite('./img/back.png', 0, 0, canvas.width, canvas.height, 1)
            // startBackground2 = new FullScrollingSprite('./img/middle.png', 0, 150, canvas.width, canvas.height, 2, scaleX = 1.005, scaleY = 2)
            
            // RTB
            startBackground1 = new FullScrollingSprite('./img/rtb/background.png', 0, 0, canvas.width, canvas.height, 1)
            startBackground2 = new FullScrollingSprite('./img/rtb/background2.png', 0, 0, canvas.width, canvas.height, 1.5, scaleX = 1.005)
            startBackground3 = new FullScrollingSprite('./img/rtb/background3.png', 0, 0, canvas.width, canvas.height, 2, scaleX = 1.005)
            startBackground4 = new FullScrollingSprite('./img/rtb/background4.png', 0, 0, canvas.width, canvas.height, 2.5, scaleX = 1.005)

            // MagicCliffs
            startBackground1 = new FullScrollingSprite('./img/MagicCliffs/sky.png', 0, 0, canvas.width, canvas.height, 1)
            startBackground2 = new FullScrollingSprite('./img/MagicCliffs/clouds.png', 0, 150, canvas.width, canvas.height, 1.5, scaleX = 1.005)
            startBackground3 = new FullScrollingSprite('./img/MagicCliffs/sea.png', 0, 420, canvas.width, canvas.height, 2, scaleX = 1.005, scaleY = 0.3)
            startBackground4 = new FullScrollingSprite('./img/MagicCliffs/far-grounds.png', 0, 480, canvas.width, canvas.height, 2.5, scaleX = 0.5, scaleY = 0.2)

            logo = new Sprite({position: {x: 240, y: 180}, imagesSrc: './img/ElementalLogo.png', scale: 2, framesMax: 1})
            document.querySelector('#start_btn').style.display = 'block'
            document.querySelector('#start_btn').value = 'press ENTER/SPACE to start'
    },
        draw: () => {
            startBackground1.draw(c);
            startBackground2.draw(c);
            startBackground3.draw(c);
            startBackground4.draw(c);
            logo.update()
        },
        keyFunc: (key) => {
            if (key === "Enter" || key === " ") {
                _doFuncNoSpam(fadeFunc, charSelect)
            }
        }
    },
    'charSelectScreen': {
        init: () => {
            
            document.querySelector('#start_btn').style.display = 'none'
            arrow1Pos = 0
            arrow2Pos = 1
            arrowStartPos = 115
            charStartPos = -220
            charOffset = 200
            beepSound = new Audio('./music/mixkit-video-game-mystery-alert-234.wav');
            selectSound = new Audio('./music/mixkit-arcade-bonus-alert-767.wav');
            document.querySelector('#displayText').style.display = 'flex'
            document.querySelector('#displayText').innerHTML = 'Select Character:'
            // errorSound = new Audio('./music/error-89206.wav');
            arrow1 = new Sprite({position: {x: arrowStartPos, y: 295}, imagesSrc: './img/arrow_p1p.png', scale: 0.3, framesMax: 5})
            arrow2 = new Sprite({position: {x: arrowStartPos + charOffset, y: 295}, imagesSrc: './img/arrow_p2p.png', scale: 0.3, framesMax: 5, framsHold: 3})
            
            if (!fighters) {
                fighters = [fireFighter, groundFighter, windFighter, waterFighter, metalFighter]
            
                for (let i = 0; i < fighters.length; i++){
                    characters.push(new Sprite({position: {x: charStartPos, y: 160}, imagesSrc: fighters[i].idle_bw_png, scale: 2.5, framesMax: fighters[i].idle_frames}))
                    charStartPos += charOffset
                }
            }

        },
        draw: () => {
            arrow1.update()
            arrow2.update()

            for (let i = 0; i < characters.length; i++){
                characters[i].update()
            }

            characters[arrow1Pos].image.src = fighters[arrow1Pos].idle_png
            characters[arrow2Pos].image.src = fighters[arrow2Pos].idle_png
        },        
        keyFunc: (key) => {
            switch (key) {
                case 'ArrowRight':
                    if (!enemySelected) 
                        arrow2Pos = moveArrow(arrow2, arrow2Pos, 1, characters, fighters)
                    break
                case 'ArrowLeft':
                    if (!enemySelected) 
                        arrow2Pos = moveArrow(arrow2, arrow2Pos, -1, characters, fighters)
                    break
                case 'Enter':
                    playSound(selectSound)
                    enemyFighter = fighters[arrow2Pos]
                    enemySelected = true
                    arrow2.framsHold = 0
                    console.log(enemyFighter.name)
                    if (playerSelected)
                        fadeFunc(startGame)
                    break
                
                case 'd':
                    if (!playerSelected) 
                        arrow1Pos = moveArrow(arrow1, arrow1Pos, 1, characters, fighters)
                    break
                case 'a':
                    if (!playerSelected) 
                        arrow1Pos = moveArrow(arrow1, arrow1Pos, -1, characters, fighters)
                    break
                case ' ':
                    playSound(selectSound)
                    playerFighter = fighters[arrow1Pos]
                    playerSelected = true
                    arrow1.framsHold = 0
                    console.log(playerFighter.name)
                    if (enemySelected)
                        _doFuncNoSpam(fadeFunc, startGame)
                    break
            }
        }

    },
    'gameScreen': {
        init: () => {
            console.log("Game screen init")
            gameBackgorund = new Sprite({position: {x: 0, y: 0}, imagesSrc: './img/background.png'})
            shop = new Sprite({position: {x: 625, y: 160}, imagesSrc: './img/shop.png', scale: 2.5, framesMax: 6})
            document.querySelector('#health_bars').style.display = 'flex'
            document.querySelector('#player_health_bar').style.display = 'flex'
            document.querySelector('#enemy_health_bar').style.display = 'flex'
            document.querySelector('#start_btn').style.display = 'none'
            document.querySelector('#playerName').innerHTML = playerFighter.name
            document.querySelector('#enemyName').innerHTML = enemyFighter.name
            document.querySelector('#displayText').style.display = 'none'
            isStarted = true
            playerSelected = false
            enemySelected = false
            player = new newFighter({
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
        
            enemy = new newFighter({
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

			decreaseTimer()
            manaRaise()
            player.health = 100
            player.mana = 100
            enemy.health = 100
            enemy.mana = 100
            document.querySelector('#playerMana').style.width = player.mana + '%'
            document.querySelector('#enemyMana').style.width = enemy.mana + '%'
            document.querySelector('#enemyMana').style.left = Math.abs(100 - enemy.mana) + '%'
        },
        draw: () => {
            gameBackgorund.update()
            shop.update()
            
            c.fillRect(0, 0, canvas.width, canvas.height)
            player.update();
            enemy.update();
        },
        keyFunc: (key) => {
            if (!player.isDead) {
                player.determineCombo(key)
                switch (key) {
                    case 'd':
                        turn(player, 'd', 'a', 'right')
                        // player.lastKey = 'd'
                        // keys.d.pressed = true
                        // if (player.animationName !== 'sp_attack2') {
                        //     player.facing = 'right'
                        // }
                        break
                    case 'a':
                        // player.lastKey = 'a'
                        // keys.a.pressed = true
                        // if (player.animationName !== 'sp_attack2') {
                        //     player.facing = 'left'
                        // }
                        turn(player, 'a', 'd', 'left')
                        break
                    case 'w':
                        player.velocity.y = -18
                        break
                    case 'e':
                        player.defend()
                        break
                    case ' ':
                        if (player.velocity.y !== 0) {
                            _doActionNoSpam(player, 'air_attack')
                            break
                        }
                        if (player.animationName === 'attack1' && player.currentFrame >= player.attackFrame) {
                            _doActionNoSpam(player, 'attack2')
                            break
                        }
                        else if (player.animationName === 'attack2' && player.currentFrame >= player.attackFrame) {
                            _doActionNoSpam(player, 'sp_attack1')
                            break
                        }
                        else {
                            _doActionNoSpam(player, 'attack1')
                        }
                        break
                    case 'r':
                        _doActionNoSpam(player, 'meditate')
                        break
                    case 'q':
                        _doActionNoSpam(player, 'sp_attack2')
                        break
                    case 'z':
                        player.lastKey = 'z'
                        break
                    case 'x':
                        player.lastKey = 'x'
                        break
                    case 'c':
                        player.lastKey = 'c'
                        break
                }
            }
            if (!enemy.isDead) {
                enemy.determineCombo(key)
                switch (key) {
                    case 'ArrowRight':
                        turn(enemy, 'ArrowRight', 'ArrowLeft', 'right')
                        break
                    case 'ArrowLeft':
                        turn(enemy, 'ArrowLeft', 'ArrowRight', 'left')
                        break
                    case 'ArrowUp':
                        enemy.velocity.y = -18
                        break
                    case '0':
                        if (enemy.velocity.y !== 0) {
                            _doActionNoSpam(enemy, 'air_attack')
                            break
                        }
                        if (enemy.animationName === 'attack1' && enemy.currentFrame >= player.attackFrame) {
                            _doActionNoSpam(enemy, 'attack2')
                            break
                        }
                        else if (enemy.animationName === 'attack2' && enemy.currentFrame >= player.attackFrame) {
                            _doActionNoSpam(enemy, 'sp_attack1')
                            break
                        }
                        else {
                            _doActionNoSpam(enemy, 'attack1')
                        }
                        break
                    case '1':
                        _doActionNoSpam(enemy, 'sp_attack2')
                        break
                    case '9':
                        enemy.defend()
                        break
                    case '7':
                        _doActionNoSpam(enemy, 'meditate')
                        break
                }
            }
        }
	},
    'gameOverScreen': {
        init: () => {
            // document.querySelector('#start_btn').style.display = 'none'
            document.querySelector('#displayText').style.display = 'flex'
            document.querySelector('#displayText').innerHTML = 'Game Over'
            document.querySelector('#health_bars').style.display = 'none'
            document.querySelector('#player_health_bar').style.display = 'none'
            document.querySelector('#enemy_health_bar').style.display = 'none'
            c.clearRect(0, 0, canvas.width, canvas.height)
            setTimeout(() => {
                document.querySelector('#start_btn').style.display = 'block'
                if (isSoundOn) {
                    music.pause()
                }
                document.querySelector('#start_btn').value = 'Press any key to continue...'
            }, 3000);
        },
        draw: () => {
        },
        keyFunc: (key) => {
            if (key) {
                console.log("Any key")
                document.querySelector('#start_btn').value = ' '
                document.querySelector('#displayText').style.display = 'none'
                _doFuncNoSpam(fadeFunc, startScreen)
            }
        }
    }
}

const keys = {
    a: {
        pressed : false,
        double: 0
    },
    d: {
        pressed: false,
        double: 0
    },
    ArrowRight: {
        pressed: false,
        double: 0
    },
    ArrowLeft: {
        pressed: false,
        double: 0
    }
}

screens[currentScreen].init()


function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    
    screens[currentScreen].draw()

    if (player && enemy) {
        // Player Movement
        player.velocity.x = 0
        if (keys.a.pressed && player.lastKey === 'a') {
            player.switchSprite('run')
            player.velocity.x = -5
        }
        else if (keys.d.pressed && player.lastKey === 'd') {
            player.switchSprite('run')
            player.velocity.x = 5
        }
        else if (keys.d.double >= 2) {
            player.velocity.x += 7
            player.roll()
        }
        else if (keys.a.double >= 2) {
            player.velocity.x -= 7
            player.roll()
        }
        else {
            player.switchSprite('idle')
        }
        
        if (player.velocity.y < 0) {
            player.switchSprite('jump')
        }
        else if (player.velocity.y > 0) {
            player.switchSprite('fall')
        }

        // Enemy Movement
        enemy.velocity.x = 0
        if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
            enemy.switchSprite('run')
            enemy.velocity.x = 5
        }
        else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
            enemy.switchSprite('run')
            enemy.velocity.x = -5
        }
        else if (keys.ArrowRight.double >= 2) {
            enemy.velocity.x += 7
            enemy.roll()
        }
        else if (keys.ArrowLeft.double >= 2) {
            enemy.velocity.x -= 7
            enemy.roll()
        }
        else {
            enemy.switchSprite('idle')
        }
        
        if (enemy.velocity.y < 0) {
            enemy.switchSprite('jump')
        }
        else if (enemy.velocity.y > 0) {
            enemy.switchSprite('fall')
        }

        // Detect Colision player attackBox
        if (rectCollision(player, enemy) && player.isAttcking && player.currentFrame === player.attackFrame) {
            enemy.takeHit(player, player.currentForce)
            player.isAttcking = false
            console.log('col')
            console.log(enemy.health)
            if (enemy.health < 0) {
                enemy.health = 0
            }
        }

        document.querySelector('#enemyHealth').style.width = enemy.health + '%'

        // Detect Colision enemy attackBox
        if (rectCollision(enemy, player) && enemy.isAttcking && enemy.currentFrame === enemy.attackFrame) {
            player.takeHit(enemy, enemy.currentForce)
            enemy.isAttcking = false
            console.log('col')
            console.log(player.health)
            if (player.health < 0) {
                player.health = 0
            }
        }

        document.querySelector('#playerHealth').style.width = player.health + '%'

        if (enemy.health <= 0 || player.health <= 0) {
            determineWinner({player, enemy, timerId})
        
        }
    }

    // Fade effect between screens
    c.save()
    c.globalAlpha = overlay.opacity
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.restore()
}

animate()


window.addEventListener('keydown', (event) => {
    screens[currentScreen].keyFunc(event.key)
})


window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            keys.d.double++
            setTimeout(() => (keys.d.double = 0), 450)
            break
        case 'a':
            keys.a.pressed = false
            keys.a.double++

            setTimeout(() => (keys.a.double = 0), 450)
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            keys.ArrowRight.double++
            setTimeout(() => (keys.ArrowRight.double = 0), 450)
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            keys.ArrowLeft.double++
            setTimeout(() => (keys.ArrowLeft.double = 0), 450)
            break
    }
})
