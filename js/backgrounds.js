
const back = new Image()
back.src = './img/back.png'
const mid = new Image()
mid.src = './img/middle.png'
let startBackground1 = new ScrollingSprite(back, 0, 0, canvas.width, canvas.height, 1)
let startBackground2 = new ScrollingSprite(back, -canvas.width, 0, canvas.width, canvas.height, 1);
let startBackground3 = new ScrollingSprite(mid, 0, 150, canvas.width, canvas.height, 2, scaleX = 1.005, scaleY = 2)
let startBackground4 = new ScrollingSprite(mid, -canvas.width, 150, canvas.width, canvas.height, 2, scaleX = 1.005, scaleY = 2);





const back1 = new Image()
back1.src = './img/rtb/background.png'
const mid1 = new Image()
mid1.src = './img/rtb/background2.png'
let startBackground11 = new ScrollingSprite(back, 0, 0, canvas.width, canvas.height, 1)
let startBackground12 = new ScrollingSprite(back, -canvas.width, 0, canvas.width, canvas.height, 1);
let startBackground13 = new ScrollingSprite(mid, 0, 150, canvas.width, canvas.height, 2, scaleX = 1.005, scaleY = 2)
let startBackground14 = new ScrollingSprite(mid, -canvas.width, 150, canvas.width, canvas.height, 2, scaleX = 1.005, scaleY = 2);