/**
 * Generates a random integer between 0 (inclusive)
 * and a given size (exclusive).
 *
 * @param {number} size The upper bound for the random number (exclusive).
 * Must be a positive integer.
 * @returns {number} A random integer from 0 to size - 1.
 */
export function randomInt(size) {
    if (size <= 0 || !Number.isInteger(size)) {
        console.error('Size must be a positive integer.');
        return -1;
    }

    const arr = new Uint8Array(1);
    crypto.getRandomValues(arr);

    return arr[0] % size;
}
