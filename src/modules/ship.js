/**
 * Ship
 */
class Ship {
    constructor(length, isVertical = true) {
        this.length = length;
        this.hits = 0;
        this.isVertical = isVertical;
    }

    /**
     * Activate if the ship has been hit.
     */
    hit() {
        if (this.isSunk()) return;

        this.hits++;
    }

    /**
     * Tells whether or not the ship has been sunk.
     * @returns true if ship has no more space, otherwise false
     */
    isSunk() {
        return this.length === this.hits;
    }
}

export default Ship;
