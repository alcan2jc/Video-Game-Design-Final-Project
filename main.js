
var mm;
var player;
var sprites;
function setup() {
    createCanvas(800, 400);
    sprites = new Sprites();
    player = new Player(width/2, height/2, 30, 30);
}

function draw() {
    background(220);
    player.draw();
}