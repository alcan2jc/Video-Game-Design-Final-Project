function withinBounds(x1, y1, x2, y2, width1, height1, width2, height2) {
    return (x1 + width1 > x2 &&
        x1 < x2 + width2 &&
        y1 + height1 > y2 &&
        y1 < y2 + height2);
}

class mainMenu {
    constructor() {
        this.titlesize = 40;
        this.namesize = 20;
        this.sin = 0;
    }

    drawMainMenu() {
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
        }
    }
}