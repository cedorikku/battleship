import { describe, expect, test } from '@jest/globals';
import Gameboard from '../src/modules/gameboard';
import Ship from '../src/modules/ship';

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

        // space is already occupied
        gb.placeShip(0, 0, 2, true); // vertical ship with 2 length
        expect(gb.placeShip(1, 0, 2, true)).toBe(-1);

        // out of bounds
        expect(gb.placeShip(-1, 11, 2, true)).toBe(-1);
        expect(gb.placeShip(5, 9, 2, false)).toBe(-1);
    });

    // TODO: Add test case to reject invalid body-tail placement

    test('Rejects placements where an adjacent ship is placed', () => {
        const gb = new Gameboard();

        gb.placeShip(0, 0, 2, true); // vertical ship with 2 length
        expect(gb.placeShip(0, 1, 3, true)).toBe(-1);

        gb.placeShip(2, 2, 3, true); // vertical ship with 3 length
        expect(gb.placeShip(3, 0, 2, false)).toBe(-1);

        gb.placeShip(6, 7, 2, true); // vertical ship with 2 length
        expect(gb.placeShip(8, 7, 2, true)).toBe(-1);
    });
});

describe('Root', () => {
    test('Finds the root of a placed ship', () => {
        const gb = new Gameboard();
        gb.placeShip(0, 0, 2, true); // vertical ship with 2 length
        expect(gb.getRoot(1, 0)).toEqual({ x: 0, y: 0 });

        gb.placeShip(3, 0, 3, true); // vertical ship with 3 length
        expect(gb.getRoot(3, 0)).toEqual({ x: 3, y: 0 });
        expect(gb.getRoot(4, 0)).toEqual({ x: 3, y: 0 });
        expect(gb.getRoot(5, 0)).toEqual({ x: 3, y: 0 });

        gb.placeShip(0, 2, 3, false); // horizontal ship with 3 length
        expect(gb.getRoot(0, 2)).toEqual({ x: 0, y: 2 });
        expect(gb.getRoot(0, 3)).toEqual({ x: 0, y: 2 });
        expect(gb.getRoot(0, 4)).toEqual({ x: 0, y: 2 });
    });
});

// TODO: Continue testing rotation methods
describe('Handles rotation correctly', () => {
    test('Rotates when there is available space', () => {
        const gb = new Gameboard();

        gb.placeShip(0, 0, 2, true); // vertical ship with 2 length
        expect(gb.rotateShip(0, 0)).toBe(0);
        expect(gb.peek(0, 1)).toEqual(gb.peek(0, 0));
        expect(gb.peek(1, 0)).toBeNull();

        gb.placeShip(3, 0, 3, true); // vertical ship with 3 length
        expect(gb.rotateShip(3, 0)).toBe(0);
        expect(gb.peek(4, 0)).toBeNull();
        expect(gb.peek(5, 0)).toBeNull();
        expect(gb.peek(3, 1, true)).toEqual(gb.peek(3, 0));
        expect(gb.peek(3, 2, true)).toEqual(gb.peek(3, 0));
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

    // TODO: a ship has been sunk
    test.skip('Recognizes a ship has been sunk', () => {
        const gb = new Gameboard();
    });
});
