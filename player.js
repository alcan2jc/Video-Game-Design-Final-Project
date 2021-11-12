
class Player {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

        // constants
        this.jumps = 0;
        this.max_jumps = 1;
        this.jmp_spd = -7.5;
        this.xspd = 3;
        this.yacc = .3;

        //sword variables
        this.swordHeight = 100;
        this.swordWidth = 100;
        this.offsetX = -20;
        this.offsetY = 40;
        this.swordCooldown = 1; //1 second
        this.swordFrameCount = 0;
        this.swinging = false;
        this.lastDir = 'right';

        this.vel = new p5.Vector(0, 0);
        this.acc = new p5.Vector(0, 0);

        // 0: idle 
        // 1: running 
        // 2: airborn
        // 3: slash
        this.animation_state = 1;
        this.anim_counter = 0;
        this.anim_speed = 60 / 10; // frames per second
        this.anim_speed_sword = 60 / 10; // frames per second

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
            case 0: return sprites.player_idle;
            // running
            case 1: {
                if (!(frameCount % this.anim_speed)) {
                    this.anim_counter++;
                    this.anim_counter %= 3;
                }
                return sprites.player_run[this.anim_counter];
            }
            case 2: return sprites.player_airborn;

            default:
                print('Invalide animation State')
        }

        return null;
    }

    getSwordSprite() {
        if (!(frameCount % this.anim_speed_sword)) {
            this.anim_counter++;
            this.anim_counter %= 3;
            print(this.anim_counter);
            if (this.anim_counter === 0)
                this.swinging = false;
        }
        return sprites.sword[this.anim_counter];
    }

    update() {
        this.vel.x = 0;

        // controls
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { //left
            this.vel.x = -this.xspd;
            this.lastDir = 'left';
        }
        else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { //right
            this.vel.x = this.xspd;
            this.lastDir = 'right';
        }

        if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && this.jumps > 0 && this.vel.y == 0) { //jump
            this.vel.y = this.jmp_spd;
            this.jumps--;
        } else {
            this.vel.y += this.yacc;
        }


        //slashing
        if (this.swinging) {
            this.drawSword();
        } else {
            this.anim_counter = 0;
        }

        if (mouseIsPressed) {
            if (mouseButton === LEFT && (frameCount - this.swordFrameCount) > 60 * this.swordCooldown) {
                this.swordFrameCount = frameCount;
                this.swinging = true;
            }
        }
        let newpos = this.playerCollision();

        if (this.vel.x == 0) {
            this.animation_state = 0;
        } else if (this.vel.y != 0) {
            this.animation_state = 2;
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

    drawSword() {
        //slashing
        if (this.lastDir === 'left') {
            push();
            noFill();
            stroke('red');
            scale(-1, 1);

            ellipse(-(this.x - this.offsetX) - this.width + 70, this.y + 10, this.swordWidth * 0.9, this.swordHeight/5);
            image(this.getSwordSprite(), -(this.x - this.offsetX) - this.width, this.y - this.offsetY, this.swordWidth, this.swordHeight);
            pop();
        } else {
            noFill();
            stroke('red');
            ellipse(this.x - this.offsetX + 35, this.y + 10, this.swordWidth * 0.9, this.swordHeight/5);
            image(this.getSwordSprite(), this.x + this.offsetX, this.y - this.offsetY, this.swordWidth, this.swordHeight);
        }
    }
}