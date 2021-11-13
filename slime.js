function hasCollided(x1, y1, x2, y2, width1, height1, width2, height2) {
    return (x1 + width1 > x2 &&
        x1 < x2 + width2 &&
        y1 + height1 > y2 &&
        y1 < y2 + height2);
}

class Slime {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

        // constants
        this.aggro_range = 100;
        this.jumps = 0;
        this.max_jumps = 1;
        this.jmp_spd = -7.5;
        this.xspd = 3;
        this.yacc = .3

        this.yvel = 0;
        this.xvel = 0;

        //Invicibility frames after getting hit.
        this.invincibility = 0.5;
        this.invincibilityFrame = 0;

        //gameplay vars
        this.lives = 2;
        this.anim_counter = 0;

        this.jump_state = 0; // 0: idle, 1: squished, 2: tall
    }

    FSM() {
        let dist = abs(this.x - game.player.x) + abs(this.y - game.player.y);

        if (dist < this.aggro_range) {
            // chase the player
            //this.jumpFSM();
        }
    }

    getSprite() {
        switch (this.jump_state) {
            case 0: {
                this.anim_counter--;
                if (this.anim_counter < 0) {
                    this.jump_state = 2;
                    this.anim_counter = 60;
                }
                return sprites.slime_idle;
            }
            case 1: return sprites.slime_squished;
            case 2: {
                this.anim_counter--;
                if (this.anim_counter < 0) {
                    this.jump_state = 0;
                    this.anim_counter = 60;
                }
                return sprites.slime_tall;
            }

            default: break;
        }

        return null;
    }

    checkSwordCollision() {
        if (game.player.lastDir === 'left') {
            if ((frameCount - this.invincibilityFrame) > this.invincibility*60 && hasCollided(this.x, this.y, game.player.x - game.player.offsetX - 2.5*game.player.width, game.player.y, this.width, this.height, game.player.swordWidth * 0.7, game.player.swordHeight/5)) {
                this.invincibilityFrame = frameCount;
                this.lives--;
            }
        } else {
            if ((frameCount - this.invincibilityFrame) > this.invincibility*60 && hasCollided(this.x, this.y, game.player.x - game.player.offsetX, game.player.y, this.width, this.height, game.player.swordWidth * 0.7, game.player.swordHeight/5)) {
                this.invincibilityFrame = frameCount;
                this.lives--;
            }
        }
    }
    
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

        if (this.lives === 0) {
            this.anim_counter = 1;
        }
    }

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