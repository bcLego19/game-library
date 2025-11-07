// Get all the DOM elements
const canvas = document.querySelector("#pong-board");
const ctx = canvas.getContext("2d");
const playerScoreEl = document.querySelector("#player-score");
const computerScoreEl = document.querySelector("#computer-score");
const resetBtn = document.querySelector("#restart-btn");

// Modified D-pad selectors
const upBtn = document.getElementById('up-btn');
const bottomBtn = document.getElementById('bottom-btn'); 

// Set up the game constants
const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PADDLE_SPEED = 10;

// Set the canvas dimensions
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Define initial game state
const startState = {
    player: {
        x: 10,
        y: GAME_HEIGHT / 2 - 50,
        width: 10,
        height: 100,
        score: 0,
    },
    computer: {
        x: GAME_WIDTH - 20,
        y: GAME_HEIGHT / 2 - 50,
        width: 10,
        height: 100,
        score: 0,
    },
    ball: {
        x: GAME_WIDTH / 2,
        y: GAME_HEIGHT / 2,
        radius: 7,
        speed: 5,
        dx: 5, // horizontal velocity
        dy: 5, // vertical velocity
    },
};

let keys = {};
let gameState;
let gameInterval;

// Global state for continuous movement via mobile buttons
let playerMovingUp = false;
let playerMovingDown = false;

// Function to draw the ball
let drawBall = (context, ballDetails) => {
    // Using the CSS variable paddle color for the ball
    context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--paddle-color'); 
    context.beginPath();
    context.arc(ballDetails.x, ballDetails.y, ballDetails.radius, 0, 2 * Math.PI);
    context.fill();
};

// Function to draw the paddles
let drawPaddle = (context, paddleDetails) => {
    context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--paddle-color');
    context.fillRect(paddleDetails.x, paddleDetails.y, paddleDetails.width, paddleDetails.height);
};

let draw = () => {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw the center line
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(GAME_WIDTH / 2, 0);
    ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line style

    drawBall(ctx, gameState.ball);
    drawPaddle(ctx, gameState.player);
    drawPaddle(ctx, gameState.computer);
}

let resetBall = () => {
    // Reset ball to the center
    gameState.ball.x = GAME_WIDTH / 2;
    gameState.ball.y = GAME_HEIGHT / 2;

    // Reverse the horizontal direction to make it bounce back
    gameState.ball.dx *= -1;
}

let paddleCollisionCheck = () => {
    // Check for collision with the computer's paddle
    if (gameState.ball.dx > 0 &&
        gameState.ball.x + gameState.ball.radius >= gameState.computer.x &&
        gameState.ball.y + gameState.ball.radius >= gameState.computer.y &&
        gameState.ball.y - gameState.ball.radius <= gameState.computer.y + gameState.computer.height) {
        
        gameState.ball.dx *= -1;
        
        let relativeIntersectY = (gameState.computer.y + gameState.computer.height / 2) - gameState.ball.y;
        let normalizedRelativeIntersectionY = relativeIntersectY / (gameState.computer.height / 2);
        
        gameState.ball.dy = normalizedRelativeIntersectionY * gameState.ball.speed;
    }

    // Check for collision with the player's paddle
    if (gameState.ball.dx < 0 &&
        gameState.ball.x - gameState.ball.radius <= gameState.player.x + gameState.player.width &&
        gameState.ball.y + gameState.ball.radius >= gameState.player.y &&
        gameState.ball.y - gameState.ball.radius <= gameState.player.y + gameState.player.height) {
            
        gameState.ball.dx *= -1;

        let relativeIntersectY = (gameState.player.y + gameState.player.height / 2) - gameState.ball.y;
        let normalizedRelativeIntersectionY = relativeIntersectY / (gameState.player.height / 2);

        gameState.ball.dy = normalizedRelativeIntersectionY * gameState.ball.speed;
    }
}

