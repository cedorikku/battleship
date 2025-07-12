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
