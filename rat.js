class Rat {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

        // constants
        this.jumps = 0;
        this.max_jumps = 1;
        this.jmp_spd = -7.5;
        this.xspd = 2;

        //moving variable. 0 = idle, 1 = left, 2 = right. 
        this.move = 0;

        //life
        this.dead = 0;

        this.vel = new p5.Vector(0, 0);
        this.acc = new p5.Vector(0, 0);

        // 0: idle 1: running 2: airborn
        this.animation_state = 1;
        this.anim_counter = 0;
        this.anim_speed = 60 / 10; // frames per second
    }

    playerCollision() {
        let newx = this.x + this.vel.x

        // wall collision
        //x
        for (let i = 0; i < game.blocks.length; i++) {
            let block = game.blocks[i];

            let d = abs(this.x - block.x) + abs(this.y - block.y);

            if (d < 50) {

                if (
                    newx + this.width > block.x &&
                    newx < block.x + block.width &&
                    this.y + this.height > block.y &&
                    this.y < block.y + block.height) {

                    newx = this.x;
                    break;
                }
            }
        }

        // y
        let newy = this.y + this.vel.y;

        for (let i = 0; i < game.blocks.length; i++) {
            let block = game.blocks[i];

            let d = abs(this.x - block.x) + abs(this.y - block.y);

            if (d < 50) {
                if (
                    newx + this.width > block.x &&
                    newx < block.x + block.width &&
                    newy + this.height > block.y &&
                    newy < block.y + block.height) {

                    if (this.vel.y > 0) {
                        this.jumps = this.max_jumps;
                    }

                    this.vel.y = 0;
                    newy = this.y;
                    break;
                }
            }
        }
        return [newx, newy];
    }

    getSprite() {
        switch (this.animation_state) {
            // idle
            case 0: return sprites.rat_idle;
            // running
            case 1: {
                if (!(frameCount % this.anim_speed)) {
                    this.anim_counter++;
                    this.anim_counter %= 4;
                }
                return sprites.rat_run[this.anim_counter];
            }
            case 2: return sprites.rat_hurt;

            case 3: {
                if (!(frameCount % this.anim_speed)) {
                    this.anim_counter++;
                    this.anim_counter %= 4;
                }
                return sprites.rat_dead[this.anim_counter];
            }

            default:
                print('Invalide animation State')
        }

        return null;
    }

    update() {
        this.vel.x = 0;
        if (this.move === 1) { //1 = left
            this.vel.x = -this.xspd;
        }
        else if (this.move === 2) { //2 = right
            this.vel.x = this.xspd;
        }

        let newpos = this.playerCollision();

        if (this.vel.x == 0) {
            this.animation_state = 0;
        } else {
            this.animation_state = 1;
        }

        this.x = newpos[0];
        this.y = newpos[1];
    }

    draw() {
        if (this.vel.x < 0) {
            push();
            scale(-1, 1);
            image(this.getSprite(), -this.x - this.width, this.y, this.width, this.height);
            pop();
        } else {
            image(this.getSprite(), this.x, this.y, this.width, this.height);
        }
    }
}