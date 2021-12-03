
var MOUTNAIN_WIDTH = 900;
var TREE_WIDTH = 600;
var TREE_HEIGHT = 500;

var CLOUD_WIDTH = 1000;
var CLOUD_HEIGHT =  200;

// parallax effect for background motion
class Parallax {

    constructor () {}

    // setup background for each level
    // level_width, total lenght of the level in pixels
    setup_background(level_width) {
        this.mnts = new background_layer(0, 0, level_width, MOUTNAIN_WIDTH, height, sprites.background, 0.2);
        this.trees = new background_layer(200, -500, level_width, TREE_WIDTH, TREE_HEIGHT, sprites.trees, 0.3);
        this.clouds = new background_layer(0, -1000, level_width, CLOUD_WIDTH, CLOUD_HEIGHT, sprites.clouds, .4);
    }

    // updates the position of background images
    update() {
        this.mnts.update();
        this.trees.update();
        this.clouds.update();
    }

    // draws background images to canvsa
    draw() {
        this.update();
        this.mnts.draw();
        this.trees.draw();
        this.clouds.draw();
    }
}

// class for background categories
class background_layer {
    // xmin: minimum x position
    // xmax: maximum x position in world
    // y: y offset
    constructor(y, xmin, xmax, img_width, img_height, sprite, speed) {
        this.imgs = [];

        let xcurr = xmin - img_width/2;
        while (xcurr + img_width < xmax) {
            this.imgs.push(new background_image(xcurr, y, img_width, img_height, sprite, speed));
            xcurr += img_width;
        }
    }

    // updates image positions
     update() {
        for (let i = 0; i < this.imgs.length; i++) {
            this.imgs[i].update();
        }
    }

    // draws images to canvas
    draw() {
        for (let i = 0; i < this.imgs.length; i++) {
            this.imgs[i].draw();
        }
    }

}

// generic container background image class
class background_image {

    // x position
    // y position
    // width of image
    // height of image
    // image sprite
    // speed at which image moves relative to player movemnet
    constructor(x, y, w, h, sprite, speed) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.sprite = sprite;
        this.spd = speed;
    }

    // updates image position relative to player
    update() {
        if (!game.camera_still)
            this.x -= game.player.vel.x * this.spd;
    }

    // draws image to canvas
    draw() {
        image(this.sprite, this.x, this.y, this.w, this.h);
    }
}