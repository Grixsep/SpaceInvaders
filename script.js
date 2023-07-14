import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyD7Q-WC58L-ifvlntZbinIbl_IZo6CCQDg",
    authDomain: "space-invaders-c6750.firebaseapp.com",
    projectId: "space-invaders-c6750",
    storageBucket: "space-invaders-c6750.appspot.com",
    messagingSenderId: "427485840519",
    appId: "1:427485840519:web:382cf58f355b4911aea422",
    measurementId: "G-FKECXYV7VY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let baseAlienSpeed = 2;
let round = 1;
let roundSpeedIncrease = 0.3;
let roundStartingSpeed = baseAlienSpeed;
let alienDirection = 1;  // 1 means right, -1 means left
let lastSpeedIncrease = Date.now();


let aliens = [];
let player = { x: canvas.width / 2, y: canvas.height - 50, width: 50, height: 50, speed: 5, lives: 3, score: 0, dx: 0 };
let bullets = [];
let bombs = [];
let saucers = [];
let eliminatedAliens = 0;

// Populate aliens in a 8x6 block with different sizes and scores
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 6; j++) {
        let width = 50, score = 50;
        if (j >= 3 && j < 5) { width = 40; score = 100; }
        else if (j >= 5) { width = 30; score = 300; }

        aliens.push({
            x: i * (width + 10),
            y: j * (width + 10),
            width: width,
            height: width,
            dx: baseAlienSpeed,
            dy: 0,
            score: score
        });
    }
}

function drawRectangle(rect, color) {
    ctx.fillStyle = color;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}

function updateGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
    
   
    // Draw player
    drawRectangle(player, 'green');

    // Update aliens
    // Update aliens
	let rightmostAlien = Math.max(...aliens.map(alien => alien.x + alien.width));
	let leftmostAlien = Math.min(...aliens.map(alien => alien.x));

	if (alienDirection === 1 && rightmostAlien + baseAlienSpeed > canvas.width) {
		alienDirection = -1;
		aliens.forEach(alien => alien.y += 10);
	} else if (alienDirection === -1 && leftmostAlien - baseAlienSpeed < 0) {
		alienDirection = 1;
		aliens.forEach(alien => alien.y += 10);
	}
	aliens.forEach(alien => alien.x += baseAlienSpeed * alienDirection);

	aliens.forEach(alien => drawRectangle(alien, 'red'));

    // Update saucers
    saucers.forEach((saucer, i) => {
        saucer.x += saucer.dx;
        drawRectangle(saucer, 'purple');
        // Remove the saucer if it goes off the screen
        if (saucer.x > canvas.width) saucers.splice(i, 1);
    });

    // Draw & update bullets
    bullets.forEach((bullet, i) => {
        drawRectangle(bullet, 'white');
        bullet.y -= bullet.dy;
        if (bullet.y < 0) bullets.splice(i, 1);
    });

    // Draw & update bombs
    bombs.forEach((bomb, i) => {
        drawRectangle(bomb, 'orange');
        bomb.y += bomb.dy;
        if (bomb.y > canvas.height) bombs.splice(i, 1);
    });

    // Collisions
    bullets.forEach((bullet, bulletIndex) => {
        aliens.forEach((alien, alienIndex) => {
            if (bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.y + bullet.height > alien.y) {
                // Remove bullet and alien
                bullets.splice(bulletIndex, 1);
                aliens.splice(alienIndex, 1);
                // Increase score based on the alien's score value
                player.score += alien.score;
                eliminatedAliens++;

                // Create a new saucer for every 8 to 12 eliminated aliens
                if (eliminatedAliens % Math.floor(Math.random() * 5 + 8) === 0 && saucers.length < round * 3) {
                    saucers.push({
                        x: 0,
                        y: 0,
                        width: 75,  // 150% of the bottom row alien width
                        height: 75,
                        dx: roundStartingSpeed * 3,  // 300% of the current round's starting speed
                        score: 1000
                    });
                }
            }
        });
    });

    // Bullet-saucer collisions
    bullets.forEach((bullet, bulletIndex) => {
        saucers.forEach((saucer, saucerIndex) => {
            if (bullet.x < saucer.x + saucer.width &&
                bullet.x + bullet.width > saucer.x &&
                bullet.y < saucer.y + saucer.height &&
                bullet.y + bullet.height > saucer.y) {
                // Remove bullet and saucer
                bullets.splice(bulletIndex, 1);
                saucers.splice(saucerIndex, 1);
                // Increase score based on the saucer's score value
                player.score += saucer.score;
            }
        });
    });

    // Bomb collisions with player
    bombs.forEach((bomb, i) => {
        if (bomb.x < player.x + player.width &&
            bomb.x + bomb.width > player.x &&
            bomb.y < player.y + player.height &&
            bomb.y + bomb.height > player.y) {
            // Remove bomb and decrease player's life
            bombs.splice(i, 1);
            player.lives -= 1;
            if (player.lives === 0) {
                showGameOverScreen();
                // End the game by not calling updateGame() again
                return;
            }
        }
    });

    // Check if all aliens have been eliminated
    if (aliens.length === 0) {
        // Start next round
        round++;
        roundStartingSpeed += roundStartingSpeed * roundSpeedIncrease;
        baseAlienSpeed = roundStartingSpeed;
        // Repopulate aliens
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 6; j++) {
                let width = 50, score = 50;
                if (j >= 3 && j < 5) { width = 40; score = 100; }
                else if (j >= 5) { width = 30; score = 300; }

                aliens.push({
                    x: i * (width + 10),
                    y: j * (width + 10),
                    width: width,
                    height: width,
                    dx: baseAlienSpeed,
                    dy: 0,
                    score: score
                });
            }
        }
        eliminatedAliens = 0;
    }

    // Increase alien speed by 10% every 30 seconds
    if (Date.now() - lastSpeedIncrease > 30000) {
        baseAlienSpeed *= 1.1;
        lastSpeedIncrease = Date.now();
    }
	// Update player
	player.x += player.dx;
	if (player.x < 0) player.x = 0;
	if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
	
	

    requestAnimationFrame(updateGame);
}

