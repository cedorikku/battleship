class Config {
    static boardSize = 10;
    static variants = Object.freeze({
        carrier: 5,
        battleship: 4,
        cruiser: 3,
        submarine: 2,
        destroyer: 2,
    });
}

export default Config;
