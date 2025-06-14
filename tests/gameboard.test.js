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

    // TODO ship isn't the right size
});

describe('Receive ship hit', () => {
    const gb = new Gameboard();
    gb.placeShip(0, 0);

    test('Registers attack as hit', () => {
        expect(gb.receiveAttack(0, 0)).toBe(0);
    });

    test('Registers attack as miss', () => {
        expect(gb.receiveAttack(1, 1)).toBe(1);
    });

    test('Recognize space as already attacked', () => {
        expect(gb.receiveAttack(0, 0)).toBe(2);
        expect(gb.receiveAttack(1, 1)).toBe(2);
    });

    test('Rejects invalid spaces that are out of bounds', () => {
        expect(gb.receiveAttack(0, -1)).toBe(-1);
        expect(gb.receiveAttack(10, 10)).toBe(-1);
    });

    // TODO a ship has been sunk
});
