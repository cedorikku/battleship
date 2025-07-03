import Config from './config.js';

class ScreenController {
    constructor() { }

    /**
     * Handles rendering current enemy players' board in the DOM.
     * Accepts board state to figure out how to show the board.
     * Creates each box with coords having a 2-digit string.
     *
     * @param {object} currentBoard Contains the current player's gameboard.
     * @returns {Element} A decorated grid for the current player.
     */
    #createBoard(currentBoard) {
        const board = document.createElement('div');
        board.classList.add('board');

        const b_size = Config.boardSize;

        for (let i = -1; i < b_size; i++) {
            for (let j = -1; j < b_size; j++) {
                const box = document.createElement('div');

                if (i === -1 && j === -1) {
                    board.appendChild(box);
                    continue;
                } else if (i === -1 && j > -1) {
                    box.textContent = `${j + 1}`;
                    board.appendChild(box);
                    continue;
                } else if (j === -1 && i > -1) {
                    box.textContent = `${String.fromCharCode(i + 65)} `;
                    board.appendChild(box);
                    continue;
                }

                box.setAttribute('data-coords', `${i}${j} `);

                if (currentBoard) {
                    const _status = currentBoard.getState(i, j);
                    box.classList.add(_status);

                    const _shipExists = currentBoard.peek(i, j);
                    if (_shipExists) {
                        box.setAttribute(
                            'data-id',
                            currentBoard.peek(i, j).getId(),
                        );
                    }
                }

                board.appendChild(box);
            }
        }

        return board;
    }

    /**
     * Handles rendering current enemy players' board in the DOM.
     * Accepts board state to figure out how to show the board.
     * Creates each box with coords having a 2-digit string.
     *
     * @param {object} currentBoard Contains the current enemy's gameboard.
     * @returns {Element} A decorated grid for the current enemy.
     */
    #createEnemyBoard(currentBoard) {
        const board = document.createElement('div');
        board.classList.add('board');

        const b_size = Config.boardSize;

        for (let i = -1; i < b_size; i++) {
            for (let j = -1; j < b_size; j++) {
                const box = document.createElement('button');

                if (i === -1 && j === -1) {
                    board.appendChild(box);
                    continue;
                } else if (i === -1 && j > -1) {
                    box.textContent = `${j + 1}`;
                    board.appendChild(box);
                    continue;
                } else if (j === -1 && i > -1) {
                    box.textContent = `${String.fromCharCode(i + 65)} `;
                    board.appendChild(box);
                    continue;
                }

                box.setAttribute('data-coords', `${i}${j} `);

                // change enemy board behavior
                if (currentBoard) {
                    let status = currentBoard.getState(i, j);
                    if (status === 'miss' || status === 'hit')
                        box.disabled = true;
                    if (status === 'intact') status = 'blank';
                    box.classList.add(status);
                }

                board.appendChild(box);
            }
        }

        return board;
    }

    /**
     * Handles rendering ender both players' boards in the DOM
     * @param {Player} player Current player of the turn.
     * @param {Player} enemy Current enemy of the turn.
     */
    renderBoards(player, enemy) {
        const playerSide = document.getElementById('player-side');
        const enemySide = document.getElementById('enemy-side');

        // clear it first, before any rendering
        playerSide.replaceChildren();
        enemySide.replaceChildren();

        const board1 = this.#createBoard(player && player.board);
        playerSide.appendChild(board1);

        const board2 = this.#createEnemyBoard(enemy && enemy.board);
        enemySide.appendChild(board2);
    }

    /* TODO: Show an output in the DOM depending on what status is received. */
    /* NOTE: Possible to have it more creative than just showing a message  */
    showMessage(status) {
        switch (status) {
            case 0:
                // ship was hit message
                console.log('A ship was hit');
                break;
            case 1:
                console.log('Attack missed');
                break;
            case 2:
                console.log('Invalid move');
                break;
        }
    }
}

export default ScreenController;
