class Tutorial {
    constructor() {
        this.buttonWidth = 100;
        this.buttonHeight = 50;
    }

    drawButton(text, x, y) {
        if (withinBounds(mouseX, mouseY, x, y, 1, 1, this.buttonWidth, this.buttonHeight)) {
            fill('orange')
            rect(x, y, this.buttonWidth, this.buttonHeight);

            //If selected
            if (mouseIsPressed) {
                print(text + " pressed");
            }
            text(text, x + 60, y + 25);
        }
    }

    drawTutorial() {
        textSize(30);
        fill("yellow");
        text("HOW TO PLAY", width / 2.2, height / 8);

        this.drawButton("BACK", 50, 50);
    }
}