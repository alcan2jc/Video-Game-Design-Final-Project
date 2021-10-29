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
        text("The Rogue Swordsman", width / 2, height / 8);
        this.sin += 0.01;
        this.size = abs(sin(this.sin)) * 10 + 50;
        pop();

        //Buttons
        let buttonTitles = ["PLAY", "HOW TO PLAY", "EXIT"];
        for (let i = 0; i < buttonTitles.length; i++) {
            rect(width / 2.5, (height / 4) + 75 * i, 120, 50);
            textSize(15);
            text(buttonTitles[i], width / 2.3 + 30, height / 4 + 25 + 75 * i);
        }
    }
}