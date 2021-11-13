
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

        //sword sprites
        this.sword = [];
        for (let i = 0; i < 3; i++) {
            this.sword.push(loadImage('sprites/slash' + str(i) + '.png'));
        }

        // bat sprites
        this.bat = [];
        for (let i = 0; i < 12; i++) {
            this.bat.push(loadImage('sprites/bat/bat' + str(i) + '.png'));
        }



        // rat sprites -> https://craftpix.net/freebies/free-street-animal-pixel-art-asset-pack/
        this.rat_run = [];
        this.rat_hurt = [];
        this.rat_dead = [];
        this.rat_idle = loadImage('sprites/rat_idle.png');
        for (let i = 0; i < 4; i++) {
            this.rat_run.push(loadImage('sprites/rat_run' + str(i) + '.png'));
            this.rat_dead.push(loadImage('sprites/rat_dead' + str(i) + '.png'));
        }

        this.rat_hurt.push(loadImage('sprites/rat_hurt.png'));
        this.rat_hurt.push(loadImage('sprites/rat_idle.png'));

        // environment
        this.dirt = loadImage('sprites/dirt.png');
        this.spike = loadImage('sprites/spike.png');
        this.background = loadImage('sprites/MountainBackground.png');
    }


    test() {
        image(this.player_run[0], 0, 0, 20, 20);
    }
}
