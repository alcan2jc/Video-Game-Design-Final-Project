
var mm;
function setup() {
    createCanvas(800, 400);
    mm = new mainMenu();
}

function draw() {
    background(220);
    mm.drawMainMenu();
}