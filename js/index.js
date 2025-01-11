//VARIABLEN

//Spieldaten
var score = 0;
var lvl = 1;
var lives = 3;
var pelletsEaten = 0;
var powerPelletsEaten = 0;
var pacmanGhostCol = 0;

var gameRunning = 0;
var paused = 0;
var isMuted = 0;

var mouseX = 0;
var mouseY = 0;

var gameInterval;
var menuInterval;

//MAZE
var canvas = document.getElementById("pacman");
var ctx = canvas.getContext("2d");
const tileSize = 30;

//BUTTONS
class Button {
    constructor(x, y, width, height, text, font, defaultColor, mouseOverColor, mouseIsOver, radius, textX, textY) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.font = font;
        this.textX = textX;
        this.textY = textY;
        this.defaultColor = defaultColor;
        this.mouseOverColor = mouseOverColor;
        this.mouseIsOver = mouseIsOver;
        this.radius = radius;
        this.mouseOverWidth = width + 4;
        this.mouseOverHeight = height + 4;
    }

    mouseover() {
        return mouseX >= this.x && mouseX <= this.x + this.width &&
            mouseY >= this.y && mouseY <= this.y + this.height;
    }

    draw() {
        ctx.beginPath();
        if (this.mouseover()) {
            ctx.fillStyle = this.mouseOverColor;
            ctx.roundRect(this.x - 2, this.y - 2, this.mouseOverWidth, this.mouseOverHeight, this.radius);
        } else {
            ctx.fillStyle = this.defaultColor;
            ctx.roundRect(this.x, this.y, this.width, this.height, this.radius);
        }
        //ctx.stroke();
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = this.font;
        ctx.fillText(this.text, this.x + this.textX, this.y + this.textY);
    }
}

//die Buttons mit Hilfe der Klassen definieren
var startButton = new Button(195, 310, 180, 50, "►", "30px Arial", "#808080", "#8fad90", 0, 10, 94, 36);
var restartButton = new Button(255, 385, 60, 60, "⟳", "30px Arial", "#808080", "#8fad90", 0, 10, 32, 40);
var exitButton = new Button(345, 385, 60, 60, "🏡", "30px Arial", "#808080", "#8fad90", 0, 10, 30, 38);
var muteButton = new Button(165, 385, 60, 60, "🔊", "30px Arial", "#808080", "#8fad90", 0, 10, 30, 41);
var continueButton = new Button(240, 270, 90, 90, "►", "40px Arial", "#808080", "#8fad90", 0, 10, 49, 59);


//PACMAN
class Character {
    constructor(imgSrc, x, y, size, speed, direction, nextDirection, lives) {
        this.img = new Image();
        this.img.src = imgSrc;
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.direction = direction;
        this.nextDirection = nextDirection;
        this.lives = lives;
    }

    //Character zeichnen
    draw() {
        var rotationAngle = 0;
        if (this.direction === 0) rotationAngle = -Math.PI / 2;
        if (this.direction === 1) rotationAngle = Math.PI / 2;
        if (this.direction === 2) rotationAngle = Math.PI;

        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(rotationAngle);
        ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size)
        ctx.restore();
    }
}

//pacman mit Hilfe von Klasse definieren
var pacman = new Character("./img/pacman_green.png", 270, 360, 29, 5, 0, 0, 3);

//GHOSTS
class Ghost {
    constructor(imgUpSrc, imgDownSrc, imgLeftSrc, imgRightSrc, x, y, size, speed, direction, nextDirection, frightened) {
        this.imgUp = new Image();
        this.imgUp.src = imgUpSrc;
        this.imgDown = new Image();
        this.imgDown.src = imgDownSrc;
        this.imgLeft = new Image();
        this.imgLeft.src = imgLeftSrc;
        this.imgRight = new Image();
        this.imgRight.src = imgRightSrc;
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.direction = direction;
        this.nextDirection = nextDirection;
        this.frightened = frightened;
    }

    //Geister zecihnen
    draw() {
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);

        if (this.direction === 0) {
            ctx.drawImage(this.imgUp, -this.size / 2, -this.size / 2, this.size, this.size);
        }
        else if (this.direction === 1) {
            ctx.drawImage(this.imgDown, -this.size / 2, -this.size / 2, this.size, this.size)
        }
        else if (this.direction === 2) {
            ctx.drawImage(this.imgLeft, -this.size / 2, -this.size / 2, this.size, this.size)
        }
        else if (this.direction === 3) {
            ctx.drawImage(this.imgRight, -this.size / 2, -this.size / 2, this.size, this.size)
        }

        ctx.restore();
    }
}

