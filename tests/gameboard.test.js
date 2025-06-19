import { describe, expect, test } from '@jest/globals';
import Gameboard from '../src/modules/gameboard';

describe('Ship placements', () => {
    // places a ship in 0, 0
    test('Accepts free spaces', () => {
        const gb = new Gameboard();
        expect(gb.placeShip(0, 0, 2, true)).toBe(0); // vertical ship with 2 length
        expect(gb.placeShip(0, 2, 3, true)).toBe(0); // vertical ship with 3 length
        expect(gb.placeShip(0, 4, 4, true)).toBe(0); // vertical ship with 4 length
    });

    // occupied or out of bounds
    test('Rejects unavailable and invalid root placement for the ship', () => {
        const gb = new Gameboard();
        gb.placeShip(0, 0, 2, true); // vertical ship with 2 length

        // space is already occupied
        expect(gb.placeShip(0, 0, 2, true)).toBe(-1);

        // out of bounds
        expect(gb.placeShip(-1, 11, 2, true)).toBe(-1);
        expect(gb.placeShip(5, 9, 2, false)).toBe(-1);
    });

    // TODO: Add test case to reject invalid body-tail placement

    test('Rejects placements where an adjacent ship is placed', () => {
        const gb = new Gameboard();
        gb.placeShip(0, 0, 2, true); // vertical ship with 2 length

        expect(gb.placeShip(0, 1, 3, true)).toBe(-1);
    });
});

// TODO: Test rotation methods
describe('Handles rotation correctly', () => {
    test.skip('Rotates with available space', () => {
        const gb = new Gameboard();
        gb.placeShip(0, 0, 2, true); // vertical ship with 2 length

    });
});

describe('Receive ship hit', () => {
    test('Registers attack as hit', () => {
        const gb = new Gameboard();
        gb.placeShip(0, 0, 2, true); // vertical ship with 2 length

        expect(gb.receiveAttack(0, 0)).toBe(0);
        expect(gb.receiveAttack(1, 0)).toBe(0);
    });

    test('Registers attack as miss', () => {
        const gb = new Gameboard();

        gb.placeShip(0, 0, 2, true); // vertical ship with 2 length

        expect(gb.receiveAttack(0, 1)).toBe(1);
        expect(gb.receiveAttack(1, 1)).toBe(1);
    });

    test('Recognize space as already attacked', () => {
        const gb = new Gameboard();
        gb.placeShip(0, 0, 2, true); // vertical ship with 2 length
        gb.placeShip(1, 1, 3, true); // vertical ship with 3 length

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
