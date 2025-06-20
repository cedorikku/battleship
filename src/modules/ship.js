/**
 * Ship
 */
class Ship {
    /**
     * Creates an instance of Ship.
     * @param {number} length The length of the ship.
     * @param {boolean} isVertical Orientation of the ship.
     * @param {string} id Unique identifier of the ship.
     */
    constructor(length, isVertical, id) {
        this.hits = 0;
        this.length = length;
        this.isVertical = isVertical;
        this.id = id;
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

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }
}

export default Ship;
