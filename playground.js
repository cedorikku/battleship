import { randomInt } from './src/modules/utils.js';
import Gameboard from './src/modules/gameboard.js';
import Ship from './src/modules/ship.js';

const gb = new Gameboard();

gb.placeShip(0, 1, 4, true, 'ship1'); // vertical ship with 2 length

// const square = this.peek(result.x, result.y);
//
// if (!(square instanceof Ship)) return null;
//
// let curr = { x: x, y: y };
// let ship = square;
//
// for (let i = 0; i <= ship.length; i++) {
//     const prev = ship.isVertical
//         ? { x: x - i, y: y }
//         : { x: x, y: y - i };
//
//     const prevSquare = this.peek(prev.x, prev.y);
//
//     if (prevSquare instanceof Ship) {
//         const prevShip = prevSquare;
//
//         if (prevShip.getId() === ship.getId()) {
//             curr = prev;
//             continue;
//         }
//     }
//
//     return curr;
// }

let result;
const x = gb.board.findIndex((row) =>
    row.filter((square) => {
        if (square instanceof Ship) {
            return square.getId() === 'ship1';
        }
    }),
);

const y = gb.board[x].findIndex((col) => {
    if (col instanceof Ship) {
        return col.getId() === 'ship1';
    }
});

result = { x: x, y: y };

console.log(result);
