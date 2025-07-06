import Config from './config.js';

// TODO: Update docs
class ScreenController {
    constructor() {}

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
                let box;

                if (i === -1 || j === -1) {
                    box = document.createElement('div');
                    if (j > -1) {
                        box.textContent = `${j + 1}`;
                    } else if (i > -1) {
                        box.textContent = `${String.fromCharCode(i + 65)}`;
                    }

                    board.appendChild(box);
                    continue;
                }

                box = document.createElement('button');
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
     * @param {Player} left Player on the left side.
     * @param {Player} right Player on the right side.
     */
    renderBoards(left, right) {
        // Clears the previous game screen
        const prevScreen = document.querySelector('.game');
        if (prevScreen) prevScreen.remove();

        // Renders a new screen
        const gameScreen = document.createElement('main');
        gameScreen.classList.add('game');

        const leftSide = document.createElement('div');
        leftSide.id = 'left';
        const rightSide = document.createElement('div');
        rightSide.id = 'right';

        const board1 = this.#createBoard(left && left.board);
        const board2 = this.#createEnemyBoard(right && right.board);

        leftSide.appendChild(board1);
        rightSide.appendChild(board2);

        gameScreen.appendChild(leftSide);
        gameScreen.appendChild(rightSide);

        document.body.appendChild(gameScreen);
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

    /**
     * Shows a modal (popup) on the screen, with a close button.
     * @param {string} header
     * @param {string} message
     */
    showModal(header, message) {
        const backdrop = document.createElement('div');
        const modal = document.createElement('div');
        const modalHeader = document.createElement('h2');
        const modalText = document.createElement('div');
        const close = document.createElement('button');

        // options
        backdrop.classList.add('modal-backdrop');
        modal.classList.add('modal-content');
        modalHeader.classList.add('modal-header');

        modalHeader.textContent = header;
        modalText.textContent = message;
        close.textContent = 'close';

        // buttons
        close.addEventListener('click', () => {
            document.body.removeChild(backdrop);
        });

        // modal content
        backdrop.appendChild(modal);
        modal.appendChild(modalHeader);
        modal.appendChild(modalText);
        modal.appendChild(close);

        document.body.appendChild(backdrop);
    }

    /**
     * WIP:
     * Render main menu.
     */
    renderMenu() {
        const menu = document.createElement('div');
        menu.classList.add('menu');

        const playButton = document.createElement('button');

        playButton.id = 'playButton';
        playButton.classList.add('btn');
        playButton.textContent = 'Play with bot';

        menu.appendChild(playButton);

        document.body.appendChild(menu);
    }

    /**
     * WIP:
     * Closes the opened menu.
     */
    closeMenu() {
        const menu = document.querySelector('.menu');
        if (menu) menu.remove();
    }
}

export default ScreenController;
