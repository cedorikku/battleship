// import { v4 as uuidv4 } from 'uuid';
/**
 * Ship
 */
class Ship {
    constructor(length, isVertical, id = crypto.randomUUID()) {
        this.id = id;
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

    /**
     * Tells the unique name of the ship
     */
    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }
}

export default Ship;
