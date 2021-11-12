
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

        this.has_dash = true;
        this.is_dashing = false;
        this.dash_length = 15;
        this.jmp_spd = -8.5;
        this.jmp_spd_x = 15;
        this.dash_spd = 15;
        this.max_xspd = 5;
        this.friction = 0.9;

        this.forces = new p5.Vector(0, 0);

        this.xacc = new p5.Vector(.75, 0);
        this.xacc_n = new p5.Vector(-.75, 0);
        this.gravity = new p5.Vector(0, 0.3);
        this.vel = new p5.Vector(0, 0);

        // 0: idle 
        // 1: running 
        // 2: airborn
        // 3: slash
        this.animation_state = 1;
        this.anim_counter = 0;
        this.anim_speed = 60 / 10; // frames per second
        this.anim_speed_sword = 60 / 10; // frames per second

        this.x_dir = 0; // -1 left, 0 middle, 1 right
        this.prev_key_pressed = false;

        this.touching_wall_x = false;
        this.touching_wall_y = false;
    }

    playerCollision() {
        this.touching_wall_x = false;
        this.touching_wall_y = false;

        this.x_dir = (this.vel.x != 0) ? (this.vel.x > 0) ? 1 : -1 : 0;

        this.vel.x *= this.friction;
        if (abs(this.vel.x) < 0.1) {
            this.vel.x = 0;
        }

        let newx = this.x + this.vel.x;

        // wall collision
        if (this.vel.x != 0) {
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
                        
                        this.touching_wall_x = true;
                        
                        this.vel.x = 0;
                        newx = this.x;
                        break;
                    }
                }
            }
        }

        // y
        let newy = this.y + this.vel.y;

        if (this.vel.y != 0) {
            for (let i = 0; i < game.blocks.length; i++) {
                let block = game.blocks[i];

                let d = abs(this.x - block.x) + abs(this.y - block.y);

                if (d < 100) {
                    if (
                        newx + this.width > block.x &&
                        newx < block.x + block.width &&
                        newy + this.height > block.y &&
                        newy < block.y + block.height) {
                        
                        this.touching_wall_y = true;

                        if (this.vel.y > 0) {
                            this.jumps = this.max_jumps;
                            this.has_dash = true;
                        }

                        this.vel.y = 0;
                        newy = this.y;
                        break;
                    }
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
    jump() {
        this.vel.y = this.jmp_spd;
        this.jumps--;
    }

    wall_jump() {
        this.jump();
        this.vel.x = this.jmp_spd_x * -this.x_dir;
    }

    limit_speed() {
        this.vel.x = (abs(this.vel.x) > this.max_xspd) ? (this.vel.x > 0) ? this.max_xspd : -this.max_xspd : this.vel.x;
    }

    update() {
        //this.vel.x = 0;
        this.forces.x = 0;
        this.forces.y = 0;

        // controls
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            //this.vel.x = -this.xspd;
            this.forces.add(this.xacc_n);
            this.lastDir = 'left';
        }
        else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            //this.vel.x = this.xspd;
            this.forces.add(this.xacc);
            this.lastDir = 'right';
        } else {
            this.animation_state = 0;
        }

        if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && !this.prev_key_pressed) {
            if (!this.touching_wall_x && (this.jumps > 0 && this.vel.y == 0)) {
                this.jump();
            } else if (this.touching_wall_x) {
                this.wall_jump();
            }
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
        
        if ((mouseIsPressed) && this.has_dash && this.x_dir) {
            this.dash_timer = this.dash_length;
            this.has_dash = false;
            this.is_dashing = true;
            this.dash_vel = this.dash_spd * this.x_dir;
            this.vel.x = this.dash_vel;
        } else if (this.is_dashing) {
            this.vel.x = this.dash_vel;
            this.dash_timer--;

            if (this.dash_timer < 0)
                this.is_dashing = false;
        }

        this.forces.add(this.gravity);
        this.vel.add(this.forces);

        this.prev_key_pressed = keyIsPressed && (keyIsDown(UP_ARROW) || keyIsDown(87));

        //this.limit_speed();

        let newpos = this.playerCollision();

        if (this.x_dir == 0) {
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
        if (this.x_dir == -1) {
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