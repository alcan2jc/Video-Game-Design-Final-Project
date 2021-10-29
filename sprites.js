
class Sprites {

    constructor() {
        // player sprites
        this.player_idle = loadImage('sprites/player_idle.png');
        this.player_airborn = loadImage('sprites/player_airborn.png');
        this.player_run = [];
        for (let i = 0; i < 3; i++) {
            this.player_run.push(loadImage('sprites/player_run' + str(i) + '.png'));
        }

        // slime sprites
        this.slime_idle = loadImage('sprites/slime_idle.png');
        this.slime_squished = loadImage('sprites/slime_idle.png');
        this.slime_tall = loadImage('sprites/slime_tall.png');

        // other
        this.dirt = loadImage('sprites/dirt.png');
        this.spike = loadImage('sprites/spike.png');
    }


    test() {
        image(this.player_run[0], 0, 0, 20, 20);
    }
}
