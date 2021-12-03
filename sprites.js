

// class that contains all imported sprites
class Sprites {

    // imports sprites from files
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

        this.slime_squished = loadImage('sprites/slime_squished.png');

        /*
        this.slime_dead = [];
        for (let i = 0; i < 3; i++) {
            this.slime_dead.push(loadImage('sprites/slime_squished.png'));
        }
        */
        this.slime_tall = loadImage('sprites/slime_tall.png');

        this.slime_hurt = loadImage('sprites/slime_hurt.png');

        //sword sprites
        this.sword = [];
        for (let i = 0; i < 3; i++) {
            this.sword.push(loadImage('sprites/slash' + str(i) + '.png'));
        }

        // bat sprites
        this.bat = [];
        for (let i = 0; i < 12; i++) {
            this.bat.push(loadImage('sprites/bat' + str(i) + '.png'));
        }
        this.bat_hurt = loadImage('sprites/bat_hurt.png');
        
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


        // golem sprites -> https://craftpix.net/freebies/free-golems-chibi-2d-game-sprites/
        this.golem_run = [];
        this.golem_hurt = [];
        this.golem_dead = [];
        this.golem_idle = [];
        this.golem_jump = [];
        this.golem_swing = [];

        for (let i = 0; i <= 17; i++) {
            if (i >= 10) {
                this.golem_run.push(loadImage('golem-sprites/Golem_01_Walking_0' + str(i) + '.png'));
            } else {
                this.golem_run.push(loadImage('golem-sprites/Golem_01_Walking_00' + str(i) + '.png'));
            }
        }

        for (let i = 0; i <= 11; i++) {
            if (i >= 10) {
                this.golem_hurt.push(loadImage('golem-sprites/Golem_01_Hurt_0' + str(i) + '.png'));
            } else {
                this.golem_hurt.push(loadImage('golem-sprites/Golem_01_Hurt_00' + str(i) + '.png'));
            }
        }

        for (let i = 0; i <= 14; i++) {
            if (i >= 10) {
                this.golem_dead.push(loadImage('golem-sprites/Golem_01_Dying_0' + str(i) + '.png'));
            } else {
                this.golem_dead.push(loadImage('golem-sprites/Golem_01_Dying_00' + str(i) + '.png'));
            }
        }

        for (let i = 0; i <= 11; i++) {
            if (i >= 10) {
                this.golem_idle.push(loadImage('golem-sprites/Golem_01_Idle_0' + str(i) + '.png'));
            } else {
                this.golem_idle.push(loadImage('golem-sprites/Golem_01_Idle_00' + str(i) + '.png'));
            }
        }

        for (let i = 0; i <= 5; i++) {
            this.golem_jump.push(loadImage('golem-sprites/Golem_01_JumpLoop_00' + str(i) + '.png'));
        }

        for (let i = 0; i <= 11; i++) {
            if (i >= 10) {
                this.golem_swing.push(loadImage('golem-sprites/Golem_01_Attacking_0' + str(i) + '.png'));
            } else {
                this.golem_swing.push(loadImage('golem-sprites/Golem_01_Attacking_00' + str(i) + '.png'));
            }
        }

        // environment
        this.dirt = loadImage('sprites/dirt.png');
        this.spike = loadImage('sprites/spike.png');
        this.background = loadImage('sprites/MountainBackground.png');
    }

    // function for testing images
    test() {
        image(this.player_run[0], 0, 0, 20, 20);
    }
}
