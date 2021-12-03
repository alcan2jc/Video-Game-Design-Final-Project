
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
        this.anim_counter_sword = 0;

        this.has_dash = true;
        this.is_dashing = false;
        this.dash_length = 15;
        this.jmp_spd = -8.5;
        this.jmp_spd_x = 15;
        this.dash_spd = 15;
        this.max_xspd = 5;
        this.friction = 0.9;
        this.health = 100;
        //Invicibility frames after getting hit.
        this.invincibility = 1;
        this.invincibilityFrame = 0;
        this.flashFrame = 0;
        this.flashState = 0;
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

        this.anim_counter_run = 0;
        this.anim_counter_sword = 0;
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

        // spike collision
        for (let i = 0; i < game.spikes.length; i++) {
            let block = game.spikes[i];

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

                    if ((frameCount - this.invincibilityFrame) > this.invincibility * 60) {
                        this.invincibilityFrame = frameCount;
                        this.vel.y -= 5;
                        game.player.health -= 5;
                        game.player.health = max(0, game.player.health);
                        game.animator.hitEffect();
                    }
                    break;
                }
            }
        }

        // slimes
        for (let i = 0; i < game.slimes.length; i++) {
            let slime = game.slimes[i];

            let d = abs(this.x - slime.x) + abs(this.y - slime.y);

            if (d < 100) {
                if (
                    newx + this.width > slime.x &&
                    newx < slime.x + slime.width &&
                    newy + this.height > slime.y &&
                    newy < slime.y + slime.height) {

                    if ((frameCount - this.invincibilityFrame) > this.invincibility * 60) {
                        this.invincibilityFrame = frameCount;
                        if (this.lastDir === 'left') {
                            this.vel.x += 10;
                        } else {
                            this.vel.x -= 10;
                        }
                        this.vel.y -= 5;
                        game.player.health -= 5;
                        game.player.health = max(0, game.player.health);
                        game.animator.hitEffect();
                    }
                    break;
                }
            }
        }

        // rat
        for (let i = 0; i < game.rats.length; i++) {
            let rat = game.rats[i];

            let d = abs(this.x - rat.x) + abs(this.y - rat.y);

            if (d < 100) {
                if (
                    newx + this.width > rat.x &&
                    newx < rat.x + rat.width &&
                    newy + this.height > rat.y &&
                    newy < rat.y + rat.height) {

                    if ((frameCount - this.invincibilityFrame) > this.invincibility * 60) {
                        this.invincibilityFrame = frameCount;
                        if (this.lastDir === 'left') {
                            this.vel.x += 10;
                        } else {
                            this.vel.x -= 10;
                        }
                        this.vel.y -= 5;
                        game.player.health -= 5;
                        game.player.health = max(0, game.player.health);
                        game.animator.hitEffect();
                    }
                    break;
                }
            }
        }

        // golem
        for (let i = 0; i < game.golems.length; i++) {
            let golem = game.golems[i];

            let d = abs(this.x - golem.x) + abs(this.y - golem.y);

            if (d < 300) {
                if (
                    newx + this.width > golem.x + 40 &&
                    newx < golem.x + 40 + golem.width - 80 &&
                    newy + this.height > golem.y + 20 &&
                    newy < golem.y + 20 + golem.height - 30) {

                    if ((frameCount - this.invincibilityFrame) > this.invincibility * 60) {
                        this.invincibilityFrame = frameCount;
                        if (this.lastDir === 'left') {
                            this.vel.x += 10;
                        } else {
                            this.vel.x -= 10;
                        }
                        this.vel.y -= 5;
                        game.player.health -= 5;
                        game.player.health = max(0, game.player.health);
                        game.animator.hitEffect();
                    }
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
                    this.anim_counter_run++;
                    this.anim_counter_run %= 3;
                }
                return sprites.player_run[this.anim_counter_run];
            }
            case 2: return sprites.player_airborn;

            default:
                print('Invalide animation State')
        }

        return null;
    }

    getSwordSprite() {
        if (!(frameCount % this.anim_speed_sword)) {
            this.anim_counter_sword++;
            this.anim_counter_sword %= 3;
            if (this.anim_counter_sword === 0)
                this.swinging = false;
        }
        return sprites.sword[this.anim_counter_sword];
    }

    jump() {
        this.vel.y = this.jmp_spd;
        this.jumps--;
        game.animator.jumpEffect(this.x + this.width / 2, this.y + this.height);
    }

    wall_jump() {
        this.jump();
        this.vel.x = this.jmp_spd_x * -this.x_dir;
    }

    limit_speed() {
        this.vel.x = (abs(this.vel.x) > this.max_xspd) ? (this.vel.x > 0) ? this.max_xspd : -this.max_xspd : this.vel.x;
    }

    update() {
        this.forces.x = 0;
        this.forces.y = 0;

        // controls
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            this.forces.add(this.xacc_n);
            this.lastDir = 'left';
        }
        else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
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
            this.anim_counter_sword = 0;
        }

        if (mouseIsPressed) {
            if (mouseButton === LEFT && (frameCount - this.swordFrameCount) > 60 * this.swordCooldown) {
                this.swordFrameCount = frameCount;
                this.swinging = true;
            }
        }

        if (keyIsDown(SHIFT) && this.has_dash && this.x_dir) {
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
            scale(-1, 1);
            image(this.getSwordSprite(), -(this.x - this.offsetX) - this.width, this.y - this.offsetY, this.swordWidth, this.swordHeight);
            pop();
        } else {
            noFill();
            image(this.getSwordSprite(), this.x + this.offsetX, this.y - this.offsetY, this.swordWidth, this.swordHeight);
        }
    }
}