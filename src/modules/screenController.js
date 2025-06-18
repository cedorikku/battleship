import Config from './config.js';
import Ship from './ship.js';

class ScreenController {
    constructor() { }

    /**
     * Accepts board state to figure out how to show the board
     * Creates a coords with a 2-digit string
     */
    #createBoard(boardState) {
        const board = document.createElement('div');
        board.classList.add('board');

        const b_size = Config.boardSize;

        for (let i = 0; i < b_size; i++) {
            for (let j = 0; j < b_size; j++) {
                const box = document.createElement('div');
                box.setAttribute('data-coords', `${i}${j}`);

                if (boardState) {
                    const _status = boardState.checkState(i, j);
                    box.classList.add(_status);
                }

                board.appendChild(box);
            }
        }

        return board;
    }

    #createEnemyBoard(boardState) {
        const board = document.createElement('div');
        board.classList.add('board');

        const b_size = Config.boardSize;

        for (let i = 0; i < b_size; i++) {
            for (let j = 0; j < b_size; j++) {
                const box = document.createElement('div');
                box.setAttribute('data-coords', `${i}${j}`);

                // change enemy board behavior
                if (boardState) {
                    let _status = boardState.checkState(i, j);
                    if (_status === 'intact') _status = 'blank';
                    box.classList.add(_status);
                }

                board.appendChild(box);
            }
        }

        return board;
    }

    renderBoards(player, enemy) {
        const leftSide = document.getElementById('left-side');
        const rightSide = document.getElementById('right-side');

        // clear it first, before any rendering
        leftSide.replaceChildren();
        rightSide.replaceChildren();

        if (!player) {
            // initial render
            const board1 = this.#createBoard(null);
            leftSide.appendChild(board1);
        } else {
            const board1 = this.#createBoard(player.board);
            leftSide.appendChild(board1);
        }

        if (!enemy) {
            const board2 = this.#createEnemyBoard(null);
            rightSide.appendChild(board2);
            return;
        } else {
            const board2 = this.#createEnemyBoard(enemy.board);
            rightSide.appendChild(board2);
        }
    }

    showMessage(status) {
        switch (status) {
            case 0:
                // ship was hit message
                console.log('A ship was hit')
                // is ship sunk?
                break;
            case 1:
                console.log('Attack missed')
                break;
            case 2:
                console.log('Invalid move')
                break;
        }
    }
}

export default ScreenController;
