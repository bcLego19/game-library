// Snake script.js

const CELL_SIZE = 20;
const GRID_SIZE = 20;
const DIRECTIONS = ['up', 'down', 'left', 'right'];

const body = document.body;
const gameBoard = document.querySelector("#game-board");
const resetBtn = document.querySelector("#restart-btn");
const scoreDisplay = document.querySelector("#score");
const gameOverMessage = document.querySelector("#game-over-message");

// --- D-Pad Controls (Mobile) Selectors ---
const upBtn = document.getElementById('up-btn');
const bottomBtn = document.getElementById('bottom-btn'); 
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
// -----------------------------------------

resetBtn.addEventListener("click", () => {
    clearInterval(gameInterval);
    gameBoard.innerHTML = '';
    gameOverMessage.classList.add('hidden');
    initializeGame();
});

const startState = {
    // Initial snake position (center of the grid)
    snake: [Math.floor((GRID_SIZE * GRID_SIZE) / 2)], 
    score: 0,
    speed: 1,
    direction: DIRECTIONS[3], // Start moving right
};

let gameInterval;
let snakeState;
let foodPosition = 0;

/**
 * Sets up the visual grid board.
 */
let createBoard = () => {
    gameBoard.style.display = 'grid';
    gameBoard.style.gridTemplateColumns = 'repeat(' + GRID_SIZE + ', 1fr)';
    gameBoard.style.gridTemplateRows = 'repeat(' + GRID_SIZE + ', 1fr)';

    // Create all cells
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        gameBoard.appendChild(cell);
    }
}

/**
 * Checks if the snake has collided with a wall or itself.
 * @param {number} newHead - The calculated position of the next head segment.
 * @returns {boolean} True if collision occurred, false otherwise.
 */
let checkCollision = (newHead) => {
    // 1. Check for self-collision
    for (let i = 0; i < snakeState.snake.length; i++) {
        if (newHead === snakeState.snake[i]) {
            return true;
        }
    }

    // 2. Check for wall collisions
    let oldHead = snakeState.snake[0];
    let newHeadCol = newHead % GRID_SIZE;
    let oldHeadCol = oldHead % GRID_SIZE;

    // Horizontal wall collision check (Left or Right Edge)
    // Checks if we crossed from the last column to the first, or vice versa
    if (snakeState.direction === 'right' && newHeadCol === 0 && oldHeadCol === GRID_SIZE - 1) {
        return true;
    }
    if (snakeState.direction === 'left' && newHeadCol === GRID_SIZE - 1 && oldHeadCol === 0) {
        return true;
    }

    // Vertical wall collision check (Top or Bottom Edge)
    let newHeadRow = Math.floor(newHead / GRID_SIZE);
    if (newHeadRow < 0 || newHeadRow >= GRID_SIZE) {
        return true;
    }

    return false;
};

/**
 * Generates a new random position for the food, ensuring it's not on the snake.
 */
let generateFood = () => {
    let newPosition;

    // Loop until a non-colliding position is found
    do {
        newPosition = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
    } while (snakeState.snake.includes(newPosition));
    
    foodPosition = newPosition;
}

/**
 * Checks if the snake's head is on the food.
 */
let checkForFood = () => {
    let head = snakeState.snake[0];
    
    if (head === foodPosition) {
        // FOOD EATEN
        snakeState.score++;
        scoreDisplay.textContent = 'Score: ' + snakeState.score;
        generateFood();

        // Check for speed increase every 5 points
        if (snakeState.score % 5 === 0) {
            snakeState.speed += 1; 
            clearInterval(gameInterval);
            // Calculate new interval delay: 100ms starting, decreases by 10ms per speed level, min 50ms
            let newIntervalDelay = Math.max(100 - (snakeState.speed * 10), 50); 
            gameInterval = setInterval(gameLoop, newIntervalDelay);
        }
    } else {
        // NO FOOD: Remove the last element of the snake's array (standard movement)
        snakeState.snake.pop(); 
    }
}

/**
 * Updates the visual state of the board based on the snake and food positions.
 */
let redraw = () => {
    let cells = gameBoard.getElementsByClassName('cell');

    // 1. Clear the board
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove('snake', 'food');
    }

    // 2. Draw the snake
    for (let i = 0; i < snakeState.snake.length; i++) {
        let snakeCell = cells[snakeState.snake[i]];
        if (snakeCell) {
            snakeCell.classList.add('snake');
        }
    }

    // 3. Draw the food
    let foodCell = cells[foodPosition];
    if(foodCell) {
        foodCell.classList.add('food');
    }
}

/**
 * The main game loop executed at intervals.
 */
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

    // 2. Check for collisions
    if (checkCollision(newHead)) {
        clearInterval(gameInterval);
        gameOverMessage.classList.remove('hidden');
        return;
    }

    // 3. Update the snake's position with the newHead
    snakeState.snake.unshift(newHead); 

    // 4. Check for food and redraw the board
    checkForFood();
    redraw();
};

/**
 * Sets up the game state and starts the interval.
 */
let initializeGame = () => {
    createBoard();
    // Use deep copy to reset state
    snakeState = JSON.parse(JSON.stringify(startState)); 
    scoreDisplay.textContent = 'Score: 0';
    generateFood(); 
    
    // Start the game interval
    gameInterval = setInterval(gameLoop, 100); 
}

// ----------------------------------------------------
// --- CONTROL HANDLERS ---
// ----------------------------------------------------

/**
 * Handles directional change from D-pad button clicks.
 * @param {string} direction - 'up', 'down', 'left', or 'right'.
 */
const handleDpadClick = (direction) => {
    // Check if game is over before allowing direction change
    if (gameOverMessage.classList.contains('hidden')) {
        
        // Prevent immediate reverse direction, matching keyboard logic
        if (direction === 'up' && snakeState.direction !== 'down') {
            snakeState.direction = 'up';
        } else if (direction === 'down' && snakeState.direction !== 'up') {
            snakeState.direction = 'down';
        } else if (direction === 'left' && snakeState.direction !== 'right') {
            snakeState.direction = 'left';
        } else if (direction === 'right' && snakeState.direction !== 'left') {
            snakeState.direction = 'right';
        }
    }
};

// Add event listeners for the mobile buttons
upBtn.addEventListener('click', () => handleDpadClick('up'));
bottomBtn.addEventListener('click', () => handleDpadClick('down'));
leftBtn.addEventListener('click', () => handleDpadClick('left'));
rightBtn.addEventListener('click', () => handleDpadClick('right'));

// Keyboard listener for desktop play
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

document.addEventListener("DOMContentLoaded", () => {
    initializeGame();
});