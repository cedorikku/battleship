import Ship from './ship';

/**
 * Represents the battleship gameboard of a player
 * @class
 */
class Gameboard {
    constructor() {
        this.BOARD_SIZE = 10;
        this.board = [];
        /**
         * A map to keep track of hit & missed coordinates.
         * Keys are string representations of coordinates (e.g., "x,y") and the value is an object.
         * @type {Map<string, string>}
         */
        this.tracker = new Map();

        for (let i = 0; i < this.BOARD_SIZE; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                this.board[i][j] = null;
            }
        }
    }

    /**
     *
     * Adds a record of the missed coordinates.
     * @param coords {object} Coordinates that missed.
     */
    #addTracking(coords, status) {
        this.tracker.set(`${coords.x}${coords.y}`, status);
    }

    /**
     * Gets the size of the board.
     * @returns {number} Returns the size of the player's board.
     */
    getBoardSize() {
        return this.BOARD_SIZE;
    }

    /**
     * Handle placing the root of the ship at coord x & y.
     * @param {number} length length of the ship.
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     * @returns {number} Returns 0 if successful, 1 if occupied and -1 invalid.
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
     * Handle how coords X & Y receive the attack.
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @returns {number} Returns 0 if successful, 1 if it misses, 2 if was already hit, and -1 for invalid.
     */
    receiveAttack(x, y) {
        const b_size = this.getBoardSize();

        // invalid
        if (x >= b_size || x < 0 || y > b_size || y < 0) {
            return -1;
        }

        // already hit or missed
        if (this.tracker.has(`${x}${y}`)) return 2;

        if (this.board[x][y] && this.board[x][y] instanceof Ship) {
            this.board[x][y].hit();
            this.#addTracking({ x: x, y: y }, 'hit');

            // TODO handle whether the ship is sunk or not

            return 0;
        }

        // mark as miss
        this.board[x][y] = 'miss';
        this.#addTracking({ x: x, y: y }, 'miss');
        return 1;
    }
}

export default Gameboard;