let update = () => {
    // useful variables
    let gameBall = gameState.ball;
    let gameComputer = gameState.computer;

    // 1. Update the ball's position
    gameBall.x += gameBall.dx;
    gameBall.y += gameBall.dy;

    // 2. check for collisions with the top and bottom walls
    if (gameBall.y - gameBall.radius < 0 || gameBall.y + gameBall.radius > GAME_HEIGHT) {
        // Reverse vertical velocity to bounce off the wall
        gameBall.dy *= -1;
    }

    paddleCollisionCheck();

    // 3. Check for scoring (ball has reached left or right side of the canvas)
    if (gameBall.x - gameBall.radius < 0) {
        // Computer scores a point
        gameComputer.score++;
        computerScoreEl.textContent = 'Computer: ' + gameComputer.score;
        resetBall();
    } else if (gameBall.x + gameBall.radius > GAME_WIDTH) {
        // Player scores a point
        gameState.player.score++;
        playerScoreEl.textContent = 'Player: ' + gameState.player.score;
        resetBall();
    }

    // 4. Implement a realistic computer AI
    const AI_SPEED = gameState.ball.speed * 0.9; // AI is slightly slower than the ball
    const AI_REACTION = 0.5; // A value between 0 and 1. Lower is slower reaction.

    // Move the AI paddle only when the ball is on its side of the board and randomly
    if (gameState.ball.dx > 0) {
        if (Math.random() > AI_REACTION) {
            if (gameState.computer.y + gameState.computer.height / 2 < gameState.ball.y) {
                gameState.computer.y += AI_SPEED;
            } else {
                gameState.computer.y -= AI_SPEED;
            }
        }
    }
    
    // Prevent the computer paddle from moving off-screen
    gameState.computer.y = Math.max(0, gameState.computer.y, Math.min(GAME_HEIGHT - gameState.computer.height, gameState.computer.y));

    // 5. Track events for player paddle movement (Keyboard OR Mobile)
    if (keys['ArrowUp'] || keys['w'] || playerMovingUp) {
        gameState.player.y -= PADDLE_SPEED;
    }
    if (keys['ArrowDown'] || keys['s'] || playerMovingDown) {
        gameState.player.y += PADDLE_SPEED;
    }
    
    // Prevent the paddle from moving off-screen
    gameState.player.y = Math.max(0, Math.min(GAME_HEIGHT - gameState.player.height, gameState.player.y));
};

let gameLoop = () => {
    update();
    draw();
};

// An initialization function is needed to start the game loop
let initializeGame = () => {
    gameState = JSON.parse(JSON.stringify(startState)); // Create a copy of the startState
    gameInterval = setInterval(() => {
        gameLoop();
    }, 1000 / 60); // Aim for 60 frames per second
};

resetBtn.addEventListener("click", () => {
    clearInterval(gameInterval);
    computerScoreEl.textContent = 'Computer: 0';
    playerScoreEl.textContent = 'Player: 0';
    initializeGame();
});

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// Start the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
    initializeGame();
});

// ---------------------------------------------
// --- MOBILE TOUCH/CLICK CONTROL FUNCTIONS ---
// ---------------------------------------------

// Function to handle start movement (mobile touch/click)
const startMoving = (direction, element) => {
    element.classList.add('is-active'); // Apply visual active state
    if (direction === 'up') {
        playerMovingUp = true;
        playerMovingDown = false; 
    } else if (direction === 'down') {
        playerMovingDown = true;
        playerMovingUp = false; 
    }
}

// Function to handle stop movement (mobile touch/click)
const stopMoving = (direction, element) => {
    element.classList.remove('is-active'); // Remove visual active state
    if (direction === 'up') {
        playerMovingUp = false;
    } else if (direction === 'down') {
        playerMovingDown = false;
    }
}

// ---------------------------------------------
// --- ATTACH LISTENERS TO MOBILE BUTTONS ---
// ---------------------------------------------

// Attach listeners for UP button
upBtn.addEventListener('mousedown', (e) => { e.preventDefault(); startMoving('up', upBtn); });
upBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startMoving('up', upBtn); });
upBtn.addEventListener('mouseup', () => stopMoving('up', upBtn));
upBtn.addEventListener('touchend', () => stopMoving('up', upBtn));
upBtn.addEventListener('touchcancel', () => stopMoving('up', upBtn)); 

// Attach listeners for DOWN button
bottomBtn.addEventListener('mousedown', (e) => { e.preventDefault(); startMoving('down', bottomBtn); });
bottomBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startMoving('down', bottomBtn); });
bottomBtn.addEventListener('mouseup', () => stopMoving('down', bottomBtn));
bottomBtn.addEventListener('touchend', () => stopMoving('down', bottomBtn));
bottomBtn.addEventListener('touchcancel', () => stopMoving('down', bottomBtn));