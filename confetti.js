

var MAX_SHARD_SIZE = 30;
var MIN_SHARD_SIZE = 10;


 class Confetti {

    constructor() {
        this.shards = [];

        for (let i = 0; i < 200; i++) {
            let x = random() * width;
            let y = random() * (height + 40) - 30;
            let w = (random() * (MAX_SHARD_SIZE - MIN_SHARD_SIZE)) + MIN_SHARD_SIZE; 
            let h = (random() * (MAX_SHARD_SIZE - MIN_SHARD_SIZE)) + MIN_SHARD_SIZE; 

            let r = random() * 255;
            let g = random() * 255;
            let b = random() * 255;

            let spd = random() * .3;

            this.shards.push(new Confetti_shard(x, y, w, h, color(r, g, b), spd, random() * 3));
        }
    }

    draw() {

        for (let i = 0; i < this.shards.length; i++) {
            this.shards[i].draw();
        }
    }
 }


 class Confetti_shard {
    constructor(x, y, w, h, color, angular_spd, yspd) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.ang_spd = angular_spd;
        this.angle = 0;
        this.acc = yspd;
        this.yspd = yspd;
    }

    draw() {
        this.acc += 0.1;
        this.y += this.acc;

        this.angle += this.ang_spd;

        if (this.y > height + 10) {
            this.y = -30;
            this.x = random() * width;
            this.acc = this.yspd;
        }

        fill(this.color);

        push();
        translate(this.x + this.w/2, this.y + this.h/2);
        rotate(this.angle);
        rect(-this.w/2, -this.h/2, this.w, this.h);
        pop();
    }

 }