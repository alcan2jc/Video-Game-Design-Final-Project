function hasCollided(x1, y1, x2, y2, width1, height1, width2, height2) {
    return (x1 + width1 > x2 &&
        x1 < x2 + width2 &&
        y1 + height1 > y2 &&
        y1 < y2 + height2);
}

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
        this.move = 2;

        //game vars
        this.dead = false;
        this.hurt = false;
        this.anim_counter_hurt = 0;
        this.anim_counter_dead = 0;
        this.lives = 5;
        //Invicibility frames after getting hit.
        this.invincibility = 0.5;
        this.invincibilityFrame = 0;

        this.vel = new p5.Vector(0, 0);
        this.acc = new p5.Vector(0, 0);

        // 0: idle 1: running 2: airborn
        this.animation_state = 0;
        this.anim_counter = 0;
        this.anim_counter_hurt = 0;
        this.anim_counter_dead = 0;
        this.anim_speed = 60 / 10; // frames per second
        this.anim_speed_hurt = 60 / 2; // frames per second
        this.anim_speed_dead = 60 / 10; // frames per second
    }

    wallCollision() {
        let newx = this.x + this.vel.x

        // wall collision
        //x
        for (let i = 0; i < game.blocks.length; i++) {
            let block = game.blocks[i];

            let d = abs(this.x - block.x) + abs(this.y - block.y);

            if (d < 100) {

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

            if (d < 100) {
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
            //hurt
            case 2: {
                if (!(frameCount % this.anim_speed_hurt)) {
                    this.anim_counter_hurt++;
                    this.anim_counter_hurt %= 2;
                    if (this.anim_counter_hurt === 0)
                        this.hurt = false;
                }
                return sprites.rat_hurt[this.anim_counter_hurt];
            }
            
            //dead
            case 3: { 
                if (!(frameCount % this.anim_speed_dead)) {
                    this.anim_counter_dead++;
                    this.anim_counter_dead %= 4;
                    if (this.anim_counter_dead === 0) {
                        this.x = -100;
                        this.y = -100;
                    }
                }
                return sprites.rat_dead[this.anim_counter_dead];
            }

            default:
                print('Invalide animation State');
        }

        return null;
    }

    checkSwordCollision() {
        if (game.player.lastDir === 'left') {
            if ((frameCount - this.invincibilityFrame) > this.invincibility * 60 && hasCollided(this.x, this.y, game.player.x - game.player.offsetX - 2.5 * game.player.width, game.player.y, this.width, this.height, game.player.swordWidth * 0.7, game.player.swordHeight / 5)) {
                this.invincibilityFrame = frameCount;
                this.lives--;
            }
        } else {
            if ((frameCount - this.invincibilityFrame) > this.invincibility * 60 && hasCollided(this.x, this.y, game.player.x - game.player.offsetX, game.player.y, this.width, this.height, game.player.swordWidth * 0.7, game.player.swordHeight / 5)) {
                this.invincibilityFrame = frameCount;
                this.lives--;
            }
        }
    }

    checkSwordCollision() {
        if (game.player.lastDir === 'left') {
            if ((frameCount - this.invincibilityFrame) > this.invincibility * 60 && hasCollided(this.x, this.y, game.player.x - game.player.offsetX - 2.5 * game.player.width, game.player.y, this.width, this.height, game.player.swordWidth * 0.7, game.player.swordHeight / 5)) {
                this.invincibilityFrame = frameCount;
                this.lives--;
                if (this.lives > 0) {
                    this.hurt = true;
                } else {
                    this.dead = true;
                }

            }
        } else {
            if ((frameCount - this.invincibilityFrame) > this.invincibility * 60 && hasCollided(this.x, this.y, game.player.x - game.player.offsetX, game.player.y, this.width, this.height, game.player.swordWidth * 0.7, game.player.swordHeight / 5)) {
                this.invincibilityFrame = frameCount;
                this.lives--;
                if (this.lives > 0) {
                    this.hurt = true;
                } else {
                    this.dead = true;
                }
            }
        }
    }

    update() {
        this.vel.x = 0;
        if (this.move === 1) { //1 = left
            this.vel.x = -this.xspd;
        }
        else if (this.move === 2) { //2 = right
            this.vel.x = this.xspd;
        }

        //Only check sword collision when player is swinging.
        if (game.player.swinging) {
            this.checkSwordCollision();
        }

        if (this.hurt || this.dead) {
            if (this.hurt) {
                this.animation_state = 2;
            }

            if (this.dead) {
                this.animation_state = 3;
            }
        } else {
            if (this.vel.x == 0) {
                this.animation_state = 0;
            } else {
                this.animation_state = 1;
            }
        }

        let newpos = this.wallCollision();

        this.x = newpos[0];
        this.y = newpos[1];
    }

    draw() {
        this.update();
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