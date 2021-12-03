function hasCollided(x1, y1, x2, y2, width1, height1, width2, height2) {
    return (x1 + width1 > x2 &&
        x1 < x2 + width2 &&
        y1 + height1 > y2 &&
        y1 < y2 + height2);
}

class Slime {

    constructor(x, y, w, h) {
        //Slime position and size
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

        // constants for jumping and speed
        this.aggro_range = 500;
        this.jumps = 0;
        this.max_jumps = 1;
        this.jmp_spd = -7.5;
        this.jump_xspd = 7;
        this.xspd = 3;
        this.yacc = .3

        //velocity vars
        this.yvel = 0;
        this.xvel = 0;
        this.friction = 0.85;    // friction coefficient

        //Invicibility frames after getting hit.
        this.invincibility = 0.5;
        this.invincibilityFrame = 0;

        //gameplay variables
        this.dead = false; //death flag
        this.hurt = false; //for when to animate being damaged
        this.hurt_counter = 0; //For which to animate in the hurt animations array
        this.hurt_counter_max = 30; // how long to display hurt animation after getting hit
        this.lives = 5;//amount of hits enemy can take. 

        this.jump_state = 0; //0: idle, 1: about to jump, 2: jumped
        this.jump_state_timer_max = 120;    // number of frames slime must wind up before jumping
        this.jump_state_timer_wait = 60;   // number of frames slime must wait after jumping
    }

    //State machine of slime
    FSM() {

        switch (this.jump_state) {
            case 0: {
                let dist = abs(this.x - game.player.x) + abs(this.y - game.player.y);

                if (dist < this.aggro_range) {
                    // chase the player
                    this.jump_state = 1;
                    this.jump_state_timer = 0;
                }
                break;
            }

            case 1: {
                this.jump_state_timer++;
                if (this.jump_state_timer > this.jump_state_timer_max) {
                    /* jump at player */

                    // direction to jump
                    let dir = Math.sign(game.player.x - this.x);

                    // jump at player
                    this.yvel = this.jmp_spd;
                    this.xvel = this.jump_xspd * dir;

                    // change to jump state
                    this.jump_state = 2;

                    this.jump_state_timer = 0;
                }
                break;
            }

            case 2: {
                this.jump_state_timer++;

                if (this.jump_state_timer > this.jump_state_timer_wait) {
                    this.jump_state = 0;
                    this.jump_state_timer = 0;
                }
                break;
            }

            default: break;

        }
    }

    // returns the current sprite to be used
    getSprite() {
        if (this.hurt) return sprites.slime_hurt;
        if (this.dead) return sprites.slime_hurt;

        switch (this.jump_state) {
            case 0: return sprites.slime_idle;
            case 1: return sprites.slime_squished;
            case 2: return sprites.slime_tall;
            default: return sprites.slime_idle;
        }
    }

    //Check if Rat has been hit by the sword.
    checkSwordCollision() {
        if (game.player.lastDir === 'left') { //if player is facing left
            if ((frameCount - this.invincibilityFrame) > this.invincibility * 60 && hasCollided(this.x, this.y, game.player.x - game.player.offsetX - 2.5 * game.player.width, game.player.y, this.width, this.height, game.player.swordWidth * 0.7, game.player.swordHeight / 5)) {
                this.invincibilityFrame = frameCount;
                this.lives--;
                if (this.lives > 0) {
                    this.hurt = true;
                } else {
                    this.dead = true;
                }
            }
        } else { //if player is facing right
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

    //Updates slime movement, collision, lives, and animations. 
    update() {

        /* Insert AI logic here */
        this.FSM();

        if (this.hurt) {
            this.hurt_counter++;

            if (this.hurt_counter > this.hurt_counter_max) {
                this.hurt_counter = 0;
                this.hurt = false;
            }
        }

        this.yvel += this.yacc;

        let newx = this.x + this.xvel;

        // wall collision
        //x
        for (let i = 0; i < game.blocks.length; i++) {
            let block = game.blocks[i];

            let d = abs(this.x - block.x) + abs(this.y - block.y);

            if (d < 90) {

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
        let newy = this.y + this.yvel;

        for (let i = 0; i < game.blocks.length; i++) {
            let block = game.blocks[i];

            let d = abs(this.x - block.x) + abs(this.y - block.y);

            if (d < 90) {
                if (
                    newx + this.width > block.x &&
                    newx < block.x + block.width &&
                    newy + this.height > block.y &&
                    newy < block.y + block.height) {

                    if (this.yvel > 0) {
                        this.jumps = this.max_jumps;

                        this.xvel *= this.friction;
                    }

                    this.yvel = 0;
                    newy = this.y;
                    break;
                }
            }
        }

        this.x = newx;
        this.y = newy;

        //Only check sword collision when player is swinging.
        if (game.player.swinging) {
            this.checkSwordCollision();
        }
    }

    //Draws the slime. 
    draw() {
        this.update();
        image(this.getSprite(), this.x, this.y, this.width, this.height);
    }

}