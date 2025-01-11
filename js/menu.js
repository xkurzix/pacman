//MENU

//Loop
function menuLoop() {
    menuInterval = setInterval(function () {
        if (gameRunning && paused) {
            pauseMenu();
        } else if (!gameRunning) {
            startMenu();
        } else if (lives <= 0) {
            gameOverMenu();
        }


    }, 1000 / 60);
}


//Start-Menü
function startMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Titel
    ctx.font = "40px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("i:HTL Pacman", canvas.width / 2, canvas.height / 3);

    //Untertitel
    ctx.font = "20px Arial";
    ctx.fillText("by Simon Kurz", canvas.width / 2, (canvas.height / 3) + 40);

    //Button: Start
    startButton.draw();
}

//Pausen-Menü
function pauseMenu() {
    //hintergrund
    drawEverything();

    //box
    menuBox();

    //buttons zeichnen
    continueButton.draw();
    restartButton.draw();
    exitButton.draw();
    muteButton.draw();
}

//Game-Over-Menü 
function gameOverMenu() {
    //hintergrund
    drawEverything();

    //box
    menuBox();

    //Text
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, 325);

    //buttons zeichnen
    restartButton.draw();
    exitButton.draw();
    muteButton.draw();
}

function menuBox() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.roundRect(135, 245, 300, 225, 10);
    ctx.fill();
    ctx.strokeStyle = "#8fad90";
    ctx.lineWidth = 5;
    ctx.stroke();
}


//EVENTLISTENER

document.addEventListener("mousemove", function (event) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
});

document.addEventListener("click", function () {
    //Start Menü
    if (!gameRunning && startButton.mouseover()) {
        startGame();
    }
    //Pause Menü
    if (paused || lives<=0) {
        if (restartButton.mouseover() && lives>0) {
            gameRunning = 0;
            paused = 0;
            clearInterval(menuInterval);
            clearInterval(gameInterval);
            startGame();
        }
        if (continueButton.mouseover()) {
            paused = 0;
        }
        if (exitButton.mouseover()) {
            location.reload();
        }
        if (muteButton.mouseover()) {
            mute();
        }
    }
});

document.addEventListener("keydown", fKeyPress);
function fKeyPress(evt) {
    if (gameRunning && evt.key === "Escape") {
        if (paused) {
            paused = 0;
        } else {
            paused = 1;
            menuLoop();
        }
    }
}