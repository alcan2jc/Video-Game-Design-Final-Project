

// class that plays all dounds all sounds
class Sounds {
    constructor() {
        // initalize private variables

        //https://www.fesliyanstudios.com/royalty-free-sound-effects-download/whoosh-and-swoosh-73
        this.player_swing = createAudio('sounds/woosh.mp3');
        this.golem_swing = createAudio('sounds/woosh.mp3');
        this.player_swing.volume(0.1);
        this.golem_swing.volume(0.3);
        //https://opengameart.org/content/platformer-jumping-sounds
        this.player_jump = createAudio('sounds/jump.wav');
        this.player_jump.volume(0.1);
    }

    player_dash() {

    }
}