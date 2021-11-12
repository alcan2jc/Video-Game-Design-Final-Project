// global constants
var TILE_SIZE = 32;
var PLAYER_SIZE = 28;
var SLIME_SIZE = 64;
var BAT_SIZE = 64;
var RAT_SIZE = 32;
var SPIKE_SIZE = 32;

class Game {
    constructor() {
        this.mainMenu = new mainMenu();
        this.tutorial = new Tutorial();
        this.parallax = new Parallax();
        this.state = "main menu";
        this.camera_still = false;    // used for parallax algorithm

        this.loadTilemap(intro_tilemap);
    }

    loadTilemap(tm) {
        this.blocks = [];
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
                        this.blocks.push(new Block(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, sprites.spike));
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
        
        //image(sprites.background, 0, 0, width, height);

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
        game.mainMenu.hill.draw();

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
            
            if (rat.x < -rat.width) {
                rat.x = width + rat.width;
            }

            if (rat.x >= width + rat.width) {
                rat.x = -rat.width/2;
            }
        }

        if (game.player.x >= width + game.player.width) {
            game.player.x = -game.player.width / 2;
            game.player.y = height - game.player.height - TILE_SIZE;
        }

        if (game.player.x <= -game.player.width) {
            game.player.x = width - (game.player.width / 2);
            game.player.y = height - game.player.height - TILE_SIZE;
        }

        // update entities
        this.player.update();

        for (let i = 0; i < this.slimes.length; i++) {
            this.slimes[i].update();
        }

        // draw entities
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i].draw();
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
            this.rats[i].update();
            this.rats[i].draw();
        }

        this.player.draw();
    }
}

var intro_tilemap = [
    "                                                          ",
    "                                                          ",
    "                                                          ",
    "                                                          ",
    "                                                          ",
    "                                                          ",
    "                                                          ",
    "                                                          ",
    "                                                          ",
    "                                                          ",
    "                                                          ",
    "                                                          ",
    "                                                          ",
    "                                                          ",
    "                                                          ",
    "                                                          ",
    "                                                          ",
    "    s                                                     ",
    "  p                                                       ",
    "gggggggggggggttttggggggggggggggggggggggggggggggggggggggggg"];