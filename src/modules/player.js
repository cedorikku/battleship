import Gameboard from './gameboard.js';

// Should differntiate between 'real' and 'computer' players
class Player {
    constructor(name, isBot) {
        this.board = new Gameboard();
        this.name = name;
        this.isBot = isBot; 
    }
}

export default Player;
