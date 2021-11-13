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
        this.aggro_range = 100;
        this.jumps = 0;
        this.max_jumps = 1;
        this.jmp_spd = -7.5;
        this.xspd = 3;
        this.yacc = .3

        //velocity vars
        this.yvel = 0;
        this.xvel = 0;

        //Invicibility frames after getting hit.
        this.invincibility = 0.5;
        this.invincibilityFrame = 0;

        //gameplay variables
        this.anim_counter = 0;
        this.dead = false; //death flag
        this.hurt = false; //for when to animate being damaged
        this.anim_counter_hurt = 0; //For which to animate in the hurt animations array
        this.anim_counter_dead = 0; //For which to animate in the dead animations array
        this.lives = 5;//amount of hits enemy can take. 

        this.animation_state = 0; // 0: idle, 1: squished, 2: tall
        this.anim_counter_hurt = 0; //animation counter for hurt
        this.anim_counter_dead = 0; //animation counter for dead
        this.anim_speed = 60 / 10; // frames per second
        this.anim_speed_hurt = 60 / 2; // frames per second
        this.anim_speed_dead = 60 / 10; // frames per second
        this.lives = 2; //amount of hits enemy can take. 
        this.anim_counter = 0; //animation counter for moving
    }

    //State machine of slime
    FSM() {
        let dist = abs(this.x - game.player.x) + abs(this.y - game.player.y);

        if (dist < this.aggro_range) {
            // chase the player
            //this.jumpFSM();
        }
    }

    //Returns the correct sprite for the animation state. 
    getSprite() {
        switch (this.animation_state) {
            case 0: return sprites.slime_idle; //idle
            case 1: {
                if (!(frameCount % this.anim_speed_hurt))
                    this.hurt = false;
                return sprites.slime_hurt;
            }
            case 2: {
                if (!(frameCount % this.anim_speed_dead)) {
                    this.anim_counter_dead++;
                    this.anim_counter_dead %= 3;
                    if (this.anim_counter_dead === 0) {
                        this.x = -100;
                        this.y = -100;
                    }
                }
                return sprites.slime_dead[this.anim_counter_dead];
            }
            default:
                print('Invalide animation State');
        }

        return null;
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
        //this.FSM();

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
        
        if (this.xvel === 0) {
            this.animation_state = 0;
        }

        if (this.hurt) {
            this.animation_state = 1;
        }

        if (this.dead) {
            this.animation_state = 2;
        }
    }

    //Draws the slime. 
    draw() {
        this.update();

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