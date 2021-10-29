
class Sprites {

    constructor() {
        this.player_sprites();


        this.dirt = loadImage('sprites/dirt.png');
    }

    player_sprites() {

        // load images
        this.player_idle = loadImage('sprites/player_idle.png');
        this.player_run = [];
        for (let i = 0; i < 3; i++) {
            this.player_run.push(loadImage('sprites/player_run' + str(i) + '.png'));
        }
    }


    test() {
        image(this.player_run[0], 0, 0, 20, 20);
    }
}
