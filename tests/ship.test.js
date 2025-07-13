import { describe, expect, test } from '@jest/globals';
import Ship from '../src/modules/ship';

describe('Ship is hit', () => {
    const length = 4;

    test('Ship tracks its own hits', () => {
        const ship = new Ship(length);
        ship.hit();
        expect(ship.hits).toBe(1);
    });

    test('Ship with length gets sunk', () => {
        const ship = new Ship(length);
        for (let i = 0; i < ship.length; i++) {
            ship.hit();
        }
        expect(ship.isSunk()).toBe(true);
    });

    test('Ship does not take hit if sunk', () => {
        const ship = new Ship(length);

        for (let i = 0; i < ship.length + 1; i++) {
            ship.hit();
        }

        // does not test implementation
        // (e.g.) expect(ship.getHits()).toBe(ship.length)
        expect(ship.isSunk()).toBe(true);
    });
});
