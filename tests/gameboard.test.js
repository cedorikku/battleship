import { describe, expect, test } from '@jest/globals';
import Gameboard from '../src/modules/gameboard';

describe('Ship placements', () => {
    const gb = new Gameboard();

    // places a ship in 0, 0
    test('Accepts free space', () => {
        expect(gb.placeShip(0, 0)).toBe(0);
    });

    // places another ship in 0, 0
    test('Rejects occupied space', () => {
        expect(gb.placeShip(0, 0)).toBe(1);
    });

    // out of bounds
    test('Rejects space that is obviously out of bounds', () => {
        expect(gb.placeShip(-1, 11)).toBe(-1);
    });

    // ship isn't the right size
});
