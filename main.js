var game;
var sprites;
var sounds;
function setup() {
    createCanvas(960, 640);
    sprites = new Sprites();
    sounds = new Sounds();
    game = new Game();
}

function draw() {
    background(100, 100, 255);
    game.update();
}