function withinBounds(x1, y1, x2, y2, width1, height1, width2, height2) {
    return (x1 + width1 > x2 &&
        x1 < x2 + width2 &&
        y1 + height1 > y2 &&
        y1 < y2 + height2);
}

class mainMenu {
    constructor() {
        this.size = 40;
        this.sin = 0;
    }

    drawMainMenu() {
        //Title
        textAlign(CENTER, CENTER);
        push();
        textSize(this.size);
        stroke(255);
        fill('yellow');
        text("The Rogue Swordsman", width / 2, height / 8);
        this.sin += 0.01;
        this.size = abs(sin(this.sin)) * 10 + 50;
        pop();

        //Buttons
        let buttonTitles = ["PLAY", "HOW TO PLAY", "EXIT"];
        for (let i = 0; i < buttonTitles.length; i++) {
            let boxWidth = 120;
            let boxHeight = 50;
            if (withinBounds(mouseX, mouseY, width / 2.5, (height / 4) + 75 * i, 1, 1, boxWidth, boxHeight)) {
                fill('orange')
                rect(width / 2.5, (height / 4) + 75 * i, boxWidth, boxHeight);
            }

            textSize(15);
            fill(255);
            text(buttonTitles[i], width / 2.3 + 30, height / 4 + 25 + 75 * i);
        }
    }
}

var mm;
function setup() {
    createCanvas(800, 400);
    mm = new mainMenu();
}

function draw() {
    background(0);
    mm.drawMainMenu();
}