
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
        this.yacc = .3

        this.yvel = 0;
        this.xvel = 0;

        // 0: idle 1: running 2: airborn
        this.animation_state = 1;
        this.anim_counter = 0;
        this.anim_speed = 60 / 10; // frames per second
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

    update() {
          
        this.xvel = 0;
        
        // controlls
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            this.xvel = -this.xspd;
            this.animation_state = 1;
        }
        else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            this.xvel = this.xspd;
            this.animation_state = 1;
        }
        else
            this.animation_state = 0;
        
        if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && this.jumps > 0 && this.yvel === 0) {      
            this.yvel = this.jmp_spd;
            this.jumps--;
        } else {
            this.yvel += this.yacc;
        }
        
        let newx = this.x + this.xvel;
        
        // wall collision
        //x
        for (let i = 0; i < game.blocks.length; i++) {
            let block = game.blocks[i];
            
            let d = abs(this.x - block.x) + abs(this.y - block.y);
            
            if (d < 50) {
        
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
            
            if (d < 50) {
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

        if (this.yvel != 0) {
            this.animation_state = 2;   // airborn
        }
    
        this.x = newx;
        this.y = newy;

    }


    draw() {

        if (this.xvel < 0) {
            push();
            scale(-1, 1);
            image(this.getSprite(), -this.x - this.width, this.y, this.width, this.height); 
            pop();
          } else {
            image(this.getSprite(), this.x, this.y, this.width, this.height);
          }
    }



}