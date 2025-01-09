function pellets(kindOfPellet) {
    var middle = { x: pacman.x + pacman.size / 2, y: pacman.y + pacman.size / 2};

    if (maze.MAP[Math.floor(middle.y / tileSize)][Math.floor(middle.x / tileSize)] === kindOfPellet) {
        maze.MAP[Math.floor(middle.y / tileSize)][Math.floor(middle.x / tileSize)] = maze.empty;
        
        // Soundeffekt abspielen
        eatPelletAudio.play();

        if (kindOfPellet === maze.pellet) {
            pelletsEaten++;
            score += 10;
        } else if (kindOfPellet === maze.powerPellet) {
            powerPelletsEaten++;
            score += 50;
        }
    }
}