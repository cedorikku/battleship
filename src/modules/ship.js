/**
 * Ship
 */
class Ship {
    constructor(length, isVertical) {
        this.length = length;
        this.isVertical = isVertical;
        this.hits = 0;
    }

    /**
     * @returns How many times ship has been hit.
     */
    getHits() {
        return this.hits;
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
