//Collision function
function hasCollided(x1, y1, x2, y2, width1, height1, width2, height2) {
    return (x1 + width1 > x2 &&
        x1 < x2 + width2 &&
        y1 + height1 > y2 &&
        y1 < y2 + height2);
}

// Rat enemy class. 
class Rat {
    constructor(x, y, w, h) {
        //Rat position and size
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

        // constants for jumping and speed
        this.jumps = 0;
        this.max_jumps = 1;
        this.jmp_spd = -7.5;
        this.xspd = 2;

        //moving variable. 0 = idle, 1 = left, 2 = right. 
        this.move = 2;

        //game variables
        this.dead = false; //death flag
        this.hurt = false; //for when to animate being damaged
        this.anim_counter_hurt = 0; //For which to animate in the hurt animations array
        this.anim_counter_dead = 0; //For which to animate in the dead animations array
        this.lives = 1; //amount of hits enemy can take. 
        //Invicibility frames after getting hit.
        this.invincibility = 0.5;
        this.invincibilityFrame = 0;

        this.vel = new p5.Vector(0, 0);
        this.acc = new p5.Vector(0, 0);

        this.animation_state = 0; // 0: idle 1: running 2: airborn
        this.anim_counter = 0; //animation counter for moving
        this.anim_counter_hurt = 0; //animation counter for hurt
        this.anim_counter_dead = 0; //animation counter for dead
        this.anim_speed = 60 / 10; // speed of running in frames per second
        this.anim_speed_hurt = 60 / 2; // speed of hurt animations in frames per second
        this.anim_speed_dead = 60 / 60; // speed of dead animations in frames per second
    }

    //Checks rat to wall collision
    wallCollision() {
        let newx = this.x + this.vel.x

        // wall collision
        //x
        for (let i = 0; i < game.blocks.length; i++) {
            let block = game.blocks[i];

            let d = abs(this.x - block.x) + abs(this.y - block.y);

            //only check collision if rat is close to that block
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

            //only check collision if rat is close to that block
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
        return [newx, newy]; //new = old for when there is collision
    }

    //Returns the correct sprite for the animation state. 
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

    //Updates rat movement, collision, lives, and animations. 
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

    //Draws the rat. 
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