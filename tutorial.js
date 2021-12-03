//A tutorial page
class Page {
    constructor(page) {
        this.page = page;
        this.played = false;
        this.vid;
    }

    //Draws the pages based on the current page. 
    drawPage() {
        if (this.page === 0) {
            if (!this.played) {
                this.vid = createVideo('vid/movement.mp4');
                this.vid.hide();
                this.vid.autoplay();
                this.vid.loop();
                this.vid.volume(0);
                this.played = true;
            }
            image(this.vid, 0, 0, width, height);
            textStyle(BOLD);
            text("Movement", width / 2, height / 4.1);
            textStyle(NORMAL);
            text("Press D to move right", width / 2, height / 3.2);
            text("Press A to move left", width / 2, height / 2.6);
            text("Press W to jump", width / 2, height / 2.15);
            
        } else if (this.page === 1) {
            if (!this.played) {
                this.vid = createVideo('vid/swing.mp4');
                this.vid.hide();
                this.vid.autoplay();
                this.vid.loop();
                this.vid.volume(0);
                this.played = true;
            }
            image(this.vid, 0, 0, width, height);
            text("Press MB1 to swing sword", width / 2, height / 4.1);
        } else if (this.page === 2) {
            if (!this.played) {
                this.vid = createVideo('vid/wall_jump.mp4');
                this.vid.hide();
                this.vid.autoplay();
                this.vid.loop();
                this.vid.volume(0);
                this.played = true;
            }
            image(this.vid, 0, 0, width, height);
            text("Jump (W) towards a wall and jump again while touching the wall", width / 2, height / 4.1);
            text("to perform a wall jump", width / 2, height / 3.3);
        } else if (this.page === 3) {
            if (!this.played) {
                this.vid = createVideo('vid/dash.mp4');
                this.vid.hide();
                this.vid.autoplay();
                this.vid.loop();
                this.vid.volume(0);
                this.played = true;
            }
            image(this.vid, 0, 0, width, height);
            text("Press shift to dash", width / 2, height / 4.1);
        } else if (this.page === 4) {
            if (!this.played) {
                this.vid = createVideo('vid/swing.mp4');
                this.vid.hide();
                this.vid.autoplay();
                this.vid.loop();
                this.vid.volume(0);
                this.played = true;
            }
            image(this.vid, 0, 0, width, height);
            text("Kill enemies by hitting them with your sword enough times", width / 2, height / 4.1);
        } else if (this.page === 5) {
            if (!this.played) {
                this.vid = createVideo('vid/hurt.mp4');
                this.vid.hide();
                this.vid.autoplay();
                this.vid.loop();
                this.vid.volume(0);
                this.played = true;
            }
            image(this.vid, 0, 0, width, height);
            text("Touching enemies will make you lose health.", width / 2, height / 4.1);
            text("Your health bar is at the top left", width / 2, height / 3.3);
        }
    }
}

//Tutorial class. Contains buttons, pages, and logic for pressing buttons. 
class Tutorial {
    constructor() {
        this.buttonWidth = 100;
        this.buttonHeight = 50;
        this.page = 0;
        this.pages = [];
        for (let i = 0; i < 6; i++) {
            this.pages.push(new Page(i));
        }
        this.pressedFlag = false;
        this.prevFrameCount = 0;
    }

    //draws buttons. 
    drawButton(label, x, y) {
        if (withinBounds(mouseX, mouseY, x, y, 1, 1, this.buttonWidth, this.buttonHeight)) {
            fill('orange')
            rect(x, y, this.buttonWidth, this.buttonHeight);

            if (mouseIsPressed && frameCount - this.prevFrameCount > 30) {
                this.prevFrameCount = frameCount;
                // this.pages[this.page].played = false;
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

    //Draws the background, text, and buttons. 
    drawTutorial() {
        // image(sprites.background, 0, 0, width, height);

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