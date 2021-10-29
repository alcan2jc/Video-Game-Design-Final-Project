
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
            case 0: return sprites.slime_idle;
            case 1: return sprites.slime_squished;
            case 2: return sprites.slime_tall;

            default: break;
        }

        return null;
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

    }


    draw() {

        image(sprites.slime_idle, this.x, this.y, this.width, this.height);
        print(this.x, this.y);

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