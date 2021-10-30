// global constants
var TILE_SIZE = 32;
var PLAYER_SIZE = 28;
var SLIME_SIZE = 64;
var BAT_SIZE = 64;
var SPIKE_SIZE = 32;

class Game {
    constructor() {
        this.mainMenu = new mainMenu();
        this.tutorial = new Tutorial();
        this.state = "main menu";

        this.loadTilemap(intro_tilemap);
    }

    loadTilemap(tm) {
        this.blocks = [];
        this.slimes = [];
        this.bats = [];
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
                        this.slimes.push(new Slime(x * TILE_SIZE, y * TILE_SIZE, SLIME_SIZE, SLIME_SIZE));
                        break;
                    }
                    case 'b': {
                        this.bats.push(new Bat(x * TILE_SIZE, y * TILE_SIZE, BAT_SIZE, BAT_SIZE));
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
        image(sprites.background, 0, 0, width, height);

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

        this.player.draw();
    }
}

var intro_tilemap = [
    "                              ",
    "                              ",
    "                              ",
    "                       b b b  ",
    "                        b b   ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                              ",
    "                            s ",
    "  p                           ",
    "gggggggggggggttttgggggggggggggggggggggggg"];
