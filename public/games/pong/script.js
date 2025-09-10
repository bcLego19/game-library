// Get all the DOM elements
const canvas = document.querySelector("#pong-board");
const ctx = canvas.getContext("2d");
const playerScoreEl = document.querySelector("#player-score");
const computerScoreEl = document.querySelector("#computer-score");
const resetBtn = document.querySelector("#restart-btn");

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

// Function to draw the ball
let drawBall = (context, ballDetails) => {
    context.fillStyle = '#FFFFFF';
    context.beginPath();
    context.arc(ballDetails.x, ballDetails.y, ballDetails.radius, 0, 2 * Math.PI);
    context.fill(); // Use fill instead of stroke for a solid ball
};

// Function to draw the paddles
let drawPaddle = (context, paddleDetails) => {
    context.fillStyle = '#FFFFFF';
    context.fillRect(paddleDetails.x, paddleDetails.y, paddleDetails.width, paddleDetails.height);
};

let draw = () => {

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

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
    // Check if the ball is moving right and its position is within the computer's paddle
    if (gameState.ball.dx > 0 &&
        gameState.ball.x + gameState.ball.radius >= gameState.computer.x &&
        gameState.ball.y + gameState.ball.radius >= gameState.computer.y &&
        gameState.ball.y - gameState.ball.radius <= gameState.computer.y + gameState.computer.height) {
        
        // Reverse the ball's horizontal direction
        gameState.ball.dx *= -1;
        
        // Calculate the hit location
        let relativeIntersectY = (gameState.computer.y + gameState.computer.height / 2) - gameState.ball.y;
        let normalizedRelativeIntersectionY = relativeIntersectY / (gameState.computer.height / 2);
        
        // Adjust the ball's vertical velocity
        gameState.ball.dy = normalizedRelativeIntersectionY * gameState.ball.speed;
    }

    // Check for collision with the player's paddle
    // Check if the ball is moving left and its position is within the player's paddle
    if (gameState.ball.dx < 0 &&
        gameState.ball.x - gameState.ball.radius <= gameState.player.x + gameState.player.width &&
        gameState.ball.y + gameState.ball.radius >= gameState.player.y &&
        gameState.ball.y - gameState.ball.radius <= gameState.player.y + gameState.player.height) {
            
        // Reverse the ball's horizontal direction
        gameState.ball.dx *= -1;

        // Calculate the hit location
        let relativeIntersectY = (gameState.player.y + gameState.player.height / 2) - gameState.ball.y;
        let normalizedRelativeIntersectionY = relativeIntersectY / (gameState.player.height / 2);

        // Adjust the ball's vertical velocity
        gameState.ball.dy = normalizedRelativeIntersectionY * gameState.ball.speed;
    }
}

let update = () => {
    // useful variables
    let gameBall = gameState.ball;
    let gamePlayer = gameState.player;
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
        gamePlayer.score++;
        playerScoreEl.textContent = 'Player: ' + gamePlayer.score;
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

    // 5. Track events for player paddle movement
    if (keys['ArrowUp'] || keys['w']) {
        gameState.player.y -= PADDLE_SPEED;
    }
    if (keys['ArrowDown'] || keys['s']) {
        gameState.player.y += PADDLE_SPEED;
    }
    
    // Prevent the paddle from moving off-screen
    gameState.player.y = Math.max(0, Math.min(GAME_HEIGHT - gameState.player.height, gameState.player.y));
};

let gameLoop = () => {

    // Breakdown of game loop:
    // 1. get current state of the board (done using gameState variable)

    // 2. Update the game state
    update();

    // 3. redraw the board
    draw();

};

// An initialization function is needed to start the game loop
let initializeGame = () => {
    gameState = JSON.parse(JSON.stringify(startState)); // Create a copy of the startState
    gameInterval = setInterval(() => {
        // game loop logic will go here
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