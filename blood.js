
 var MAX_DROP_SIZE = 30;
 var MIN_DROP_SIZE = 10;


 class Blood {

    constructor(xstart, xend, ystart) {
        this.drops = [];

        for (let i = 0; i < 20; i++) {
            let x = random() * (xend - xstart) + xstart;
            let y = ystart;
            let r = (random() * (MAX_DROP_SIZE - MIN_DROP_SIZE)) + MIN_DROP_SIZE; 

            this.drops.push(new Blood_Drop(x, y, r, r * 1.5));
        }
    }

    draw() {

        for (let i = 0; i < this.drops.length; i++) {
            this.drops[i].draw();
        }
    }
 }

var MAX_DROP_SPD = 2;
var MIN_DROP_SPD = 1;

 class Blood_Drop {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.ix = x;
        this.iy = y;

        this.yspd = (random() * (MAX_DROP_SPD - MIN_DROP_SPD)) + MIN_DROP_SPD;
    }

    draw() {
        this.y += this.yspd;

        if (this.y > height + 10) {
            this.y = this.iy;
            this.x = this.ix;
        }

        image(sprites.blood_drop, this.x, this.y, this.w, this.h);
        //fill("#8A0303");
        //ellipse(this.x, this.y, this.r, this.r);
    }

 }