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
let playerFighter= fireFighter;
let enemyFighter = fireFighter;
let playerSelected = false
let enemySelected = false
let player;
let enemy;

const screens = {
    'startScreen': {
        init: () => {
            console.log("start screen init")
            const back = new Image()
            back.src = './img/back.png'
            const mid = new Image()
            mid.src = './img/middle.png'
            startBackground1 = new ScrollingSprite(back, 0, 0, canvas.width, canvas.height, 1)
            startBackground2 = new ScrollingSprite(back, -canvas.width, 0, canvas.width, canvas.height, 1);
            startBackground3 = new ScrollingSprite(mid, 0, 150, canvas.width, canvas.height, 2, scaleX = 1.005, scaleY = 2)
            startBackground4 = new ScrollingSprite(mid, -canvas.width, 150, canvas.width, canvas.height, 2, scaleX = 1.005, scaleY = 2);
            logo = new Sprite({position: {x: 200, y: 180}, imagesSrc: './img/logo.png', scale: 2, framesMax: 1})
    },
        draw: () => {
            startBackground1.scroll();
            startBackground1.draw(c);
            startBackground2.scroll();
            startBackground2.draw(c);
            startBackground3.scroll();
            startBackground3.draw(c);
            startBackground4.scroll();
            startBackground4.draw(c);
            logo.update()
        },
        keyFunc: (key) => {
            if (key === "Enter" || key === " ") {
                gsap.to(overlay, {opacity: 1, duration: 0.8})
                setTimeout(charSelect, 1000);
                document.querySelector('#start_btn').style.display = 'none'
                setTimeout(gsap.to, 1500, overlay, {opacity: 0, duration: 2})
            }
        }
    },
    'charSelectScreen': {
        init: () => {
            document.querySelector('#start_btn').style.display = 'none'
            arrow1Pos = 0
            arrow2Pos = 1
            arrowStartPos = 135
            charStartPos = -200
            charOffset = 220
            beepSound = new Audio('./music/mixkit-video-game-mystery-alert-234.wav');
            selectSound = new Audio('./music/mixkit-arcade-bonus-alert-767.wav');
            arrow1 = new Sprite({position: {x: arrowStartPos, y: 285}, imagesSrc: './img/arrow_p1p.png', scale: 0.3, framesMax: 5})
            arrow2 = new Sprite({position: {x: arrowStartPos + charOffset, y: 285}, imagesSrc: './img/arrow_p2p.png', scale: 0.3, framesMax: 5, framsHold: 3})
            
            fighters = [fireFighter, groundFighter, windFighter, waterFighter]
            
            for (let i = 0; i < 4; i++){
                characters.push(new Sprite({position: {x: charStartPos, y: 160}, imagesSrc: fighters[i].idle_bw_png, scale: 2.5, framesMax: fighters[i].idle_frames}))
                charStartPos += charOffset
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
                    arrow2Pos = moveArrow(arrow2, arrow2Pos, 1, characters, fighters)
                    break
                case 'ArrowLeft':
                    arrow2Pos = moveArrow(arrow2, arrow2Pos, -1, characters, fighters)
                    break
                case 'Enter':
                    playSound(selectSound)
                    enemyFighter = fighters[arrow2Pos]
                    enemySelected = true
                    console.log(enemyFighter.name)
                    if (playerSelected)
                        startGame()
                    break
                
                case 'd':
                    arrow1Pos = moveArrow(arrow1, arrow1Pos, 1, characters, fighters)
                    break
                case 'a':
                    arrow1Pos = moveArrow(arrow1, arrow1Pos, -1, characters, fighters)
                    break
                case ' ':
                    playSound(selectSound)
                    playerFighter = fighters[arrow1Pos]
                    playerSelected = true
                    console.log(playerFighter.name)
                    if (enemySelected)
                        startGame()
                    break
            }
        }

    },
    'gameScreen': {
        init: () => {
            console.log("Game screen init")
            gameBackgorund = new Sprite({position: {x: 0, y: 0}, imagesSrc: './img/background.png'})
            shop = new Sprite({position: {x: 625, y: 160}, imagesSrc: './img/shop.png', scale: 2.5, framesMax: 6})
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
                        player.lastKey = 'd'
                        keys.d.pressed = true
                        player.facing = 'right'
                        break
                    case 'a':
                        player.lastKey = 'a'
                        keys.a.pressed = true
                        player.facing = 'left'
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
                        _doActionNoSpam(player, 'attack1')
                        break
                    case 'q':
                        _doActionNoSpam(player, 'sp_attack1')
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
                        enemy.facing = 'right'
                        keys.ArrowRight.pressed = true
                        enemy.lastKey = 'ArrowRight'
                        break
                    case 'ArrowLeft':
                        enemy.facing = 'left'
                        keys.ArrowLeft.pressed = true
                        enemy.lastKey = 'ArrowLeft'
                        break
                    case 'ArrowUp':
                        enemy.velocity.y = -18
                        break
                    case '0':
                        if (enemy.velocity.y !== 0) {
                            _doActionNoSpam(enemy, 'air_attack')
                            break
                        }
                        _doActionNoSpam(enemy, 'attack1')
                        break
                    case '1':
                        _doActionNoSpam(enemy, 'sp_attack1')
                        break
                    case '9':
                        enemy.defend()
                        break
                }
            }
        }
    }
}

