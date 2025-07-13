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
        this._id = id;
        this._hits = 0;
        this._length = length;
        this.isVertical = isVertical;
    }

    /**
     * @returns The id of the ship.
     */
    get id() {
        return this._id;
    }

    /**
     * Sets the value of ship id.
     * @param {string | number} id The identifier of the ship.
     */
    set id(id) {
        this._id = id;
    }

    /**
     * @returns How many times ship has been hit.
     */
    get hits() {
        return this._hits;
    }

    /**
     * Sets the value of hits.
     * @param {number} hits - How many times ship has been hit.
     */
    set hits(hits) {
        this._hits = hits;
    }

    /**
     * @returns The length of the ship.
     */
    get length() {
        return this._length;
    }

    /**
     * Sets the value of ship length.
     * @param {number} length The length of the ship.
     */
    set length(length) {
        this._length = length;
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
