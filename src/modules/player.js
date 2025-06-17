import Gameboard from './gameboard.js';

// Should differntiate between 'real' and 'computer' players
class Player {
    constructor(name) {
        this.board = new Gameboard();
        this.name = name;
    }
}

export default Player;
