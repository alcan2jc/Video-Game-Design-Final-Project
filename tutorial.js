class Page {
    constructor(page) {
        this.page = page;
    }

    drawPage() {
        if (this.page === 0) {
            text("Press right arrow key to move right", width / 2, height / 4);
            text("Press left arrow key to move left", width / 2, height / 3.2);
            text("Press up arrow key to jump", width / 2, height / 2.7);
        } else if (this.page === 1) {
            text("Coming Soon 1", width / 2, height / 2);
        } else if (this.page === 2) {
            text("Coming Soon 2", width / 2, height / 2);
        } else if (this.page === 3) {
            text("Coming Soon 3", width / 2, height / 2);
        } else if (this.page === 4) {
            text("Coming Soon 4", width / 2, height / 2);
        }
    }
}

class Tutorial {
    constructor() {
        this.buttonWidth = 100;
        this.buttonHeight = 50;
        this.page = 0;
        this.pages = [];
        for (let i = 0; i < 5; i++) {
            this.pages.push(new Page(i));
        }
        this.pressedFlag = false;
        this.prevFrameCount = 0;
    }

    drawButton(label, x, y) {
        if (withinBounds(mouseX, mouseY, x, y, 1, 1, this.buttonWidth, this.buttonHeight)) {
            fill('orange')
            rect(x, y, this.buttonWidth, this.buttonHeight);
            
            if (mouseIsPressed && frameCount - this.prevFrameCount > 30) {
                this.prevFrameCount = frameCount;
                if (label === "BACK") {
                    if (this.page === 0) {
                        game.state = "main menu";
                    } else {
                        this.page--;
                    }
                } else {
                    this.page = (this.page < this.pages.length - 1) ? ++this.page : this.page;
                }
            }

        }

        textSize(15);
        fill(255);
        stroke(0);
        text(label, x + 50, y + 25);
    }

    drawTutorial() {
        image(sprites.background, 0, 0, width, height);

        textSize(30);
        fill("yellow");
        text("HOW TO PLAY", width / 2, height / 8);

        //Tutorial Content
        this.pages[this.page].drawPage();
        //Back and Next Buttons
        this.drawButton("BACK", width / 20, height / 1.3);
        this.drawButton("NEXT", width / 1.2, height / 1.3);
    }
}