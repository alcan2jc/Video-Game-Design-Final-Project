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
    }
}

class Hill {
    constructor(x, y) {
        this.x = x; //xcoord
        this.y = y; //ycoord
    }

    draw() {
        fill(50,205,50);
        rect(this.x, this.y, 1, 50);
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
        this.hill = new Hill(width / 2, height  / 1.1);
    }

    drawMainMenu() {
        //Clouds
        for (let i = 0; i < this.clouds.length; i++) {
            let cloud = this.clouds[i];
            cloud.draw();
        }

        //Hills
        this.hill.draw();
        //Title
        textAlign(CENTER, CENTER);
        push();
        textSize(this.titlesize);
        stroke(0);
        fill('yellow');
        text("The Rogue Swordsman", width / 2, height / 8);
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
            let buttonY = (height / 2.5) + 75 * i;
            let boxWidth = 120;
            let boxHeight = 50;
            if (withinBounds(mouseX, mouseY, buttonX, buttonY, 1, 1, boxWidth, boxHeight)) {
                fill('orange')
                rect(buttonX, buttonY, boxWidth, boxHeight);

                //If selected
                if (mouseIsPressed) {
                    if (i === 0)
                        game.state = "game";
                    else if (i === 1)
                        game.state = "tutorial";
                }
            }

            textSize(15);
            fill(255);

            text(buttonTitles[i], buttonX + 60, buttonY + 25);

            for (let i = 0; i < game.blocks.length; i++) {
                game.blocks[i].draw();
            }

            //Player
            game.player.draw();
            game.player.x += game.player.xspd;

            if (game.player.x >= width + game.player.width) {
                game.player.x = -game.player.width;
            }
        }
    }
}