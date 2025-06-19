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
     * Gets the status of the square.
     * @returns {string}
     */
    getState(x, y) {
        if (this.tracker.has(`${x}${y}`)) {
            return this.tracker.get(`${x}${y}`);
        }

        return 'blank';
    }

    /**
     * Gets the size of the player's board.
     * @returns {number}
     */
    getBoardSize() {
        return this.boardSize;
    }

    /**
     * Handle placing the root of the ship at a square.
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @param {number} length Length of the ship.
     * @param {boolean} isVertical Orientation of the ship. Defaults to true.
     * @returns {number} 0 if successful and -1 invalid.
     */
    placeShip(x, y, length, isVertical = true) {
        if (length == null) {
            throw new Error(
                `The length of the ship is not properly supplied`,
            );
        }

        const status = this.validateSquare(x, y, length, isVertical);

        // successful
        if (status === 0) {
            for (let i = 0; i < length; i++) {
                const _x = isVertical ? x + i : x;
                const _y = !isVertical ? y + i : y;

                this.board[_x][_y] = new Ship(length, isVertical);
                this.#addTracking({ x: _x, y: _y }, 'intact');
            }
        }

        return status;
    }

    /**
     * Validates a square to check its availability and looks for problems in adjacent squares.
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @param {number} length Length of the ship to be validated.
     * @param {boolean} isVertical Orientation of the ship.
     */
    validateSquare(x, y, length, isVertical) {
        const b_size = this.getBoardSize();

        for (let i = 0; i < length; i++) {
            const sourceX = isVertical ? x + i : x;
            const sourceY = !isVertical ? y + i : y;

            // out of bounds
            if (
                sourceX < 0 ||
                sourceX >= b_size ||
                sourceY < 0 ||
                sourceY >= b_size ||
                this.peek(sourceX, sourceY)
            ) {
                return -1;
            }

            // Checks for adjacent ships
            for (let l = -1; l < 2; l++) {
                for (let m = -1; m < 2; m++) {
                    const adjX = sourceX + l;
                    const adjY = sourceY + m;
                    // center
                    if (adjX < 0 || adjX >= b_size || adjY < 0 || adjY >= b_size)
                        continue;

                    if (adjX === sourceX && adjY === sourceY) continue;

                    if (this.peek(adjX, adjY)) {
                        return -1;
                    }
                }
            }
        }

        return 0;
    }

    /**
     * Gets the value of a square is a ship or something else.
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @returns {null|object} A Ship object or null
     */
    peek(x, y) {
        return this.board[x][y];
    }

    /**
     * Handle a square receives the attack.
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @returns {number} Returns 0 if successful, 1 if it misses, 2 if already hit, and -1 for invalid.
     */
    receiveAttack(x, y) {
        const b_size = this.getBoardSize();

        // invalid
        if (x >= b_size || x < 0 || y >= b_size || y < 0) {
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
