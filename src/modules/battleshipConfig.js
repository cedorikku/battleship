/**
 * @typedef {Object} ShipVariants
 * @property {number} CARRIER - Length of carrier ship
 * @property {number} BATTLESHIP - Length of battleship
 * @property {number} CRUISER - Length of cruiser
 * @property {number} SUBMARINE - Length of submarine
 * @property {number} DESTROYER - Length of destroyer
 */

/**
 * @typedef {Object} Orientation
 * @property {boolean} VERTICAL - Vertical orientation (true)
 * @property {boolean} HORIZONTAL - Horizontal orientation (false)
 */

/**
 * Battleship configuration constants
 * @typedef {Object} BattleshipConfig
 * @property {number} BOARD_SIZE - The size of the game board (e.g., 10 for a 10x10 grid)
 * @property {ShipVariants} SHIP_VARIANTS - Ship types and their lengths
 * @property {Orientation} ORIENTATION - Ship orientation flags
 */

/** @type {BattleshipConfig} */
const battleshipConfig = {
    BOARD_SIZE: 10,
    SHIP_VARIANTS: Object.freeze({
        CARRIER: 5,
        BATTLESHIP: 4,
        CRUISER: 3,
        SUBMARINE: 3,
        DESTROYER: 2,
    }),
    ORIENTATION: Object.freeze({
        VERTICAL: true,
        HORIZONTAL: false,
    }),
};

export default battleshipConfig;
