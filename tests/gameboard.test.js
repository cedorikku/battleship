import { describe, expect, test } from '@jest/globals';
import Gameboard from '../src/modules/gameboard';

describe('Ship placements', () => {
    // places a ship in 0, 0
    test('Accepts free space', () => {
        const gb = new Gameboard();
        expect(gb.placeShip(0, 0)).toBe(0);
    });

    // places another ship in 0, 0
    test('Rejects occupied space', () => {
        const gb = new Gameboard();
        gb.placeShip(0, 0);
        expect(gb.placeShip(0, 0)).toBe(1);
    });

    // out of bounds
    test('Rejects space that is obviously out of bounds', () => {
        const gb = new Gameboard();
        expect(gb.placeShip(-1, 11)).toBe(-1);
    });

    // TODO ship isn't the right size
});

describe('Receive ship hit', () => {
    test('Registers attack as hit', () => {
        const gb = new Gameboard();
        gb.placeShip(0, 0);

        expect(gb.receiveAttack(0, 0)).toBe(0);
    });

    test('Registers attack as miss', () => {
        const gb = new Gameboard();
        gb.placeShip(0, 0);

        expect(gb.receiveAttack(1, 1)).toBe(1);
    });

    test('Recognize space as already attacked', () => {
        const gb = new Gameboard();
        gb.placeShip(0, 0);
        gb.placeShip(1, 1);
        gb.receiveAttack(0, 0);
        gb.receiveAttack(1, 1);

        expect(gb.receiveAttack(0, 0)).toBe(2);
        expect(gb.receiveAttack(1, 1)).toBe(2);
    });

    test('Rejects invalid spaces that are out of bounds', () => {
        const gb = new Gameboard();

        expect(gb.receiveAttack(0, -1)).toBe(-1);
        expect(gb.receiveAttack(10, 10)).toBe(-1);
    });

    // TODO a ship has been sunk
});
