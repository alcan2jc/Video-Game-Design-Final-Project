
//HUD class for player health. 
class HUD {
    constructor() {
    }

    //draws HUD
    draw() {
        // player health
        fill(255, 0, 0);
        rect(10, 10, game.player.health * 2, 50);

        fill(255);
        text('Health: ' + str(game.player.health) + '%', 110, 35);
    }
}