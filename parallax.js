var MOUTNAIN_WIDTH = 900;

class Parallax {

    constructor () {}

    setup_background(level_width) {
        this.mnts = new background_mountain(0, 0, 0, level_width);
    }

    draw() {
        this.mnts.draw();
    }
}

class background_mountain {
    constructor(x, y, xmin, xmax) {
        this.mountains = [];

        let xcurr = xmin;
        while (xcurr + MOUTNAIN_WIDTH < xmax) {
            this.mountains.push(new background_image(xcurr, 0, MOUTNAIN_WIDTH, height, sprites.background, 0.2));
            xcurr += MOUTNAIN_WIDTH;
        }
    }

    draw() {
        for (let i = 0; i < this.mountains.length; i++) {
            this.mountains[i].draw();
        }
    }
}

class background_image {
    constructor(x, y, w, h, sprite, speed) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.sprite = sprite;
        this.spd = speed;
    }

    draw() {
        if (!game.camera_still)
            this.x -= game.player.vel.x * this.spd;
        image(this.sprite, this.x, this.y, this.w, this.h);
    }
}