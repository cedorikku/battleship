import { describe, expect, test } from '@jest/globals';
import Gameboard from '../src/modules/gameboard';
import Config from '../src/modules/battleshipConfig';

const VERTICAL = Config.ORIENTATION.VERTICAL;
const HORIZONTAL = Config.ORIENTATION.HORIZONTAL;
const { BATTLESHIP, CRUISER, SUBMARINE, DESTROYER } = Config.SHIP_VARIANTS;

describe('Ship placements', () => {
    test.skip('Accepts free spaces', () => {
        const gb = new Gameboard();

        gb.placeShip(0, 0, DESTROYER, VERTICAL, 'ship1');
        expect(gb.peek(0, 0).id).toBe('ship1');
        expect(gb.peek(0, 1).id).toBe('ship1');
    });

    test('Rejects unavailable and invalid root placement for the ship', () => {
        const gb = new Gameboard();

        // space is already occupied
        gb.placeShip(0, 0, DESTROYER, VERTICAL, 'ship1');
        expect(gb.placeShip(1, 0, DESTROYER, VERTICAL, 'ship2')).toBe(-1);
        expect(gb.peek(0, 1)).not.toBe('ship2');

        // out of bounds
        expect(gb.placeShip(-1, 11, DESTROYER, VERTICAL)).toBe(-1);
        expect(gb.placeShip(5, 9, CRUISER, HORIZONTAL)).toBe(-1);
    });

    test('Rejects placements where there is insufficient space', () => {
        const gb = new Gameboard();

        expect(gb.placeShip(9, 0, DESTROYER, VERTICAL)).toBe(-1);
        expect(gb.peek(9, 0)).toBeNull();

        expect(gb.placeShip(0, 8, CRUISER, HORIZONTAL)).toBe(-1);
        expect(gb.peek(0, 8)).toBeNull();
    });

    test('Rejects placements where an adjacent ship is placed', () => {
        const gb = new Gameboard();

        const startA = 0;
        gb.placeShip(startA, 0, DESTROYER, VERTICAL, 'ship1');
        expect(gb.placeShip(startA + 1, 1, DESTROYER, VERTICAL, 'ship2')).toBe(
            -1,
        );
        expect(gb.peek(startA + 1, 1)).toBeNull();

        const startB = 2;
        gb.placeShip(startB, 2, CRUISER, VERTICAL, 'ship3');
        expect(gb.placeShip(startB + 1, 3, CRUISER, VERTICAL, 'ship4')).toBe(
            -1,
        );
        expect(gb.peek(startB + 1, 3)).toBeNull();
    });
});

describe('Handles getting the root position of a ship correctly', () => {
    test('Finds the root of a placed ship', () => {
        const gb = new Gameboard();
        gb.placeShip(0, 0, DESTROYER, VERTICAL, 'ship1');
        expect(gb.getRoot('ship1')).toEqual({ x: 0, y: 0 });

        gb.placeShip(3, 0, CRUISER, VERTICAL, 'ship2');
        expect(gb.getRoot('ship2')).toEqual({ x: 3, y: 0 });

        gb.placeShip(0, 2, SUBMARINE, HORIZONTAL, 'ship3');
        expect(gb.getRoot('ship3')).toEqual({ x: 0, y: 2 });
    });

    test('Returns null when the ship supplied does not exist', () => {
        const gb = new Gameboard();
        expect(gb.getRoot('ghost-ship')).toBeNull();
    });
});

describe('Handles ship removal', () => {
    const gb = new Gameboard();

    gb.placeShip(0, 0, BATTLESHIP, VERTICAL, 'ship1');
    expect(gb.removeShip('ship1')).toBe(0);

    const startY = 0;
    for (let i = 0; i < BATTLESHIP; i++)
        expect(gb.peek(0, startY + i)).toBeNull();
});