// Handle keyboard input
window.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') player.dx = player.speed;
    else if (e.key === 'ArrowLeft') player.dx = -player.speed;
	else if (e.key === ' ') bullets.push({ x: player.x + player.width / 2, y: player.y, width: 5, height: 15, dy: 10 });  // space bar to shoot
});

window.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') player.dx = 0;
});


function showGameOverScreen() {
    ctx.font = '50px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = '30px Arial';
    ctx.fillText(`Score: ${player.score}`, canvas.width / 2 - 60, canvas.height / 2 + 50);
    localStorage.setItem('score', player.score);
    setTimeout(function() {
        window.location.href = 'username.html';
    }, 5000);
}


// Add at the beginning of your script:
let shelters = [];
for (let i = 0; i < 5; i++) {
    shelters.push({x: i * canvas.width / 5, y: canvas.height - 200, width: 60, height: 10, holes: []});
}

// Add at the end of the updateGame function:
// Drop bombs from random aliens
if (Math.random() < 0.01 && aliens.length > 0) {
    let randomAlien = aliens[Math.floor(Math.random() * aliens.length)];
    bombs.push({ x: randomAlien.x, y: randomAlien.y, width: 10, height: 20, dy: 2 });
}

// Bomb collisions with shelters
bombs.forEach((bomb, i) => {
    shelters.forEach((shelter, j) => {
        if (bomb.x < shelter.x + shelter.width &&
            bomb.x + bomb.width > shelter.x &&
            bomb.y < shelter.y + shelter.height &&
            bomb.y + bomb.height > shelter.y) {
            // Add a hole to the shelter and remove the bomb
            shelters[j].holes.push({x: bomb.x - shelter.x, y: bomb.y - shelter.y, radius: 20});
            bombs.splice(i, 1);
        }
    });
});

// Draw shelters
shelters.forEach(shelter => {
    drawRectangle(shelter, 'grey');
    shelter.holes.forEach(hole => {
        ctx.beginPath();
        ctx.arc(shelter.x + hole.x, shelter.y + hole.y, hole.radius, 0, Math.PI*2, false);
        ctx.fillStyle = 'black';
        ctx.fill();
    });
});


// Start the game
updateGame();