function withinBounds(x1, y1, x2, y2, width1, height1, width2, height2) {
    return (x1 + width1 > x2 &&
        x1 < x2 + width2 &&
        y1 + height1 > y2 &&
        y1 < y2 + height2);
}

class Cloud {
    constructor(x, y) {
        this.x = x; //xcoord
        this.y = y; //ycoord
    }

    draw() {
        fill(250)
        noStroke();
        ellipse(this.x, this.y, 70, 50); //left part
        ellipse(this.x + 10, this.y + 10, 70, 50); //top part
        ellipse(this.x - 20, this.y + 10, 70, 50); //right part

        //Reset cloud when it reaches the end. 
        if (this.x > 400 + 70) {
            this.x = -70;
        }
        this.x += 0.1;
    }


}

class Hill {
    constructor(x, y) {
        this.x = x; //xcoord
        this.y = y; //ycoord
        this.ridges = [];
    }

    draw() {
        fill(50, 205, 50);

        // Create mountain variables
        let ranges = 3;
        let intervals = width / 10;
        let rangeDiff = height / 2;
        let ruggedness = 0.0125;
        let a = random(1500);

        // Create mountain ranges
        for (let i = 0; i < ranges; ++i) {
            let ridge = [];
            for (let j = 0; j <= intervals; ++j) {
                var n = noise(a);
                ridge.push(map(n, 0, 1, height / 2, height - (i * rangeDiff - 200)));
                a += ruggedness;
            }
            this.ridges.push(ridge);
        }

        // Drawing mountains
        let blueScale = 10;
        let baseBlue = 50;
        let greenScale = 35;
        let baseGreen = 150;
        for (let i = 0; i < ranges; ++i) {
            for (let j = 0; j <= intervals; ++j) {
                // Color of each level
                fill(0, baseGreen - i * greenScale, baseBlue - i * blueScale);
                noStroke();

                // Drawing each quad that belongs to that mountain
                let w = width / intervals;
                quad(j * w, this.ridges[i][j] + i * rangeDiff,           // Top left
                    (j + 1) * w, this.ridges[i][j + 1] + i * rangeDiff,  // Top right
                    (j + 1) * w, height,                            // Bottom right
                    j * w, height);                                // Bottom left
            }
        }
    }
}

class mainMenu {
    constructor() {
        this.titlesize = 40;
        this.namesize = 20;
        this.sin = 0;
        this.clouds = [];
        this.clouds.push(new Cloud(width / 10, height / 10));
        this.clouds.push(new Cloud(width / 4, height / 4));
        this.clouds.push(new Cloud(width / 1.2, height / 10));
        this.hill = new Hill(width / 2, height / 1.1);
    }

    drawMainMenu() {

        //background
        image(sprites.background, 0, 0, width, height);

        //Clouds
        // for (let i = 0; i < this.clouds.length; i++) {
        //     let cloud = this.clouds[i];
        //     cloud.draw();
        // }

        //Hills
        this.hill.draw();

        //Title
        textAlign(CENTER, CENTER);
        push();
        textSize(this.titlesize);
        stroke(0);
        fill('yellow');
        text("The One Eyed Rogue", width / 2, height / 8);
        textSize(20);
        text("By Jonathan Borghese and John Alcantara", width / 2, height / 3.4);
        this.sin += 0.01;
        this.titlesize = abs(sin(this.sin)) * 10 + 50;
        this.namesize = abs(sin(this.sin)) * 10 + 30;
        pop();

        //Buttons
        let buttonTitles = ["PLAY", "HOW TO PLAY"];
        for (let i = 0; i < buttonTitles.length; i++) {
            let buttonX = width / 2.5;
            let buttonY = (height / 2) + 75 * i;
            let boxWidth = 120;
            let boxHeight = 50;
            if (withinBounds(mouseX, mouseY, buttonX, buttonY, 1, 1, boxWidth, boxHeight)) {
                fill('orange')
                rect(buttonX, buttonY, boxWidth, boxHeight);

                //If selected
                if (mouseIsPressed) {
                    if (i === 0) {
                        game.loadTilemap(intro_tilemap);
                        game.state = "game";
                    }
                    else if (i === 1)
                        game.state = "tutorial";
                }
            }

            textSize(15);
            textStyle(BOLD);
            fill(0);

            text(buttonTitles[i], buttonX + 60, buttonY + 25);

            for (let i = 0; i < game.blocks.length; i++) {
                game.blocks[i].draw();
            }

            //Player
            game.player.draw();
            game.player.vel.x = game.player.xspd;

            if (game.player.x >= width + game.player.width) {
                game.player.x = -game.player.width / 2;
                game.player.y = height - game.player.height - TILE_SIZE;
            }

            //player jumps
            if (game.player.x >= width / 2.5 && game.player.x < width / 2) {
                if (game.player.vel.y === 0) {
                    game.player.vel.y = game.player.jmp_spd;
                    game.player.jumps--;
                }
            }
            game.player.vel.y += game.player.yacc;

            let pos = game.player.playerCollision();
            game.player.x = pos[0];
            game.player.y = pos[1];

            /*
            game.player.draw();
            game.player.xvel = game.player.xspd;

            if (game.player.x >= width + game.player.width) {
                game.player.x = -game.player.width / 2;
                game.player.y = height - game.player.height - TILE_SIZE;
            }

            //player jumps
            if (game.player.x >= width / 2.5 && game.player.x < width / 2) {
                if (game.player.yvel === 0) {
                    game.player.yvel = game.player.jmp_spd;
                    game.player.jumps--;
                }
            }
            game.player.yvel += game.player.yacc;

            let pos = game.player.playerCollision();
            game.player.x = pos[0];
            game.player.y = pos[1];

            */

            //Slime
            game.slimes[0].draw();
            if (game.player.x >= width / 2) {
                game.slimes[0].jump_state = 2;
            }

            if (game.player.x <= width / 2) {
                game.slimes[0].jump_state = 0;
            }

            //bat
            for (let i = 0; i < game.bats.length; i++) {
                let bat = game.bats[i];
                bat.draw();
                bat.x--;

                if (bat.x < -bat.width) {
                    bat.x = width + bat.width;
                }
            }
        }
    }
}