describe('Handles rotation correctly', () => {
    test('Rotates when there is available space', () => {
        const gb = new Gameboard();

        gb.placeShip(0, 0, DESTROYER, VERTICAL, 'ship1');
        expect(gb.rotateShip('ship1')).toBe(0);
        expect(gb.peek(0, 1)).toEqual(gb.peek(0, 0));
        expect(gb.peek(1, 0)).toBeNull();

        const startX = 3;
        gb.placeShip(startX, 0, CRUISER, VERTICAL, 'ship2');
        expect(gb.rotateShip('ship2')).toBe(0);
        expect(gb.peek(startX + 1, 0)).toBeNull();
        expect(gb.peek(startX + 2, 0)).toBeNull();
        expect(gb.peek(startX, 1)).toEqual(gb.peek(3, 0));
        expect(gb.peek(startX, 2)).toEqual(gb.peek(3, 0));
    });

    test('Does not rotate ship when it does not have space or is blocked by another ship', () => {
        const gb = new Gameboard();

        // blocked
        gb.placeShip(0, 0, CRUISER, VERTICAL, 'ship1');
        gb.placeShip(0, 2, BATTLESHIP, VERTICAL, 'ship2');
        expect(gb.rotateShip('ship1')).toBe(-1);
        expect(gb.peek(0, 2).id).toBe('ship2');
        expect(gb.peek(0, 3)).toBeNull();

        // no space left
        gb.placeShip(9, 0, SUBMARINE, HORIZONTAL, 'ship3');
        expect(gb.rotateShip('ship3')).toBe(-1);
        expect(gb.peek(9, 1).id).toBe('ship3');
    });

    test('Does not rotate anything when the ship supplied does not exist', () => {
        const gb = new Gameboard();
        expect(gb.rotateShip('ghost-ship')).toBe(-1);
    });
});

describe.skip('Handles ship hit correctly', () => {
    test('Registers attack as hit', () => {
        const gb = new Gameboard();
        gb.placeShip(0, 0, DESTROYER, VERTICAL);

        expect(gb.receiveAttack(0, 0)).toBe(0);
        expect(gb.peek(0, 0).hits).toBe(1);
        expect(gb.getState(0, 0).hits).toBe('hit');

        expect(gb.receiveAttack(1, 0)).toBe(0);
        expect(gb.peek(1, 0).hits).toBe(2);
        expect(gb.getState(1, 0).hits).toBe('hit');
    });

    test('Registers attack as miss', () => {
        const gb = new Gameboard();

        gb.placeShip(0, 0, DESTROYER, VERTICAL);

        expect(gb.receiveAttack(0, 1)).toBe(1);
        expect(gb.getState(0, 1).hits).toBe('miss');

        expect(gb.receiveAttack(1, 1)).toBe(1);
        expect(gb.getState(1, 1).hits).toBe('miss');
    });

    test('Recognizes space as already attacked', () => {
        const gb = new Gameboard();
        gb.placeShip(0, 0, DESTROYER, VERTICAL);
        gb.placeShip(1, 1, CRUISER, VERTICAL);

        gb.receiveAttack(0, 0);
        expect(gb.getState(0, 0).hits).toBe('hit');
        expect(gb.receiveAttack(0, 0)).toBe(2);

        gb.receiveAttack(1, 1);
        expect(gb.getState(1, 1).hits).toBe('hit');
        expect(gb.receiveAttack(1, 1)).toBe(2);
    });

    test('Rejects attacking an invalid space', () => {
        const gb = new Gameboard();

        expect(gb.receiveAttack(0, -1)).toBe(-1);
        expect(gb.receiveAttack(10, 10)).toBe(-1);
    });

    test('Recognizes a ship has been sunk', () => {
        const gb = new Gameboard();

        gb.placeShip(0, 0, DESTROYER, VERTICAL);

        gb.receiveAttack(0, 0);
        expect(gb.peek(0, 0).isSunk()).toBe(false);
        gb.receiveAttack(1, 0);
        expect(gb.peek(0, 0).isSunk()).toBe(true);
    });
});
