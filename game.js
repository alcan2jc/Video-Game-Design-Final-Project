// global constants
var TILE_SIZE = 32;
var PLAYER_SIZE = 28;
var SLIME_SIZE = 64;
var BAT_SIZE = 64;
var RAT_SIZE = 32;
var GOLEM_SIZE = 128;
var SPIKE_SIZE = 32;

// game container class
// runs the game
class Game {

    // sets up game state 
    constructor() {
        this.camera_still = false;    // used for parallax algorithm

        this.snow = new Snow();
        this.blood = new Blood(300, 620, 120);
        this.confeeti = new Confetti();

        this.HUD = new HUD();
        this.parallax = new Parallax();
        this.animator = new Animator();

        this.mainMenu = new mainMenu();
        this.loadTilemap(mainmenu_tilemap);
        this.tutorial = new Tutorial();
        this.state = "main menu";

        this.end_state_timer = 0;
    }

    // loads given timemal
    // tm: the tilemap to load
    loadTilemap(tm) {
        this.goal = 0;
        this.blocks = [];
        this.spikes = [];
        this.slimes = [];
        this.bats = [];
        this.rats = [];
        this.golems = [];
        this.player = null;

        this.level_width = tm[0].length * TILE_SIZE;
        this.level_height = tm.length * TILE_SIZE;

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
                        this.goal++;
                        break;
                    }
                    case 'b': {
                        this.bats.push(new Bat(x * TILE_SIZE, y * TILE_SIZE, BAT_SIZE, BAT_SIZE));
                        this.goal++;
                        break;
                    }
                    case 'r': {
                        this.rats.push(new Rat(x * TILE_SIZE, y * TILE_SIZE, RAT_SIZE, RAT_SIZE));
                        this.goal++;
                        break;
                    }
                    case 'l': {
                        this.golems.push(new Golem(x * TILE_SIZE, y * TILE_SIZE, GOLEM_SIZE, GOLEM_SIZE));
                        this.goal++;
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

    // FSM for game state
    // determies which state to run
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
            case "end":
                print('end');
                this.end_state();
                break;
            default: break;
        }
    }

    // the state for when the game is going
    game_state() {
        //draw background
        this.translate_x = 0;
        this.translate_y = 0;
        this.camera_still = true;

        if (this.player.x >= width / 2 && this.player.x <= this.level_width - (width / 2)) {
            this.translate_x = -this.player.x + (width / 2);
            this.camera_still = false;
        }
        else if (this.player.x > this.level_width - (width / 2)) {
            this.translate_x = -this.level_width + width;
            this.camera_still = true;
        }

        if (this.player.y >= height / 2 && this.player.y <= this.level_height - (height / 2)) {
            this.translate_y = -this.player.y + (height / 2);
        }
        else if (this.player.y > this.level_height - (height / 2)) {
            this.translate_y = -this.level_height + height;
        }

        this.parallax.update();
        this.parallax.draw();

        push();
        translate(this.translate_x, this.translate_y);

        //drawHills
        // game.mainMenu.hill.draw();

        //bat
        for (let i = 0; i < game.bats.length; i++) {
            let bat = game.bats[i];
            bat.draw();
        }

        //rat
        for (let i = 0; i < game.rats.length; i++) {
            let rat = game.rats[i];
            rat.draw();
        }

        // draw entities
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i].draw();
            // push();
            // noFill();
            // stroke('red');
            // rect(block.x, block.y, block.width, block.height);
            // pop();
        }


        //golem
        for (let i = 0; i < game.golems.length; i++) {
            let golem = game.golems[i];
            golem.draw();
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

        // let rat = this.rats[0];
        // if (rat.x < 560) {
        //     rat.move = 2;
        // }

        // if (rat.x > 1750) {
        //     rat.move = 1;
        // }

        if (this.goal <= 0) {
            this.state = "end";
        }
        this.animator.draw();

        this.player.update();
        this.player.draw();

        pop();
        this.snow.draw();

        this.HUD.draw();
    }

    end_state() {
        this.end_state_timer += 0.5;

        if (this.player.health > 0) {
            background(100);
            fill(0, 255, 0, min(this.end_state_timer, 255));
            textSize(100);
            text('You Win!', width/2, height / 10);

            image(sprites.player_angry, 270, 120, 400, 400);

            this.confeeti.draw();

        } else { // dead screen
            background(100);
            fill(255, 0, 0, min(this.end_state_timer, 255));
            textSize(100);
            text('You Died', width/2, height / 10);

            fill(255, 0, 0, min(max(this.end_state_timer - 255, 0), 255));
            text('Try Again?', width / 2.1, height * .9);

            image(sprites.player_dead, 270, 120, 400, 400);

            this.blood.draw();

        }
    }
}

// tilemaps
var mainmenu_tilemap = [
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
    "               s                                          ",
    "  p                                                       ",
    "gggggggggggggttttgggggggggggggggggggggggggggggggggggggg   ",
];

var intro_tilemap = [
    "                                                                                        l      ",
    "                                         b                                                     ",
    "                                                                                               ",
    "                              s                            r                                   ",
    "                                       ggggggtttttttttttttttggggttttttttttgggg        ggggggggg",
    "                 p        ggggggggg    ggggggggggggggggggggggggggggggggggggggg        ggggggggg",
    "                ggggg                                                                          ",
    "                                                                                               ",
    "                                                                                               ",
    "        ggggg      b                                                                           ",
    "        ggggg                                                                             l    ",
    "                   ggggg                                                                       ",
    "                   ggggg     s                                                                 ",
    "                                                           r                                   ",
    "                           ggggggg      ggg  gggtttgggtttgggtttggtttggggggg            gggggggg",
    "                                 g      g    gggggggggggggggggggggggggggggg            gggggggg",
    "                                 g    b g                                              gggggggg",
    "                                 g      g                                              gggggggg",
    "                                 g      g                                              gggggggg",
    "                                 g    b g                                                   ggg",
    "                                 g      g                                                   ggg",
    "                                 g      g                                     r             ggg",
    "                                 g      g                          ggggggggggggggggggtt     ggg",
    "                                 g      g                          gggggggggggggggggggg     ggg",
    "                                 g      g                                     l             ggg",
    "                                                                                            ggg",
    "                         s                                                                  ggg",
    "                                                                                            ggg",
    "gggggggggggggttttggggggggggggggggggggggggggtttttttttttttttggggggggggggggggggggggggggggggggggggg"];
