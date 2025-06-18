import Config from './config.js'
import Ship from './ship.js';

/**
 * Represents the battleship gameboard of a player
 * @class
 */
class Gameboard {
    constructor() {
        this.board = [];
        this.boardSize = Config.boardSize;
        /**
         * A map to keep track of hit & missed coordinates.
         * Keys are string representations of coordinates (e.g., "x,y") and the value is an object.
         * @type {Map<string, string>}
         */
        this.tracker = new Map();

        for (let i = 0; i < this.boardSize; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i][j] = null;
            }
        }
    }

    /**
     * Adds a record for the hit and missed coordinates.
     * @param {object} coords Coordinates that missed.
     * @param {string} status Should be 'hit', 'miss', or 'intact'.
     */
    #addTracking(coords, status) {
        this.tracker.set(`${coords.x}${coords.y}`, status);
    }

    /**
     * Check status of the given coordinates.
     * @returns {string} The status.
     */
    checkState(x, y) {
        if (this.tracker.has(`${x}${y}`)) {
            return this.tracker.get(`${x}${y}`);
        }

        return 'blank';
    }

    // TODO: occupied

    /**
     * Gets the size of the board.
     * @returns {number} Returns the size of the player's board.
     */
    getBoardSize() {
        return this.boardSize;
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
            this.#addTracking({ x: x, y: y }, 'intact');
            return 0;
        }

        // occupied
        return 1;
    }

    /**
     * Handle how coords X & Y receive the attack.
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @returns {number} Returns 0 if successful, 1 if it misses, 2 if already hit, and -1 for invalid.
     */
    receiveAttack(x, y) {
        const b_size = this.getBoardSize();

        // invalid
        if (x >= b_size || x < 0 || y > b_size || y < 0) {
            return -1;
        }

        const _status = this.tracker.get(`${x}${y}`);

        // already hit or missed
        if (_status === 'hit' || _status === 'miss') return 2;

        // successful
        if (_status === 'intact') {
            this.board[x][y].hit();
            this.#addTracking({ x: x, y: y }, 'hit');
            return 0;
        }

        // mark as miss
        this.board[x][y] = 'miss';
        this.#addTracking({ x: x, y: y }, 'miss');
        return 1;
    }
}

export default Gameboard;
