var game;
function setup() {
    createCanvas(960, 640);
    game = new Game();
}

function draw() {
    background(0);
    if (game.state === "main menu")
        game.mainMenu.drawMainMenu();
    // else if (game.state === "game") 
    else if (game.state === "tutorial")
        game.tutorial.drawTutorial();
}