//Alle 4 Geister mit Hilfe der Klassen definieren
var blinky = new Ghost("./img/blinky/up.png", "./img/blinky/down.png", "./img/blinky/left.png", "./img/blinky/right.png", 270, 240, 29, 4, 0, 0, 0);
var pinky = new Ghost("./img/pinky/up.png", "./img/pinky/down.png", "./img/pinky/left.png", "./img/pinky/right.png", 270, 240, 29, 4, 0, 0, 0);
var inky = new Ghost("./img/inky/up.png", "./img/inky/down.png", "./img/inky/left.png", "./img/inky/right.png", 270, 240, 29, 4, 0, 0, 0);
var clyde = new Ghost("./img/clyde/up.png", "./img/clyde/down.png", "./img/clyde/left.png", "./img/clyde/right.png", 270, 240, 29, 4, 0, 0, 0);


//Variablen für funktion cornersForAllDirections()
//-> wird für bewegungseingrenzung verwendet
var directions = {
    0: {
        topLeft: {},
        topRight: {},
        bottomRight: {},
        bottomLeft: {}
    },
    1: {
        topLeft: {},
        topRight: {},
        bottomRight: {},
        bottomLeft: {}
    },
    2: {
        topLeft: {},
        topRight: {},
        bottomRight: {},
        bottomLeft: {}
    },
    3: {
        topLeft: {},
        topRight: {},
        bottomRight: {},
        bottomLeft: {}
    }
};


//AUDIOS

//Audio: Start
var startAudio = new Audio("./audio/start.wav");
startAudio.volume = 1.0;

//Audio: Pellets essen
var eatPelletAudio = new Audio("./audio/eat_dot_0.wav");
eatPelletAudio.volume = 0.5;
eatPelletAudio.loop = false;

//Audio: Geister essen
var eatGhostAudio = new Audio("./audio/eat_ghost.wav");
eatGhostAudio.volume = 1.0;

//Audio: Tod
var deathAudio = new Audio("./audio/death_0.wav");
deathAudio.volume = 1.0;

//Audio: Menü
var menuAudio = new Audio("./audio/intermission.wav");
menuAudio.volume = 1.0;



//Spiel-Ablauf

function sequence() {
    gameInterval = setInterval(function () {
        if (!paused) {
            //canvas löschen
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //maze 
            drawMap();

            //pellets
            pellets(maze.pellet);
            pellets(maze.powerPellet);

            //blinky
            blinky.draw();
            ghostMovement(blinky);
            characterIsAtIntersection(blinky);
            moveCharacter(blinky);

            //pinky
            pinky.draw();
            ghostMovement(pinky);
            characterIsAtIntersection(pinky);
            moveCharacter(pinky);

            //inky
            inky.draw();
            ghostMovement(inky);
            characterIsAtIntersection(inky);
            moveCharacter(inky);

            //clyde
            clyde.draw();
            ghostMovement(clyde);
            characterIsAtIntersection(clyde);
            moveCharacter(clyde);

            //pacman
            pacman.draw();
            characterIsAtIntersection(pacman);
            moveCharacter(pacman);


            //Anzeigen
            drawScore();
            drawLvl();
            drawLives();

            //logic
            levelUp();
            ghostPacmanCol();
        }

        
    }, 1000 / 30);
}


function levelUp() {
    if (pelletsEaten >= 166 && powerPelletsEaten >= 4) {
        pelletsEaten = 0;
        powerPelletsEaten = 0;
        lvl++;

        //Karte zurücksetzen
        resetMaze();
        resetCharacters();
    }
}


//Punkteanzeige
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillstyle = "white";
    ctx.textAlign = "right";
    ctx.fillText("Punkte: " + score, 555, 675);
}

//Level
function drawLvl() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText("Level: " + lvl, 15, 675);
}

//Leben verbleibend
function drawLives() {
    var pacmanImg = document.getElementById("pacmanGreen");

    var livesPos = {
        X: 230,
        Y: 653,
    };

    for (let i = 0; i < pacman.lives; i++) {
        ctx.drawImage(pacmanImg, livesPos.X, livesPos.Y, pacman.size, pacman.size);
        livesPos.X += 40;
    }
}

//Pause Funktion
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

//Random 0-n
function getRandomInt(n) {
    return Math.floor(Math.random() * n);
}


async function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameRunning = 1;

    //alles zurücksetzen
    resetCharacters();
    resetGameData();
    resetMaze();
    drawEverything();

    //Audio
    startAudio.play();
    await sleep(4300);

    //Ablauf starten
    sequence();
}

function resetGameData() {
    score = 0;
    lvl = 1;
    pelletsEaten = 0;
    powerPelletsEaten = 0;
    pacman.lives = 3;
}

function drawEverything() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    pacman.draw();
    blinky.draw();
    pinky.draw();
    inky.draw();
    clyde.draw();
    drawLives();
    drawLvl();
    drawScore();
}

function mute() {
    startAudio.muted = !isMuted;
    eatGhostAudio.muted = !isMuted;
    eatPelletAudio.muted = !isMuted;
    deathAudio.muted = !isMuted;
    menuAudio.muted = !isMuted;
    isMuted = !isMuted;
    if (isMuted) {
        muteButton.text = "🔇";
    } else {
        muteButton.text = "🔊";
    }
}

menuLoop();
