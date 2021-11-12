
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
        this.jmp_spd_x = 10;
        this.max_xspd = 5;
        this.friction = 0.9;

        this.forces = new p5.Vector(0, 0);

        this.xacc = new p5.Vector(.75, 0);
        this.xacc_n = new p5.Vector(-.75, 0);
        this.gravity = new p5.Vector(0, 0.3);
        this.vel = new p5.Vector(0, 0);

        // 0: idle 1: running 2: airborn
        this.animation_state = 1;
        this.anim_counter = 0;
        this.anim_speed = 60 / 10; // frames per second

        this.x_dir = 0; // -1 left, 0 middle, 1 right

        this.touching_wall_x = false;
        this.touching_wall_y = false;
    }

    playerCollision() {
        this.touching_wall_x = false;
        this.touching_wall_y = false;

        this.x_dir = (this.vel.x != 0) ? (this.vel.x > 0) ? 1 : -1 : 0;

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

                        this.vel.x *= this.friction;
                        if (abs(this.vel.x) < 0.1) {
                            this.vel.x = 0;
                        }

                        if (this.vel.y > 0) {
                            this.jumps = this.max_jumps;
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
        }
        else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            //this.vel.x = this.xspd;
            this.forces.add(this.xacc);
        } else {
            this.animation_state = 0;
        }

        if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && ((this.jumps > 0 && this.vel.y == 0) || this.touching_wall_x)) {
            if (!this.touching_wall_x) {
                this.jump();
            } else {
                this.wall_jump();
            }
        } else {
            this.forces.add(this.gravity);
        }

        this.vel.add(this.forces);

        this.limit_speed();

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



}