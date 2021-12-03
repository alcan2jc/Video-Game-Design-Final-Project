var MOUTNAIN_WIDTH = 900;

// parallax effect for background motion
class Parallax {

    constructor () {}

    // setup background for each level
    // level_width, total lenght of the level in pixels
    setup_background(level_width) {
        this.mnts = new background_mountain(0, 0, level_width);
        this.trees = new background_tree(200, -500, level_width);
    }

    // updates the position of background images
    update() {
        this.mnts.update();
        this.trees.update();
    }

    // draws background images to canvsa
    draw() {
        this.update();
        this.mnts.draw();
        this.trees.draw();
    }
}

// class for mountain background
class background_mountain {
    // x min: minimum x position in game world
    // x max: maximum x position in game worls
    constructor(y, xmin, xmax) {
        this.mountains = [];

        let xcurr = xmin - MOUTNAIN_WIDTH/2;
        while (xcurr + MOUTNAIN_WIDTH < xmax) {
            this.mountains.push(new background_image(xcurr, y, MOUTNAIN_WIDTH, height, sprites.background, 0.2));
            xcurr += MOUTNAIN_WIDTH;
        }
    }

    // updates image positions
    update() {
        for (let i = 0; i < this.mountains.length; i++) {
            this.mountains[i].update();
        }
    }

    // draws images to canvas
    draw() {
        for (let i = 0; i < this.mountains.length; i++) {
            this.mountains[i].draw();
        }
    }
}

var TREE_WIDTH = 600;
var TREE_HEIGHT = 500;

// class for background trees
class background_tree {
    // x min: minimum x position
    // x max: maximum x position
    constructor(y, xmin, xmax) {
        this.trees = [];
        print('start');

        let xcurr = xmin - TREE_WIDTH/2;
        while(xcurr + TREE_WIDTH < xmax) {
            print(xcurr);
            this.trees.push(new background_image(xcurr, y, TREE_WIDTH, TREE_HEIGHT, sprites.trees, 0.3));
            xcurr += TREE_WIDTH;
        }
    }

    update() {
        for (let i = 0; i < this.trees.length; i++) {
            this.trees[i].update();
        }
    }

    draw() {
        for (let i = 0; i < this.trees.length; i++) {
            this.trees[i].draw();
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