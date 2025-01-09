//MENU

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
    hoverColor(startButton);
    drawButton(startButton);
}


//Pausen-Menü
function pauseMenu() {
    hoverColor(restartButton);
    drawButton(restartButton);
    hoverColor(exitButton);
    drawButton(exitButton);
    hoverColor(continueButton);
    drawButton(continueButton);
}





//BUTTONS

function hoverColor(button) {
    if (button.isHovered) {
        ctx.fillStyle = button.hoverColor;
    } else {
        ctx.fillStyle = button.defaultColor;
    }
}

function drawButton(button) {
    ctx.beginPath();
    ctx.roundRect(button.x, button.y, button.width, button.height, button.radius);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = button.font;
    ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2 + 7);
}

document.addEventListener("mousemove", function (event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    startButton.isHovered = isMouseOverButton(mouseX, mouseY, startButton);
    restartButton.isHovered = isMouseOverButton(mouseX, mouseY, restartButton);
    continueButton.isHovered = isMouseOverButton(mouseX, mouseY, continueButton);
    exitButton.isHovered = isMouseOverButton(mouseX, mouseY, continueButton);
    if (gameRunning && inMenu) { 
        pauseMenu();
    } else if (!gameRunning) {
        startMenu();
    }
});

document.addEventListener("click", function (event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    //Start Button
    if (!gameRunning && isMouseOverButton(mouseX, mouseY, startButton)) {
        startGame();
    }
    //Restart Button
    if (gameRunning && inMenu && isMouseOverButton(mouseX, mouseY, restartButton)) {
        inMenu = 0;
        newGame = 1;
        startGame();
    }
});

document.addEventListener("keydown", fKeyPress);
function fKeyPress(evt) {
    if (gameRunning && evt.key === "Escape") {
        if (inMenu) {
            inMenu = 0;
        } else {
            inMenu = 1;
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            pauseMenu();
        }
    }
}

function isMouseOverButton(mouseX, mouseY, button) {
    return mouseX >= button.x && mouseX <= button.x + button.width &&
        mouseY >= button.y && mouseY <= button.y + button.height;
}