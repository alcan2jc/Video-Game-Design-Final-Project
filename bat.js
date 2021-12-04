
// enemy for player to fight
class Bat {

    // x positoin
    // y position
    // width of sprite
    // height of sprite
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

        // constants
        this.xspd = 0.5;
        this.attackxspd = 2;
        this.aggro_dist = 500;
        //moving variable. 0 = idle, 1 = left, 2 = right, 3 = attack, 4 = reset
        this.move = 1;
        this.invincibility = 0.5; //Invicibility frames after getting hit.
        this.invincibilityFrame = 0;
        this.resetFrame = 0;

        //game variables
        this.dead = false; //death flag
        this.hurt = false; //for when to animate being damaged
        this.lives = 3; //amount of hits enemy can take. 
        this.hurtFrame = 0;

        this.vel = new p5.Vector(0, 0);
        this.acc = new p5.Vector(0, 0);

        this.animation_state = 0;
        this.anim_speed = 60 / 20; // frames per second
        this.anim_counter = 0;
    }

    // returns current sprite in animation
    getSprite() {
        switch (this.animation_state) {
            //flying
            case 0: {
                if (!(frameCount % this.anim_speed)) {
                    this.anim_counter++;
                    this.anim_counter %= 12;
                }
                return sprites.bat[this.anim_counter];
            }
            //hurt
            case 1: return sprites.bat_hurt;
            case 2: return sprites.bat_hurt;
            default:
                print('Invalide animation State');
        }
        return null;
    }

    //Checks bat to wall collision
    wallCollision() {
        let newx = this.x + this.vel.x
        // wall collision
        //x
        for (let i = 0; i < game.blocks.length; i++) {
            let block = game.blocks[i];

            let d = abs(this.x - block.x) + abs(this.y - block.y);

            //only check collision if bat is close to that block
            if (d < 100) {
                if (
                    newx + this.width > block.x &&
                    newx < block.x + block.width &&
                    this.y + this.height > block.y &&
                    this.y < block.y + block.height) {

                    let top = hasCollided(newx, this.y + this.height, block.x, block.y,
                        this.width, 1, block.height, 1);
                    if (this.move !== 3 && this.move !== 4) {
                        this.vel.x < 0 ? this.move = 2 : this.move = 1;
                    }
                    if (this.move === 3 && top) {
                        this.move = 4;
                        this.resetFrame = frameCount;
                    }

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

                    if (this.move !== 3 && this.move !== 4) {
                        this.vel.x < 0 ? this.move = 2 : this.move = 1;
                    }
                    let top = hasCollided(newx, this.y + this.height, block.x, block.y,
                        this.width, 1, block.height, 1);
                    if (this.move === 3 && top) {
                        this.move = 4;
                        this.resetFrame = frameCount;
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
        for (let i = 0; i < game.spikes.length; i++) {
            let block = game.spikes[i];

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

        return [newx, newy]; //new = old for when there is collision
    }

    //Check if bat has been hit by the sword.
    checkSwordCollision() {
        if (game.player.lastDir === 'left') { //if player is facing left
            if ((frameCount - this.invincibilityFrame) > this.invincibility * 60 && hasCollided(this.x, this.y, game.player.x - game.player.offsetX - 2.5 * game.player.width, game.player.y, this.width, this.height, game.player.swordWidth * 0.7, game.player.swordHeight / 5)) {
                sounds.enemy_hit.play();
                this.invincibilityFrame = frameCount;
                this.lives--;
                if (this.lives > 0) {
                    this.hurt = true;
                    this.hurtFrame = frameCount;
                } else {
                    this.dead = true;
                    game.goal--;
                }
            }
        } else { //if player is facing right
            if ((frameCount - this.invincibilityFrame) > this.invincibility * 60 && hasCollided(this.x, this.y, game.player.x - game.player.offsetX, game.player.y, this.width, this.height, game.player.swordWidth * 0.7, game.player.swordHeight / 5)) {
                sounds.enemy_hit.play();
                this.invincibilityFrame = frameCount;
                this.lives--;
                if (this.lives > 0) {
                    this.hurt = true;
                    this.hurtFrame = frameCount;
                } else {
                    this.dead = true;
                    game.goal--;
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

        //Keep within bounds
        if (this.x < this.width || this.x > game.level_width - this.width) {
            this.vel.x < 0 ? this.move = 2 : this.move = 1;
        }

        //Attack if dist is less than the aggro range. 
        let d = abs(this.x - game.player.x) + abs(this.y - game.player.y);
        if (d < this.aggro_dist && this.move !== 4) {
            this.move = 3;
        }

        //attack
        if (this.move === 3) {
            let target = new p5.Vector(game.player.x - this.x, game.player.y - this.y).heading();
            this.vel.x += this.attackxspd * cos(target);
            this.vel.y += 0.01 * this.attackxspd * sin(target);
        }

        //reset after attacking
        if (this.move === 4) {
            let target = new p5.Vector(game.player.x - this.x, game.player.y - this.y).heading();
            this.vel.x -= this.attackxspd * cos(target);
            this.vel.y -= 0.01 * this.attackxspd * sin(target);

            if ((frameCount - this.resetFrame) > 60) {
                this.move = 3;
            }
        }

        //Only check sword collision when player is swinging.
        if (game.player.swinging) {
            this.checkSwordCollision();
        }
        if (this.hurt) {
            this.animation_state = 1;
            if ((frameCount - this.hurtFrame) > 30) {
                this.animation_state = 0;
                this.hurt = false;
            }
        } else if (this.dead) {
            this.animation_state = 2;
            delete this.x;
            delete this.y;
        } else {
            this.animation_state = 0;
        }

        let newpos = this.wallCollision();

        this.x = newpos[0];
        this.y = newpos[1];
    }

    // draws bat to canvas
    draw() {
        this.update();
        if (this.vel.x > 0) {
            push();
            scale(-1, 1);
            image(this.getSprite(), -this.x - this.width, this.y, this.width, this.height);
            pop();
        } else {
            image(this.getSprite(), this.x, this.y, this.width, this.height);
        }

    }



}