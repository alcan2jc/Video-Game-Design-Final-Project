
class Player {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

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
            case 2: return null;

            default:
                print('Invalide animation State')
        }

        return null;
    }


    draw() {
        image(this.getSprite(), this.x, this.y, this.width, this.height);
    }



}