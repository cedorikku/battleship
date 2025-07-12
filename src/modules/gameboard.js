import Config from './battleshipConfig.js';
import Ship from './ship.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Represents the battleship gameboard of a player
 * @class
 */
class Gameboard {
    constructor() {
        this.board = [];
        this.boardSize = Config.BOARD_SIZE;
        this.sunkenShips = 0;
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
     * Gets the size of the player's board.
     * @returns {number}
     */
    getBoardSize() {
        return this.boardSize;
    }

    /**
     * Gets the status of the square.
     * @returns {string}
     */
    getState(x, y) {
        const b_size = this.getBoardSize();
        if (x < 0 || x >= b_size || y < 0 || y >= b_size) {
            return null;
        }

        if (this.tracker.has(`${x}${y}`)) {
            return this.tracker.get(`${x}${y}`);
        }

        return 'blank';
    }

    /**
     * Gets the value of a square if it's a ship or something else.
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @returns {null|Ship} A Ship object or null
     */
    peek(x, y) {
        const b_size = this.getBoardSize();
        if (x < 0 || x >= b_size || y < 0 || y >= b_size) {
            return null;
        }

        return this.board[x][y];
    }

    /**
     * Helper function to trace the root of a part of the ship based on its square.
     * @param {string} The ship's id.
     * @returns {object|null} The set of coordinates where the root of the ship part lives.
     */
    getRoot(id) {
        const b_size = this.getBoardSize();

        for (let i = 0; i < b_size; i++) {
            for (let j = 0; j < b_size; j++) {
                const square = this.peek(i, j);

                if (square instanceof Ship) {
                    const ship = square;
                    if (ship.getId() === id) {
                        return { x: i, y: j };
                    }
                }
            }
        }

        return null;
    }

    /**
     * Rotates the ship by updating its orientation.
     * @param {string | number} - The identifier of target ship (Ship).
     * @returns {number} Operation status where 0 if rotates succesfully or -1 on fail.
     */
    rotateShip(id) {
        const root = this.getRoot(id);

        if (!root) return -1; // ship not found or does not exist

        const ship = this.peek(root.x, root.y);

        if (ship.length === 1) return -1;

        this.removeShip(id);

        const status = this.validateSquare(
            root.x,
            root.y,
            ship.length,
            !ship.isVertical,
        );

        let rotated = (status === 0) ? !ship.isVertical : ship.isVertical;
        this.placeShip(root.x, root.y, ship.length, rotated, ship.id);

        return status;
    }

    /**
     * Removes a ship from the board.
     * @param {string | number} id - The identifier of target ship (Ship).
     * @returns {number} Operation status where 0 if removed succesfully or -1 on fail.
     */
    removeShip(id) {
        const root = this.getRoot(id);

        if (!root) return -1; // ship not found or does not exist

        const ship = this.peek(root.x, root.y);

        if (ship.length === 1) return -1;

        for (let i = 0; i < ship.length; i++) {
            const next = ship.isVertical
                ? { x: root.x + i, y: root.y }
                : { x: root.x, y: root.y + i };

            this.board[next.x][next.y] = null;
            this.tracker.delete(`${next.x}${next.y}`);
        }
    }

    /**
     * Handle placing the root of the ship at a square.
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @param {number} length Length of the ship.
     * @param {boolean} isVertical Orientation of the ship. Defaults to true.
     * @param {string} id Unique identifier of the ship.
     * @returns {number} 0 if successful and -1 invalid.
     */
    placeShip(x, y, length, isVertical = true, id = uuidv4()) {
        if (length == null) {
            throw new Error(`The length of the ship is not properly supplied`);
        }

        const ship = new Ship(length, isVertical, id);
        const status = this.validateSquare(x, y, length, isVertical);

        // successful
        if (status === 0) {
            for (let i = 0; i < length; i++) {
                const _x = isVertical ? x + i : x;
                const _y = !isVertical ? y + i : y;

                this.board[_x][_y] = ship;
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
     * @returns {number} 0 if the move is valid, otherwise -1
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
                sourceY >= b_size
            ) {
                return -1;
            }

            // Checks for adjacent ships
            for (let l = -1; l < 2; l++) {
                for (let m = -1; m < 2; m++) {
                    const adjX = sourceX + l;
                    const adjY = sourceY + m;

                    // center
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

            if (this.peek(x, y).isSunk()) this.sunkenShips++;

            return 0;
        }

        // mark as miss
        this.#addTracking({ x: x, y: y }, 'miss');
        return 1;
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
     * Checks the player's loss if all ships are already sunk.
     * @returns {boolean}
     */
    isDefeated() {
        const shipCount = Object.keys(Config.variants).length;
        return this.sunkenShips === shipCount;
    }
}

export default Gameboard;
