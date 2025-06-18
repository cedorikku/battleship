import Config from './config.js';
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

    /**
     * Gets the size of the board.
     * @returns {number} Returns the size of the player's board.
     */
    getBoardSize() {
        return this.boardSize;
    }

    /**
     * Handle placing the root of the ship at coord x & y.
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     * @param {number} length Length of the ship.
     * @param {boolean} isVertical Orientation of the ship.
     * @returns {number} Returns 0 if successful and -1 invalid.
     */
    placeShip(x, y, length, isVertical) {
        if (length == null || isVertical == null) {
            throw new Error(`Ship is not properly supplied ship ${length == null ? 'length' : 'orientation' }`);
        }

        const ship = new Ship(length, true);

        const status = this.validateMove(x, y, ship);

        // successful
        if (status === 0) {
            for (let i = 0; i <= length; i++) {
                const _x = isVertical ? x + i : x;
                const _y = !isVertical ? y + i : y;

                this.board[_x][_y] = ship;
                this.#addTracking({ x: _x, y: _y }, 'intact');
            }
        }

        return status;
    }

    validateMove(x, y, ship) {
        // FIX: length null invalid
        const b_size = this.getBoardSize();

        for (let i = 0; i < ship.length; i++) {
            const _x = ship.isVertical ? x + i : x;
            const _y = !ship.isVertical ? y + i : y;

            if (_x >= b_size || _x < 0 || _y > b_size || _y < 0 || this.board[_x][_y]) {
                return -1;
            }
        }

        return 0;
    }

    // TODO: Rotate ship

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
