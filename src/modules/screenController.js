import Player from './player.js';
import GameController from './gameController.js';
import Config from './battleshipConfig.js';

// TODO: Check and update docs if needed

class ScreenController {
    constructor() {
        /**
         * Game controller, to keep perform game related controls and keep track of game state.
         * Is randomized a initialization.
         * @type {GameController} gameController
         */
        this._gameController = new GameController();
        this.handleBoxClick = this.handleBoxClick.bind(this);
        this.handleStartGameClick = this.handleStartGameClick.bind(this);
    }

    /**
     * Gets the game controller for the screen.
     * @param {GameController} controller
     */
    get gameController() {
        return this._gameController;
    }

    /**
     * Sets the game controller for the screen.
     * @param {GameController} controller
     */
    set gameController(controller) {
        this._gameController = controller;
    }

    /**
     * Handles rendering current enemy players' board in the DOM.
     * Accepts board state to figure out how to show the board.
     * Creates each box with coords having a 2-digit string.
     *
     * @param {Gameboard} currentBoard Contains the current player's gameboard.
     * @returns {Element} A decorated grid for the current player.
     */
    #createBoard(currentBoard) {
        const board = document.createElement('div');
        board.classList.add('board');

        const b_size = Config.BOARD_SIZE;

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
     * @param {Gameboard} currentBoard Contains the current enemy's gameboard.
     * @returns {Element} A decorated grid for the current enemy.
     */
    #createEnemyBoard(currentBoard) {
        const board = document.createElement('div');
        board.classList.add('board');

        const b_size = Config.BOARD_SIZE;

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
                box.setAttribute('data-coords', `${i}${j}`);

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

        if (this.gameController.enemyPlayer) {
            board.id = 'enemy';
            board.addEventListener('click', this.handleBoxClick);
        }

        return board;
    }

    /**
     * Handles player moves against the enemy.
     */
    handleBoxClick(e) {
        if (e.target.hasAttribute('data-coords')) {
            const coords = e.target.getAttribute('data-coords').split('');

            const moveStatus =
                this.gameController.enemyPlayer.board.receiveAttack(
                    coords[0],
                    coords[1],
                );

            // clicked square is already hit, do nothing
            if (moveStatus === 2) return;

            const moveResult = this.gameController.handleMove(moveStatus);

            switch (moveResult) {
                case 1:
                    this.renderBoards();
                    this.showModal(
                        'Game Over',
                        `${this.gameController.activePlayer.name} wins`,
                    );
                    document
                        .getElementById('enemy')
                        .removeEventListener('click', this.handleBoxClick);

                    // show some more feedback, and a start new game screen
                    break;
                default:
                    this.renderBoards();
            }
        }
    }

    /**
     * Handles rendering ender both players' boards in the DOM.
     */
    renderBoards() {
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

        const playerOne = this.gameController
            ? this.gameController.playerOne
            : null;
        const playerTwo = this.gameController
            ? this.gameController.playerTwo
            : null;

        const board1 = this.#createBoard(playerOne && playerOne.board);
        const board2 = this.#createEnemyBoard(playerTwo && playerTwo.board);

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
        playButton.addEventListener('click', () =>
            this.handleStartGameClick('bot'),
        );

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

    /**
     * Triggers the start of a game.
     * Considers the decision whether or not to start with a bot.
     * @param {string} mode It is set to 'bot' by default, or something else in the future.
     */
    handleStartGameClick(mode = 'bot') {
        this.closeMenu();

        switch (mode) {
            case 'bot':
                // TODO: Should randomize later
                const playerTwo = new Player('Computer', true);
                GameController.populateBoard(playerTwo.board);
                this.gameController.playerTwo = playerTwo;
                break;
            default:
                console.error('Unimplemented feature');
                throw new Error();
        }

        this.gameController.startGame();
        this.renderBoards();
    }
}

export default ScreenController;
