// global constants
var TILE_SIZE = 32;
var PLAYER_SIZE = 28;
var SLIME_SIZE = 64;
var BAT_SIZE = 64;
var RAT_SIZE = 32;
var SPIKE_SIZE = 32;

class Game {
    constructor() {
        this.camera_still = false;    // used for parallax algorithm

        this.HUD = new HUD();
        this.parallax = new Parallax();
        this.animator = new Animator();

        this.loadTilemap(mainmenu_tilemap);

        this.mainMenu = new mainMenu();
        this.tutorial = new Tutorial();
        this.state = "main menu";
    }

    loadTilemap(tm) {
        this.blocks = [];
        this.spikes = [];
        this.slimes = [];
        this.bats = [];
        this.rats = [];
        this.player = null;

        this.level_width = tm[0].length * TILE_SIZE;

        for (let y = 0; y < tm.length; y++) {
            for (let x = 0; x < tm[0].length; x++) {
                let type = tm[y][x];

                switch (type) {
                    case 'g': {
                        this.blocks.push(new Block(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, sprites.dirt));
                        break;
                    }
                    case 'p': {
                        this.player = new Player(x * TILE_SIZE, y * TILE_SIZE, PLAYER_SIZE, PLAYER_SIZE);
                        break;
                    }
                    case 's': {
                        this.slimes.push(new Slime(x * TILE_SIZE, y * TILE_SIZE, SLIME_SIZE, SLIME_SIZE));
                        break;
                    }
                    case 'b': {
                        this.bats.push(new Bat(x * TILE_SIZE, y * TILE_SIZE, BAT_SIZE, BAT_SIZE));
                        break;
                    }
                    case 'r': {
                        this.rats.push(new Rat(x * TILE_SIZE, y * TILE_SIZE, RAT_SIZE, RAT_SIZE));
                        break;
                    }
                    case 't': {
                        this.spikes.push(new Block(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, sprites.spike));
                        break;
                    }

                    default: break;
                }
            }
        }
        this.parallax.setup_background(this.level_width);
    }

    update() {
        switch (game.state) {
            case "main menu": // main menu
                game.mainMenu.drawMainMenu();
                break;
            case "tutorial": // tutorial
                game.tutorial.drawTutorial();
                break;
            case "game": // game
                this.game_state();
                break;
            default: break;
        }
    }

    game_state() {
        //draw background
        this.translate_x = 0;
        this.camera_still = true;

        if (this.player.x >= width / 2 && this.player.x <= this.level_width - (width/2)) {
            this.translate_x = -this.player.x + (width/2);
            this.camera_still = false;
        }
        else if (this.player.x > this.level_width - (width/2)) {
            this.translate_x = -this.level_width + width;
            this.camera_still = true;
        }

        this.parallax.draw();

        translate(this.translate_x, 0);


        //drawHills
        //game.mainMenu.hill.draw();

        //bat
        for (let i = 0; i < game.bats.length; i++) {
            let bat = game.bats[i];
            bat.draw();
            bat.x--;

            if (bat.x < -bat.width) {
                bat.x = width + bat.width;
            }
        }

        //rat
        for (let i = 0; i < game.rats.length; i++) {
            let rat = game.rats[i];
            rat.draw(); 
        }

        // draw entities
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i].draw();
        }

        for (let i = 0; i < this.spikes.length; i++) {
            this.spikes[i].draw();
        }

        // draw slimes
        for (let i = 0; i < this.slimes.length; i++) {
            this.slimes[i].draw();
        }

        // draw bats
        for (let i = 0; i < this.bats.length; i++) {
            this.bats[i].draw();
        }

        // draw rats
        for (let i = 0; i < this.rats.length; i++) {
            this.rats[i].draw();
        }

        this.animator.draw();

        this.player.update();
        this.player.draw();

        translate(-this.translate_x, 0);
        this.HUD.draw();
    }
}

var mainmenu_tilemap = [
    "                                  ",
    "                             ",
    "                             ",
    "        ggggg                ",
    "                             ",
    "                         ggg ",
    "                         ggg ",
    "           ggg           ggg ",
    "                             ",
    "                             ",
    "                             ",
    "                  gggg  gg   ",
    "                             ",
    "                             ",
    "                             ",
    "                             ",
    "        ggg                  ",
    "                      g     s",
    "  p                          ",
    "gggggggggggggttttggggggggggggggggggg",
];

var intro_tilemap = [
    "gggggggggggggggggggggggggggggggggggggggggggggggggggggggggg",
    "g                                                        g",
    "g                                                        g",
    "g       ggggg                                            g",
    "g                                               ggggg    g",
    "g                        ggg                             g",
    "g                        ggg                             g",
    "g          ggg           ggg                             g",
    "g                                                        g",
    "g                                                        g",
    "g                                                        g",
    "g                 ggggggggggggggg                        g",
    "g                                                        g",
    "g                                   ggggg    ggg         g",
    "g                                       g    g           g",
    "g            ggg                        g    g           g",
    "g       ggg                             g    g           g",
    "g                     g     s           g    g           g",
    "g p    r                                                 g",
    "gggggggggggggttttggggggggggggggggggggggggggggggggggggggggg"];