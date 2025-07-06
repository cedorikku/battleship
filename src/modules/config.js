class Config {
    static boardSize = 10;
    static variants = Object.freeze({
        carrier: 5,
        battleship: 4,
        cruiser: 3,
        submarine: 3,
        destroyer: 2,
    });
}

export default Config;
