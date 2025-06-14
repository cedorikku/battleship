import Ship from './ship';

class Gameboard {
    constructor() {
        this.BOARD_SIZE = 10;
        this.board = [];

        for (let i = 0; i < this.BOARD_SIZE; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                this.board[i][j] = null;
            }
        }
    }

    /**
     *
     * Gets the size of the board.
     */
    getBoardSize() {
        return this.BOARD_SIZE;
    }

    /**
     *
     * Handle placing the root of the ship at coord x & y.
     *
     * @param {Number} length length of the ship.
     * @param {Number} x x coordinate.
     * @param {Number} y y coordinate.
     * @returns {Number} Returns 0 if successful, 1 if occupied and -1 invalid.
     */
    placeShip(x, y, length = 1) {
        const ship = new Ship(length);
        const b_size = this.getBoardSize();

        // invalid
        if (x >= b_size || (x < 0 && y > b_size) || y < 0) {
            return -1;
        }

        // successful
        if (!this.board[x][y]) {
            this.board[x][y] = ship;
            return 0;
        }

        // occupied
        return 1;
    }

    /**
     *
     * Handle how coords x & y receive the attack.
     *
     * @param {Number} x x coordinate.
     * @param {Number} y y coordinate.
     * @returns {Number} Returns 0 if successful, 1 miss, and -1 for invalid.
     */
    receiveAttack(x, y) {
        if (this.board[x][y].isHit) return -1;

        if (!this.board[x][y] && this.board[x][y] instanceof Ship) {
            this.board[x][y].hit();
            this.board[x][y].isHit = true;
            return 0;
        }

        // mark as miss
        this.board[x][y].isHit = false;
        return 1;
    }
}

export default Gameboard;
