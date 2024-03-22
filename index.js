const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width  = 1277;
canvas.height = 576;

const computedStyle = window.getComputedStyle(canvas);
const compCanvasWidth = parseFloat(computedStyle.width);
const compCanvasHeight =  parseFloat(computedStyle.height);
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const overlay = {
    opacity: 0
};

c.fillRect(0, 0, canvas.width, canvas.height);

let player;
let enemy;

let enemyAIOn = false;
let gameMode = '';
let screens;
let LoadingScreenIns;
let startScreenIns;
let charSelectIns;
let GameScreenIns;
let GameOverScreenIns;

window.addEventListener('keydown', (event) => {
    event.preventDefault();
    screens[currentScreen].keyFunc(event.key);
});

window.addEventListener('keyup', (event) => {
    keyUpFunc(event.key);
});

LoadingScreenIns = new LoadingScreenCLS(c, canvas.width, canvas.height);
LoadingScreenIns.init()
let currentScreen = 'loadingScreen';
let isLoading = true;

function animateLoading() {
    if(isLoading) {
        window.requestAnimationFrame(animateLoading);
    }
    LoadingScreenIns.draw();
}
animateLoading();

load(assetList, handleAssetDownload).then(() => {    
    isLoading = false;
    startScreenIns = new StartScreenCLS(c, canvas.width, canvas.height);
    charSelectIns = new CharSelectCLS(c, canvas.width, canvas.height);
    GameScreenIns = new GameScreenCLS(c, canvas.width, canvas.height);
    GameOverScreenIns = new GameOverScreenCLS(c, canvas.width, canvas.height);
    
    screens = {
        'loadingScreen': {
            init: () => {
                LoadingScreenIns.init();   
            },
            draw: () => {
                LoadingScreenIns.draw();
            },
            keyFunc: (key) => {
                LoadingScreenIns.keyFunc(key);
            }
        },
        'startScreen': {
            init: () => {
                startScreenIns.init();   
            },
            draw: () => {
                startScreenIns.draw();
            },
            keyFunc: (key) => {
                startScreenIns.keyFunc(key);
            }
        },
        'charSelectScreen': {
            init: () => {
                charSelectIns.init();
            },
            draw: () => {
                charSelectIns.draw();
            },        
            keyFunc: (key) => {
                charSelectIns.keyFunc(key);
            }
        },
        'gameScreen': {
            init: () => {
                GameScreenIns.init(charSelectIns.getPlayerFighter(), charSelectIns.getEnemyFighter());
                player = GameScreenIns.getPlayer();
                enemy = GameScreenIns.getEnemy();
            },
            draw: () => {
                GameScreenIns.draw();

            },
            keyFunc: (key) => {
                GameScreenIns.keyFunc(key);
            }
        },
        'gameOverScreen': {
            init: () => {
                GameOverScreenIns.init();
            },
            draw: () => {
                GameOverScreenIns.draw();
            },
            keyFunc: (key) => {
                GameOverScreenIns.keyFunc(key);
            }
        }
    };

    _doFuncNoSpam(fadeFunc, startScreen)
    screens[currentScreen].init();

    setTimeout(() => { enemyAIOn= true; }, 1500);


    function animate() {
        window.requestAnimationFrame(animate);
        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height);
        screens[currentScreen].draw();

        if (player && enemy) {
            // Player Movement
            player.velocity.x = 0;
            if (keys.a.pressed && player.lastKey === 'a') {
                player.switchSprite('run');
                player.velocity.x = -5;
            
        } else if (keys.d.pressed && player.lastKey === 'd') {
                player.switchSprite('run');
                player.velocity.x = 5;
            
        } else if (keys.d.double >= 2) {
                player.velocity.x += 7;
                player.roll();
            
        } else if (keys.a.double >= 2) {
                player.velocity.x -= 7;
                player.roll();
            
        } else {
                player.switchSprite('idle');
            }
            if (player.velocity.y < 0) {
                player.switchSprite('jump');
            
        } else if (player.velocity.y > 0) {
                player.switchSprite('fall');
            }

            if (gameMode === 'pve') { // can be optimize!
                enemyAI();
            
        } else {
                // Enemy Movement
                enemy.velocity.x = 0;
                if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
                    enemy.switchSprite('run');
                    enemy.velocity.x = 5;
                } else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
                    enemy.switchSprite('run');
                    enemy.velocity.x = -5;
                } else if (keys.ArrowRight.double >= 2) {
                    enemy.velocity.x += 7;
                    enemy.roll();
                } else if (keys.ArrowLeft.double >= 2) {
                    enemy.velocity.x -= 7;
                    enemy.roll();
                } else {
                    enemy.switchSprite('idle');
                }
                
                if (enemy.velocity.y < 0) {
                    enemy.switchSprite('jump');
                } else if (enemy.velocity.y > 0) {
                    enemy.switchSprite('fall');
                }
            }
            
            // Detect Collision player attackBox
            if (rectCollision(player, enemy) && player.isAttcking && player.currentFrame === player.attackFrame) {
                enemy.takeHit(player.currentForce);
                player.isAttcking = false;
                if (enemy.health < 0) {
                    enemy.health = 0;
                }
            }
            
            // Detect Collision enemy attackBox
            if (rectCollision(enemy, player) && enemy.isAttcking && enemy.currentFrame === enemy.attackFrame) {
                player.takeHit(enemy.currentForce);
                enemy.isAttcking = false;
                if (player.health < 0) {
                    player.health = 0;
                }
            }
            
            // Characters Health handler
            if (GameScreenIns.isStarted && (enemy.health <= 0 || player.health <= 0)) {
                enemyAIOn = false;
                GameScreenIns.determineWinner();
            }
            
        }

        // Fade effect between screens
        c.save();
        c.globalAlpha = overlay.opacity;
        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.restore();
    }

    animate();
});
