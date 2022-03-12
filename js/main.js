/* Javascript */
const boardBorder = 'black';
const boardBackground = 'white';
const snakeCol = 'blue';
const snakeBorder = 'black';

let snake = [
    { x: 144, y: 160 }
];

let score = 0;
let previusScore = 0;
let changingDirection = false;
let foodX;
let foodY;
let horizontalVel = 16;
let verticalVel = 0;
let foodInterval;
let gameEnded = false;

var rect = {
    x: 330,
    y: 390,
    width: 800,
    heigth: 800
}

const snakeBoard = document.getElementById("snake");
const snakeBoardCtx = snakeBoard.getContext('2d');

main();

genFood();

document.addEventListener("keydown", changeDirection);
snakeBoard.addEventListener("click", mouseClick);

function main() {
    if (hasGameEnded()) {
        drawPlayAgainButton();
        gameEnded = true;
        return;
    }

    changingDirection = false;
    setTimeout(function onTick() {
        clearBoard();
        drawScore();
        drawFood();
        moveSnake();
        drawSnake();
        main();
    }, 100);
}

function clearBoard() {
    snakeBoardCtx.fillStyle = boardBackground;
    snakeBoardCtx.strockestyle = boardBorder;
    snakeBoardCtx.fillRect(0, 0, snakeBoard.width, snakeBoard.height);
    snakeBoardCtx.strokeRect(0, 0, snakeBoard.width, snakeBoard.height);

}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function isInside(pos, rect) {
    return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.heigth && pos.y > rect.y;
}

function resetGame() {
    previusScore = score;
    score = 0;
    snake = [
        { x: 144, y: 160 }
    ];
    gameEnded = false;
    horizontalVel = 16;
    verticalVel = 0;

}

function mouseClick(event) {
    let mousePos = getMousePos(snakeBoard, event);
    if (isInside(mousePos, rect) && gameEnded) {
        resetGame();
        main();
    }
}

function drawPlayAgainButton() {
    snakeBoardCtx.beginPath();
    snakeBoardCtx.rect(330, 390, 100, 50);
    snakeBoardCtx.fillStyle = '#FFFFFF';
    snakeBoardCtx.fillStyle = 'rgba(255,255,255,0.5)';
    snakeBoardCtx.fillRect(25, 72, 32, 32);
    snakeBoardCtx.fill();
    snakeBoardCtx.lineWidth = 2;
    snakeBoardCtx.strokeStyle = '#000000';
    snakeBoardCtx.stroke();
    snakeBoardCtx.closePath();
    snakeBoardCtx.font = '12px Arial';
    snakeBoardCtx.fillStyle = '#000000';
    snakeBoardCtx.fillText('Play Again', 345, 415);
}

function drawScore() {
    if (score > previusScore && previusScore > 0)
        snakeBoardCtx.fillStyle = 'green';
    else
        snakeBoardCtx.fillStyle = 'black';
    snakeBoardCtx.font = "12px Arial";
    snakeBoardCtx.fillText("Score: " + score, 400, 20);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawFood() {
    snakeBoardCtx.fillStyle = 'blue';
    snakeBoardCtx.strockestyle = 'black';
    snakeBoardCtx.fillRect(foodX, foodY, 16, 16);
    snakeBoardCtx.strokeRect(foodX, foodY, 16, 16);
}

function drawSnakePart(snakePart) {
    snakeBoardCtx.fillStyle = snakeCol;
    snakeBoardCtx.strockestyle = snakeBorder;
    snakeBoardCtx.fillRect(snakePart.x, snakePart.y, 16, 16);
    snakeBoardCtx.strokeRect(snakePart.x, snakePart.y, 16, 16);
}

function hasGameEnded() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeBoard.width - 16;
    const hitBottomWall = snake[0].y > snakeBoard.height - 16;
    const hitTopWall = snake[0].y < 0;
    return hitLeftWall || hitRightWall || hitBottomWall || hitTopWall;
}

function randomXFood() {
    return Math.floor(Math.random() * 17 + 1) * 16;
}

function randomYFood() {
    return Math.floor(Math.random() * 15 + 3) * 16;
}

function genFood() {
    //let time = Math.floor(Math.random() * (10 - 4 + 1) + 4) * 1000;

    //foodInterval = setTimeout(function onTick(){
    foodX = randomXFood();
    foodY = randomYFood();
    snake.forEach(function hasSnakeEatenFood(part) {
        const hasEaten = part.x == foodX && part.y == foodY;
        if (hasEaten) {
            //clearTimeout(foodInterval);
            genFood();
        }
    });

    //clearTimeout(foodInterval);
    //},time);

}

function changeDirection(event) {

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;
    const keyPressed = event.keyCode;
    const goingUp = verticalVel === -16;
    const goingDown = verticalVel === 16;
    const goingRight = horizontalVel === 16;
    const goingLeft = horizontalVel === -16;
    if (keyPressed === LEFT_KEY && !goingRight) {
        horizontalVel = -16;
        verticalVel = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        horizontalVel = 0;
        verticalVel = -16;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        horizontalVel = 16;
        verticalVel = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        horizontalVel = 0;
        verticalVel = 16;
    }
}

function moveSnake() {
    const head = { x: snake[0].x + horizontalVel, y: snake[0].y + verticalVel };
    snake.unshift(head);
    const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;
    if (hasEatenFood) {
        score += 1;
        genFood();
    }
    else {
        snake.pop();
    }
}