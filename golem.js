//Collision function
function hasCollided(x1, y1, x2, y2, width1, height1, width2, height2) {
    return (x1 + width1 > x2 &&
        x1 < x2 + width2 &&
        y1 + height1 > y2 &&
        y1 < y2 + height2);
}

// Golem enemy class. 
class Golem {
    constructor(x, y, w, h) {
        //Golem position and size
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

        // constants for jumping and speed
        this.jumps = 0;
        this.max_jumps = 1;
        this.jmp_spd = -7.5;
        this.xspd = 1;
        this.yacc = .3;

        //club variables
        this.swordHeight = 100;
        this.swordWidth = 100;
        this.offsetX = -20;
        this.offsetY = 40;
        this.swordCooldown = 1; //1 second
        this.swordFrameCount = 0;
        this.swinging = false;
        this.lastDir = 'right';
        this.anim_counter_sword = 0;

        //moving variable. 0 = idle, 1 = left, 2 = right, 3 = jump, 4 = swing. 
        this.move = 0;

        //game variables
        this.dead = false; //death flag
        this.hurt = false; //for when to animate being damaged
        this.anim_counter_hurt = 0; //For which to animate in the hurt animations array
        this.anim_counter_dead = 0; //For which to animate in the dead animations array
        this.anim_counter_jump = 0; //For which to animate in the jump animations array
        this.anim_counter_run = 0;
        this.anim_counter_idle = 0;
        this.lives = 3; //amount of hits enemy can take. 
        this.jumping = false;
        //Invicibility frames after getting hit.
        this.invincibility = 1;
        this.invincibilityFrame = 0;

        this.forces = new p5.Vector(0, 0);
        this.xacc = new p5.Vector(.75, 0);
        this.xacc_n = new p5.Vector(-.75, 0);
        this.gravity = new p5.Vector(0, 0.3);
        this.vel = new p5.Vector(0, 0);

        this.animation_state = 0; // 0: idle 1: running 2: airborn
        this.anim_counter = 0; //animation counter for moving
        this.anim_counter_hurt = 0; //animation counter for hurt
        this.anim_counter_dead = 0; //animation counter for dead
        this.anim_speed = 60 / 10; // speed of running in frames per second
        this.anim_speed_hurt = 60 / 30; // speed of hurt animations in frames per second
        this.anim_speed_dead = 60 / 20; // speed of dead animations in frames per second
        this.anim_speed_jump = 60 / 20; // speed of jump animations in frames per second
        this.anim_speed_sword = 60 / 20;    // speed of swinging animation in frames per second

        this.state = 0; // 0: idle, 1: chasing, 2:swing
        this.aggro_range = 350; // range for the golem to aggro player
        this.swing_range = 150; // range for golem to swing
        this.move_dir;  // varible that holdes the direction of movement
        this.wonder_timer = 999;  // timer used for wonder state
        this.wonder_dir = (Math.random() < .5) ? -1 : 1; // variable for wondering direction
    }

