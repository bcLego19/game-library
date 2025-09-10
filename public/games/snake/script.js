// Snake script.js

const CELL_SIZE = 20;
const GRID_SIZE = 20;
const DIRECTIONS = ['up', 'down', 'left', 'right'];

const body = document.body;
const gameBoard = document.querySelector("#game-board");
const resetBtn = document.querySelector("#restart-btn");

resetBtn.addEventListener("click", () => {
    clearInterval(gameInterval);
    gameBoard.innerHTML = '';
    document.querySelector("#game-over-message").classList.add('hidden');
    initializeGame();
});

const startState = {
    snake: [Math.floor((CELL_SIZE * GRID_SIZE) / 2)], // put the snake in the center (if possible)
    score: 0,
    speed: 1,
    direction: DIRECTIONS[0],
};

let gameInterval;
let snakeState;
let foodPosition = 0;

let createBoard = () => {
    // Set the grid layout on the gameBoard element
    gameBoard.style.display = 'grid';
    gameBoard.style.gridTemplateColumns = 'repeat(' + GRID_SIZE + ', 1fr)';
    gameBoard.style.gridTemplateRows = 'repeat(' + GRID_SIZE + ', 1fr)';

    // Use a single loop to create all the cells
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        gameBoard.appendChild(cell);
    }
}

let checkCollision = (newHead) => {
    // Check for self-collision
    for (let i = 0; i < snakeState.snake.length; i++) {
        if (newHead === snakeState.snake[i]) {
            return true;
        }
    }

    // Check for wall collisions
    let oldHead = snakeState.snake[0];
    let newHeadCol = newHead % GRID_SIZE;
    let oldHeadCol = oldHead % GRID_SIZE;

    // Horizontal wrap-around check
    if (snakeState.direction === 'right' && newHeadCol === 0 && oldHeadCol === GRID_SIZE - 1) {
        return true;
    }
    if (snakeState.direction === 'left' && newHeadCol === GRID_SIZE - 1 && oldHeadCol === 0) {
        return true;
    }

    // Vertical wall collision check
    let newHeadRow = Math.floor(newHead / GRID_SIZE);
    if (newHeadRow < 0 || newHeadRow >= GRID_SIZE) {
        return true;
    }

    return false;
};

let generateFood = () => {
    // generate a random position
    let newPosition = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));

    // check if the food is on the snake's body
    // find a new position if true
    let isColliding = false;
    for (let i = 0; i < snakeState.snake.length; i++) {
        if (newPosition === snakeState.snake[i]) {
            isColliding = true;
            break;
        }
    }

    if(isColliding) {
        generateFood();
    } else {
        foodPosition = newPosition;
    }
}

let checkForFood = () => {
    let head = snakeState.snake[0];
    const scoreDisplay = document.querySelector("#score");

    if (head === foodPosition) {
        // Increase the score and update the HTML display
        snakeState.score++;
        scoreDisplay.textContent = 'Score: ' + snakeState.score;
        generateFood();

        // Check for speed increase every 5 points
        if (snakeState.score % 5 === 0) {
            snakeState.speed += 1; // Increase speed
            // Clear the old interval and start a new one with the updated speed
            clearInterval(gameInterval);
            let newIntervalDelay = Math.max(100 - (snakeState.speed * 10), 50); // Minimum delay of 50ms
            gameInterval = setInterval(gameLoop, newIntervalDelay);
        }

    } else {
        // Remove the last element of the snake's array
        let newSnake = [];
        for (let i = 0; i < snakeState.snake.length - 1; i++) {
            newSnake.push(snakeState.snake[i]);
        }
        snakeState.snake = newSnake;
    }
}

let redraw = () => {
    // 1. clear the board
    // get all cells in the board
    let cells = gameBoard.getElementsByClassName('cell');

    // loop through each cell and remove existing snake or food classes
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove('snake', 'food');
    }

    // 2. Draw the snake
    // Loop through the snake's body array
    for (let i = 0; i < snakeState.snake.length; i++) {
        // get the cell at the current snake position
        let snakeCell = cells[snakeState.snake[i]];

        // add the 'snake' class to the cell
        if (snakeCell) {
            snakeCell.classList.add('snake');
        }
    }

    // 3. Draw the food
    // get the cell at the food's position
    let foodCell = cells[foodPosition];

    // add the 'food' class to the cell
    if(foodCell) {
        foodCell.classList.add('food');
    }

}

let gameLoop = () => {
    // 1. Calculate the new head position
    let head = snakeState.snake[0];
    let newHead;

    switch (snakeState.direction) {
        case 'up':
            newHead = head - GRID_SIZE;
            break;
        case 'down':
            newHead = head + GRID_SIZE;
            break;
        case 'left':
            newHead = head - 1;
            break;
        case 'right':
            newHead = head + 1;
            break;
    }

    // 2. Check for collisions on the *newHead* before moving the snake
    if (checkCollision(newHead)) {
        clearInterval(gameInterval);
        document.querySelector("#game-over-message").classList.remove('hidden');
        return;
    }

    // 3. If no collision, update the snake's position with the newHead
    let newSnake = [newHead];
    for (let i = 0; i < snakeState.snake.length; i++) {
        newSnake.push(snakeState.snake[i]);
    }
    snakeState.snake = newSnake;

    // 4. Check for food and redraw the board
    checkForFood();
    redraw();
};

let initializeGame = () => {
    createBoard();
    snakeState = JSON.parse(JSON.stringify(startState));
    generateFood(); // Now the first piece of food will be drawn
    
    // Set the initial game interval using the starting speed
    gameInterval = setInterval(gameLoop, 100); 
}

document.addEventListener("DOMContentLoaded", () => {
    initializeGame();
});

document.addEventListener("keydown", (e) => {
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
            if(snakeState.direction !== 'down') {
                snakeState.direction = 'up';
            }
            break;
        case 'ArrowDown':
        case 's':
            if(snakeState.direction !== 'up') {
                snakeState.direction = 'down';
            }
            break;
        case 'ArrowLeft':
        case 'a':
            if(snakeState.direction !== 'right') {
                snakeState.direction = 'left';
            }
            break;
        case 'ArrowRight':
        case 'd':
            if(snakeState.direction !== 'left') {
                snakeState.direction = 'right';
            }
            break;
    }
});