// global constants
var TILE_SIZE = 32;
var PLAYER_SIZE = 28;
var SLIME_SIZE = 64;

class Game {
    constructor() {
        this.mainMenu = new mainMenu();
        this.tutorial = new Tutorial();
        this.state = "game";

        this.loadTilemap(intro_tilemap);
    }

    loadTilemap(tm) {
        this.blocks = [];
        this.slimes = [];
        this.player = null;

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
                        print('slime added');
                        this.slimes.push(new Slime(x * TILE_SIZE, y * TILE_SIZE, SLIME_SIZE, SLIME_SIZE));
                    }

                    default: break;
                }
            }
        }

        print(this.blocks.length);
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
        
        this.player.draw();
    }
}

var intro_tilemap = [
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "        s                     ",
    "                              ",
    "                p             ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "gggggggggggggggggggggggggggggg"];