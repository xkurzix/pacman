//ALLE CHARACTER

//Prüfen ob Character abbiegen kann
function characterIsAtIntersection(character) {
    cornersForAllDirections(character);
    if (isTileAccessible(character.nextDirection)) {
        character.direction = character.nextDirection;
    }
}

//Die Eckpunkte des nächsten Tiles in jede Richtung (vom Character aus) berechnen
function cornersForAllDirections(character) {
    directions[0].topLeft = { x: character.x, y: character.y - character.size };
    directions[0].topRight = { x: character.x + character.size, y: character.y - character.size };
    directions[0].bottomRight = { x: character.x + character.size, y: character.y };
    directions[0].bottomLeft = { x: character.x, y: character.y };

    directions[1].topLeft = { x: character.x, y: character.y + character.size };
    directions[1].topRight = { x: character.x + character.size, y: character.y + character.size };
    directions[1].bottomRight = { x: character.x + character.size, y: character.y + 2 * character.size };
    directions[1].bottomLeft = { x: character.x, y: character.y + 2 * character.size };

    directions[2].topLeft = { x: character.x - character.size, y: character.y };
    directions[2].topRight = { x: character.x, y: character.y };
    directions[2].bottomRight = { x: character.x, y: character.y + character.size };
    directions[2].bottomLeft = { x: character.x - character.size, y: character.y + character.size };

    directions[3].topLeft = { x: character.x + character.size, y: character.y };
    directions[3].topRight = { x: character.x + 2 * character.size, y: character.y };
    directions[3].bottomRight = { x: character.x + 2 * character.size, y: character.y + character.size };
    directions[3].bottomLeft = { x: character.x + character.size, y: character.y + character.size };
}

//Prüfen ob das nächste Tile das betreten werden soll keine Wall ist
function isTileAccessible(dir) {
    if (maze.MAP[Math.floor(directions[dir].topLeft.y / tileSize)][Math.floor(directions[dir].topLeft.x / tileSize)] !== maze.wall &&
        maze.MAP[Math.floor(directions[dir].topRight.y / tileSize)][Math.floor(directions[dir].topRight.x / tileSize)] !== maze.wall &&
        maze.MAP[Math.floor(directions[dir].bottomRight.y / tileSize)][Math.floor(directions[dir].bottomRight.x / tileSize)] !== maze.wall &&
        maze.MAP[Math.floor(directions[dir].bottomLeft.y / tileSize)][Math.floor(directions[dir].bottomLeft.x / tileSize)] !== maze.wall) {
        return 1;
    } else{
        return 0;
    }
}

//Movement für Geister
function ghostMovement(character) {
    let directionsPermissible = 0;

    cornersForAllDirections(character);
    
    for (let i = 0; i <= 3; i++) {
        if (isTileAccessible(i)) {
            directionsPermissible++;
        }
    }

    if (directionsPermissible >= 2) {
        character.nextDirection = getRandomInt(4);
    }
}



//Character bewegen
function moveCharacter(character) {
    var newX = character.x;
    var newY = character.y;

    switch (character.direction) {
        case 0:
            newY -= character.speed;
            break;
        case 1:
            newY += character.speed;
            break;
        case 2:
            newX -= character.speed;
            break;
        case 3:
            newX += character.speed;
            break;
        case 4:
            break;
        default:
            console.error(`Unbekannte Richtung: ${character.direction}`);
            return;
    }

    //4 Ecken von Pac-Man berechnen
    var topLeft = { x: newX, y: newY };
    var bottomRight = { x: newX + pacman.size, y: newY + character.size };

    //Kollision prüfen
    if (maze.MAP[Math.floor(topLeft.y / tileSize)][Math.floor(topLeft.x / tileSize)] !== maze.wall) var colTopLeft = 1;
    if (maze.MAP[Math.floor(bottomRight.y / tileSize)][Math.floor(bottomRight.x / tileSize)] !== maze.wall) var colBottomRight = 1;

    //Wrap around für rechten und linken Rand
    if ((newX + character.size) <= 0) {
        newX = 570;
    }
    else if (newX >= 570) {
        newX = 0;
    }

    if (colTopLeft && colBottomRight) {
        character.x = newX;
        character.y = newY;
    }
}


//Steuerung (mit Pfeiltasten und WASD)
document.addEventListener("keydown", fKeyPress);
function fKeyPress(evt) {
    switch (evt.key) {
        case "ArrowUp":
        case "w":
            pacman.nextDirection = 0;
            break;
        case "ArrowDown":
        case "s":
            pacman.nextDirection = 1;
            break;
        case "ArrowLeft":
        case "a":
            pacman.nextDirection = 2;
            break;
        case "ArrowRight":
        case "d":
            pacman.nextDirection = 3;
            break;
    }
}


//Prüfen ob die Mitte von Pacman einen Geist berührt
function ghostPacmanCol() {
    //Array mit allen Geistern
    const ghosts = [blinky, pinky, inky, clyde];

    for (var i = 0; i <= 3; i++) {
        isTouching(ghosts[i]);

        if (pacmanGhostCol) {
            //frightened = false
            if (ghosts[i].frightened === 0) {
                death();
            }
            //frightened = true
            else {

            }
        }
    }
}

function isTouching(ghost) {
    //Mitte von Pacman berechnen
    var middle = { x: pacman.x + pacman.size / 2, y: pacman.y + pacman.size / 2 }

    //Prüfen ob eine Kollision stattfindet
    if (middle.x >= ghost.x && middle.x <= ghost.x + ghost.size && middle.y >= ghost.y && middle.y <= ghost.y + ghost.size) {
        pacmanGhostCol = 1;
    }
    else {
        pacmanGhostCol = 0;
    }
}

//Tod von Pacman
async function death() {
    pacman.direction = 4;
    pacman.nextDirection = 4;
    deathAudio.play();
    await sleep(3000);

    pacman.lives--;
    resetCharacters();
}


//Alle Character resetten
function resetCharacters() {
    //Pacman
    pacman.x = 270;
    pacman.y = 360;
    pacman.direction = 0;
    pacman.nextdirection = 0;

    //Geister
    //blinky
    blinky.x = 270;
    blinky.y = 240;
    blinky.direction = 0;
    blinky.nextDirection = 0;
    //pinky
    pinky.x = 270;
    pinky.y = 240;
    pinky.direction = 1;
    pinky.nextDirection = 1;
    //inky
    inky.x = 270;
    inky.y = 240;
    inky.direction = 1;
    inky.nextDirection = 1;
    //clyde
    clyde.x = 270;
    clyde.y = 240;
    clyde.direction = 1;
    clyde.nextDirection = 1;
}