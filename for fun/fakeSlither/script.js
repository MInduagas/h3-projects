const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const world = {
  posX: 10000,
  posY: 10000,
  width: 20000,
  height: 20000
}

const foodParticleCount = 50000;

let radius = 15;

let snake = {
    segments: Array.from({ length: 10 }, (_, i) => ({ x: 10000 - i * radius*0.75, y:10000})),
    radius: radius,
    direction: { x: 0, y: 0 }
  };

let foodParticles = [];

let speed = 5;
const baseIncrement = 0.25;
const growthFactor = Math.log(snake.radius + 1)

let mousePos = { x: canvas.width / 2, y: canvas.height / 2 };

var image = new Image();
image.src = "background.jpg"
image.onload = function() {
    var pattern = ctx.createPattern(image, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(world.posX, world.posY, world.width, world.height);
  };

canvas.addEventListener('mousemove', (e) => {
  mousePos = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener('mousedown', (e) => {
    speed = 7;
    snake.radius = snake.radius * 1.1;
});

canvas.addEventListener('mouseup', (e) => {
    speed = 5;
    snake.radius = snake.radius / 1.1;
});


function updateWorldPosition() {
    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    let direction = { x: mousePos.x - center.x, y: mousePos.y - center.y };
    
    const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    
    if (magnitude !== 0)  direction = { x: direction.x / magnitude, y: direction.y / magnitude };
    
    world.posX += direction.x * speed;
    world.posY += direction.y * speed;

    foodParticles.forEach(food => {
        food.x += direction.x * speed;
        food.y += direction.y * speed;
    });
}

function drawSnake() {
    ctx.fillStyle = 'lime';
    snake.segments.slice().reverse().forEach(segment => {
        ctx.beginPath();
        ctx.arc(segment.x - world.posX + canvas.width / 2, segment.y - world.posY + canvas.height / 2, snake.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fill();
      });
}

function updateSnakePosition() {
    const newHeadX = snake.segments[0].x + snake.direction.x * speed;
    const newHeadY = snake.segments[0].y + snake.direction.y * speed;

    snake.segments[0].x = newHeadX;
    snake.segments[0].y = newHeadY;

    const segmentDistance = snake.radius * 0.75;

    for (let i = 1; i < snake.segments.length; i++) {
        const dx = snake.segments[i - 1].x - snake.segments[i].x;
        const dy = snake.segments[i - 1].y - snake.segments[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy) + 0.0001;
        const difference = distance - segmentDistance;

        if (difference !== 0) {
            const adjustX = (dx / distance) * difference;
            const adjustY = (dy / distance) * difference;

            snake.segments[i].x += adjustX;
            snake.segments[i].y += adjustY;
        }
    }
}
  
function updateSnakeDirection() {
    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    let direction = { x: mousePos.x - center.x, y: mousePos.y - center.y };
    const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    if (magnitude !== 0)
        snake.direction = { x: direction.x / magnitude, y: direction.y / magnitude };
}

function drawWorld() {
    var pattern = ctx.createPattern(image, 'repeat');
    ctx.save();

    let topLeftX = world.posX - world.width / 2;
    let topLeftY = world.posY - world.height / 2;

    ctx.translate(-topLeftX, -topLeftY);

    ctx.beginPath();
    ctx.rect(topLeftX, topLeftY, world.width, world.height);
    ctx.clip();

    ctx.fillStyle = pattern;
    ctx.fillRect(-world.width/2 + window.innerWidth/2 - snake.radius, -world.height/2 + window.innerHeight/2 - snake.radius, 
        world.width + snake.radius*2, world.height + snake.radius*2);

    ctx.strokeStyle = 'red'; 
    ctx.lineWidth = 5;
    ctx.strokeRect(-world.width/2 + window.innerWidth/2 - snake.radius, -world.height/2 + window.innerHeight/2 - snake.radius, 
        world.width + snake.radius*2, world.height + snake.radius*2);

    drawFoodParticles();

    ctx.restore();
}

const initialOffset = { x: world.posX - canvas.width / 2, y: world.posY - canvas.height / 2 };
function drawFoodParticles() {
    const startPos = { x: world.posX - initialOffset.x - (canvas.width / 2), y: world.posY - initialOffset.y - (canvas.height / 2)};
    const endPos = { x: world.posX - initialOffset.x + canvas.width / 2, y: world.posY - initialOffset.y + canvas.height / 2};
    foodParticles.forEach(food => {
        const foodx = food.x - world.posX + canvas.width / 2;
        const foody = food.y - world.posY + canvas.height / 2;
        if(foodx < startPos.x || foodx > endPos.x || foody < startPos.y || foody > endPos.y) return;
            ctx.fillStyle = food.color || 'red';
            ctx.beginPath();
            ctx.arc(food.x - world.posX + canvas.width / 2, food.y - world.posY + canvas.height / 2, food.radius, 0, 2 * Math.PI);
            ctx.fill();
    });
}

function generateFoodParticles(amount) {
    for (let i = 0; i < amount; i++) {
        const x = Math.random() * world.width + world.posX - world.width / 2;
        const y = Math.random() * world.height + world.posY - world.height / 2;
        const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        const radius = Math.random() * 5 + 5;
        foodParticles.push({ x, y, color, radius });
    }
}

generateFoodParticles(foodParticleCount);


setInterval(() => { gameLoop(); }, 1000 / 60);

function gameLoop() {
    updateWorldPosition();
    updateSnakeDirection();
    checkBorderCollision();
    checkFoodCollision();
    updateSnakePosition();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWorld();
    drawSnake();
    if(foodParticles.length < foodParticleCount) generateFoodParticles(1000 - foodParticles.length);
}

function checkBorderCollision() {
    let head = snake.segments[0]; 
    let outsideHorizontalBounds = head.x < 0 || head.x > world.width;
    let outsideVerticalBounds = head.y < 0 || head.y > world.height;

    if (outsideHorizontalBounds || outsideVerticalBounds) {
        handleBorderCollision();
    }
}

function checkFoodCollision() {
    let head = snake.segments[0];

    head.radius = snake.radius;

    head = {x : head.x - world.width/2 + canvas.width/2, y: head.y - world.height/2 + canvas.height/2 };

    foodParticles.forEach((food, index) => {
        const foodx = food.x - world.posX + canvas.width / 2;
        const foody = food.y - world.posY + canvas.height / 2;

        const dx = foodx - (head.x);
        const dy = foody - (head.y);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < food.radius + snake.radius) {
            foodParticles.splice(index, 1);
            snake.segments.push({ x: snake.segments[snake.segments.length - 1].x, y: snake.segments[snake.segments.length - 1].y });;
            snake.radius += baseIncrement / growthFactor;
        }
    });

}

function handleBorderCollision() {
    snake.segments = Array.from({ length: 10 }, (_, i) => ({ x: 2500 - i * 10, y:2500}));
    snake.direction = { x: 0, y: 0 };
    world.posX = 2500;
    world.posY = 2500;
    foodParticles = [];
    snake.radius = radius;
    generateFoodParticles(foodParticleCount);
}

  
gameLoop();