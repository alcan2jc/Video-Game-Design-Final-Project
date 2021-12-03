 var MAX_SNOWFLAKE_SIZE = 10;
 var MIN_SNOWFLAKE_SIZE = 3;


 class Snow {

    constructor() {
        this.wind = 1;
        this.flakes = [];

        for (let i = 0; i < 100; i++) {
            let x = random() * width;
            let y = random() * height;
            let r = (random() * (MAX_SNOWFLAKE_SIZE - MIN_SNOWFLAKE_SIZE)) + MIN_SNOWFLAKE_SIZE; 

            this.flakes.push(new Snowflake(x, y, r, r));
        }
    }

    draw() {

        for (let i = 0; i < this.flakes.length; i++) {
            this.flakes[i].draw();
        }
    }
 }

var MAX_SNOWFLAKE_SPD = 2;
var MIN_SNOWFLAKE_SPD = 1;

 class Snowflake {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.yspd = (random() * (MAX_SNOWFLAKE_SPD - MIN_SNOWFLAKE_SPD)) + MIN_SNOWFLAKE_SPD;
    }

    draw() {
        this.y += this.yspd;

        if (this.y > height + 10) {
            this.y = -10;
        }

        fill(255);
        ellipse(this.x, this.y, this.r, this.r);
    }

 }