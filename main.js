var game;
var sprites;
function setup() {
    createCanvas(960, 640);
    sprites = new Sprites();
    game = new Game();
}

function draw() {
    background(100, 100, 255);
    game.update();
}