screens[currentScreen].init()

// const enemy = new Fighter({
//     position:{
//         x: 650, 
//         y: 100
//     },
//     velocity: {
//         x: 0,
//         y: 0,
//     },
//     color: 'green',
//     scale: 2, 
//     offset: {x:180, y:107},
//     imagesSrc: './img/Kenji/Idle_right.png',
//     framesMax: 4,
//     facing: 'left',
//     sprites: {
//         idle_right: {
//             imagesSrc: './img/Kenji/Idle_right.png', 
//             framesMax: 4,
//         },
//         idle_left: {
//             imagesSrc: './img/Kenji/Idle_left.png', 
//             framesMax: 4,
//         },
//         run_right: {
//             imagesSrc: './img/Kenji/Run_right.png', 
//             framesMax: 8,
//         },
//         run_left: {
//             imagesSrc: './img/Kenji/Run_left.png', 
//             framesMax: 8,
//         },
//         jump_right: {
//             imagesSrc: './img/Kenji/Jump_right.png', 
//             framesMax: 2,
//         },
//         jump_left: {
//             imagesSrc: './img/Kenji/Jump_left.png', 
//             framesMax: 2,
//         },
//         fall_right: {
//             imagesSrc: './img/Kenji/Fall_right.png', 
//             framesMax: 2,
//         },
//         fall_left: {
//             imagesSrc: './img/Kenji/Fall_left.png', 
//             framesMax: 2,
//         },
//         attack1_right: {
//             imagesSrc: './img/Kenji/Attack1_right.png', 
//             framesMax: 4,
//         },
//         attack1_left: {
//             imagesSrc: './img/Kenji/Attack1_left.png', 
//             framesMax: 4,
//         },
//         take_hit_right: {
//             imagesSrc: './img/Kenji/TakeHit_right.png', 
//             framesMax: 3,
//         },
//         take_hit_left: {
//             imagesSrc: './img/Kenji/TakeHit_left.png', 
//             framesMax: 3,
//         },
//         death_right: {
//             imagesSrc: './img/Kenji/Death_right.png', 
//             framesMax: 7,
//         },
//         death_left: {
//             imagesSrc: './img/Kenji/Death_right.png', 
//             framesMax: 7,
//         }
//     },
//     attackBox :{
//         offset: {
//             x: 0,
//             y: 50
//         },
//         width: 200,
//         height: 50
//     }
// });

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

decreaseTimer()


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
            document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        }

        // Detect Colision enemy attackBox
        if (rectCollision(enemy, player) && enemy.isAttcking && enemy.currentFrame === enemy.attackFrame) {
            player.takeHit(enemy, enemy.currentForce)
            enemy.isAttcking = false
            console.log('col')
            if (player.health < 0) {
                player.health = 0
            }
            document.querySelector('#playerHealth').style.width = player.health + '%'
        }

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