    //Checks Golem to wall collision
    wallCollision() {
        let newx = this.x + this.vel.x;

        // wall collision
        //x
        for (let i = 0; i < game.blocks.length; i++) {
            let block = game.blocks[i];
            let d = abs(this.x - block.x) + abs(this.y - block.y);
            //only check collision if goplem is close to that block
            if (d < 500) {

                if (hasCollided(
                    newx + 40, this.y + 20, block.x, block.y,
                    this.width - 80, this.height - 30, block.width, block.height)) {

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
            //only check collision if golem is close to that block
            if (d < 500) {

                if (hasCollided(
                    this.x + 40, newy + 20, block.x, block.y,
                    this.width - 80, this.height - 30, block.width, block.height)) {

                    if (this.vel.y > 0) {
                        this.jumps = this.max_jumps;
                    }

                    this.vel.y = 0;
                    newy = this.y;
                    break;
                }
            }
        }

        // spike collision
        //x
        for (let i = 0; i < game.spikes.length; i++) {
            let block = game.spikes[i];
            let d = abs(this.x - block.x) + abs(this.y - block.y);
            //only check collision if goplem is close to that block
            if (d < 500) {

                if (hasCollided(
                    newx + 40, this.y + 20, block.x, block.y,
                    this.width - 80, this.height - 30, block.width, block.height)) {

                    newx = this.x;
                    break;
                }
            }
        }

        for (let i = 0; i < game.spikes.length; i++) {
            let block = game.spikes[i];

            let d = abs(this.x - block.x) + abs(this.y - block.y);
            //only check collision if golem is close to that block
            if (d < 500) {

                if (hasCollided(
                    this.x + 40, newy + 20, block.x, block.y,
                    this.width - 80, this.height - 30, block.width, block.height)) {

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
            case 0:
                if (!(frameCount % this.anim_speed)) {
                    this.anim_counter_idle++;
                    this.anim_counter_idle %= 12;
                }
                return sprites.golem_idle[this.anim_counter_idle];
            // running
            case 1: {
                if (!(frameCount % this.anim_speed)) {
                    this.anim_counter_run++;
                    this.anim_counter_run %= 18;
                }
                if (this.anim_counter_run > sprites.golem_run.lenth) {
                    print('error');
                }
                return sprites.golem_run[this.anim_counter_run];
            }
            //hurt
            case 2: {
                if (!(frameCount % this.anim_speed_hurt)) {
                    this.anim_counter_hurt++;
                    this.anim_counter_hurt %= 12;
                    if (this.anim_counter_hurt === 0)
                        this.hurt = false;
                }
                return sprites.golem_hurt[this.anim_counter_hurt];
            }

            //dead
            case 3: {
                if (!(frameCount % this.anim_speed_dead)) {
                    this.anim_counter_dead++;
                    this.anim_counter_dead %= 15;
                    if (this.anim_counter_dead === 0) {
                        delete this.x;
                        delete this.y;
                    }
                }
                return sprites.golem_dead[this.anim_counter_dead];
            }

            //jump loop
            case 4: {
                if (!(frameCount % this.anim_speed)) {
                    this.anim_counter_jump++;
                    this.anim_counter_jump %= 6;
                }
                return sprites.golem_jump[this.anim_counter_jump];
            }
            case 5: {
                if (!(frameCount % this.anim_speed_sword)) {
                    this.anim_counter_sword++;
                    this.anim_counter_sword %= 12;
                    if (this.anim_counter_sword === 0) {
                        this.swinging = false;
                        this.move = 0;
                    }
                }
                return sprites.golem_swing[this.anim_counter_sword];
            }

            default:
                print('Invalide animation State');
        }

        return null;
    }

    jump() {
        this.vel.y = this.jmp_spd;
        this.jumps--;
        game.animator.jumpEffect(this.x + this.width / 2, this.y + this.height);
    }

    //Check if Golem has been hit by the sword.
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

    GolemFSM() {
        let dist = abs(this.x - game.player.x + 50) + abs(this.y - game.player.y);

        if (this.dead) return;

        switch (this.state) {

            case 0: {

                // wonder
                this.wonder_timer++;

                if ((this.wonder_timer > 120)) {
                    this.wonder_timer = 0;
                    let rand = Math.random();
                    if (rand < .3)
                        this.wonder_dir = -1;   // left
                    else if (rand > .7)
                        this.wonder_dir = 1;    // right
                    else
                        this.wonder_dir = 0;    // idle

                    this.move_dir = this.wonder_dir;
                }

                this.vel.x = this.xspd * this.wonder_dir;

                if (dist < this.aggro_range) {
                    // chase player
                    this.state = 1;
                }

                break;
            }

            case 1: {
                // direction to chase
                let dir = Math.sign(game.player.x - 50 - this.x);
                let diry = Math.sign(game.player.y + 25 - this.y);
                this.move_dir = dir;

                this.vel.x = this.xspd * dir;

                if (diry == -1 && this.jumps > 0) {
                    this.vel.y = this.jmp_spd;
                    this.jumps--;
                    this.jumping = true;
                }

                if (dist > this.aggro_range) {
                    this.state = 0;
                    this.wonder_timer = 999;
                } else if (dist < this.swing_range) {
                    this.move = 4;
                }
            }

        }

        if (this.vel.x != 0)
            this.animation_state = 1;

    }

    //Updates golem movement, collision, lives, and animations. 
    update() {
        this.forces.x = 0;
        this.forces.y = 0;

        this.vel.x = 0;

        this.GolemFSM();

        //Only check sword collision when player is swinging.
        if (game.player.swinging) {
            this.checkSwordCollision();
        }

        if (this.jumps > 0 && this.vel.y === 0 && this.move === 3) {
            this.jumping = true;
            this.jump();
        }

        if (this.move === 4) {
            if ((frameCount - this.swordFrameCount) > 60 * this.swordCooldown) {
                sounds.golem_swing.play();
                this.swordFrameCount = frameCount;
                this.swinging = true;
            }
        }

        //animations
        if (this.hurt || this.dead) {
            if (this.hurt) {
                this.animation_state = 2;
            }

            if (this.dead) {
                this.animation_state = 3;
            }
        } else {
            if (this.vel.x === 0 && this.vel.y === 0) {
                this.animation_state = 0;
            }

            if (this.jumping) {
                this.animation_state = 4;
                if (this.vel.y === 0) {
                    if (this.vel_x === 0)
                        this.animation_state = 0;
                    else
                        this.animation_state = 1;
                }
            }

            //slashing
            if (this.swinging) {
                this.animation_state = 5;
            }
        }
        this.forces.add(this.gravity);
        this.vel.add(this.forces);

        let newpos = this.wallCollision();

        this.x = newpos[0];
        this.y = newpos[1];
    }

    //Draws the golem. 
    draw() {
        this.update();
        if (this.move_dir == -1) {
            push();
            scale(-1, 1);
            image(this.getSprite(), -this.x - this.width, this.y, this.width, this.height);
            pop();
        } else {
            image(this.getSprite(), this.x, this.y, this.width, this.height);
        }
    }
}