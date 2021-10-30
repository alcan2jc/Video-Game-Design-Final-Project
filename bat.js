
class Bat {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

        this.yvel = 0;
        this.xvel = 0;

        this.anim_speed = 60 / 20; // frames per second
        this.anim_counter = 0;
    }

    getSprite() {
        if (!(frameCount % this.anim_speed)) {
            this.anim_counter++;
            this.anim_counter %= 12;
        } 

        return sprites.bat[this.anim_counter];
    }

    update() {
        // do collision later 
    }


    draw() {

        image(this.getSprite(), this.x, this.y, this.width, this.height);

        /*
        if (this.xvel < 0) {
            push();
            scale(-1, 1);
            image(this.getSprite(), -this.x - this.width, this.y, this.width, this.height); 
            pop();
          } else {
            image(this.getSprite(), this.x, this.y, this.width, this.height);
          }
          */
    }



}