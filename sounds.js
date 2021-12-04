

// class that plays all dounds all sounds
class Sounds {
    constructor() {
        // initalize private variables
        //https://www.fesliyanstudios.com/royalty-free-sound-effects-download/whoosh-and-swoosh-73
        this.player_swing = createAudio('sounds/player_swing.mp3');
        this.golem_swing = createAudio('sounds/golem_swing.wav');
        this.player_swing.volume(0.1);
        this.golem_swing.volume(0.1);
        //https://opengameart.org/content/platformer-jumping-sounds
        this.player_jump = createAudio('sounds/jump.wav');
        this.player_jump.volume(0.1);
        //https://opengameart.org/content/3-melee-sounds
        this.player_dash = createAudio('sounds/dash.mp3');
        this.player_dash.volume(0.1);
        this.player_hit = createAudio('sounds/aahhh.wav');
        this.player_hit.volume(0.1);
        this.enemy_hit = createAudio('sounds/enemy_hit.wav');
        this.enemy_hit.volume(0.01);
        this.game_over = createAudio('sounds/game_over.wav');
        this.game_over.volume(0.1);
    }
}