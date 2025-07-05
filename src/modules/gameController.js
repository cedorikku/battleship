import Player from './player.js';
import Config from './config.js';
import ScreenController from './screenController.js';
import { randomInt } from './utils.js';

// TODO: Update docs

class GameController {
    constructor() {
        this.currentPlayer = null;
        this.currentEnemy = null;
        this.screen = new ScreenController();
    }

    /**
     * WIP
     * Loads the main menu without starting the game.
     */
    loadMenu() {
        this.screen.renderBoards();
    }

    /** WIP Starts the game. */
    startGame() {
        const playerOne = new Player('Player 1', false);
        this.#populateBoard(playerOne.board);

        const playerTwo = new Player('Computer', true);
        this.#populateBoard(playerTwo.board);

        // start the round with playerOne
        this.updatePlayers(playerOne, playerTwo);
        this.playRound();
    }

    /**
     * Sets the current player
     * @param {Player} current
     * @param {Player} enemy
     */
    updatePlayers(current, enemy) {
        this.currentPlayer = current;
        this.currentEnemy = enemy;
    }

    /**
     * For randomly populating the board.
     * @param {GameBoard} Players' board.
     */
    randomizeBoard(board) {
        // four ships

        for (let key in Config.variants) {
            let status = -1;
            do {
                const x = randomInt(Config.boardSize);
                const y = randomInt(Config.boardSize);
                const length = Config.variants[key];
                const isVertical = randomInt(2) === 0 ? true : false;

                status = board.placeShip(x, y, length, isVertical, key);
            } while (status !== 0);
        }
    }

    /**
     * For arbitrarily populating the board.
     * @param {GameBoard} Players' board.
     */
    #populateBoard(board) {
        let y = 0;
        for (let [key, value] of Object.entries(Config.variants)) {
            const x = 0;
            const length = value;
            const isVertical = true;

            board.placeShip(x, y, length, isVertical, key);
            y += 2;
        }
    }

    /**
     * TODO: DOCS: play round
     */
    playRound() {
        // TODO: replace with a real message later
        console.log(`${this.currentPlayer.name}'s turn`);
        this.screen.renderBoards(this.currentPlayer, this.currentEnemy);

        // bot player
        if (this.currentPlayer.isBot) {
            // bot keeps going until valid
            let moveResult;
            do {
                const x = randomInt(Config.boardSize);
                const y = randomInt(Config.boardSize);

                moveResult = this.currentEnemy.board.receiveAttack(x, y);
            } while (moveResult === -1 || moveResult === 2);

            this.handleMove(moveResult);
        }

        document
            .querySelector('#right > .board')
            .addEventListener('click', (e) => {
                if (e.target.hasAttribute('data-coords')) {
                    const coords = e.target
                        .getAttribute('data-coords')
                        .split('');

                    const moveResult = this.currentEnemy.board.receiveAttack(
                        coords[0],
                        coords[1],
                    );

                    // clicked square is already hit, do nothing
                    if (moveResult === 2) return;

                    this.handleMove(moveResult);
                }
            });
    }

    /**
     * Handles what to do after a successful move by the player.
     * Shows a feedback on the screen.
     * Checks if all ship is sunk.
     * @param {number} moveResult
     */
    handleMove(moveResult) {
        // show user feedback
        this.screen.showMessage(moveResult);
        this.screen.renderBoards(this.currentPlayer, this.currentEnemy);

        if (moveResult === 0) {
            // check if ship is sunk
            if (this.currentEnemy.board.isDefeated()) {
                // game over
                this.screen.showModal(
                    'Game Over',
                    `${this.currentPlayer.name} wins`,
                );

                // TODO: after game finishes, show an option for rematch, or something else
                return;
            }
        }

        // HACK: play next round automatically for now
        // if (this.currentPlayer.isBot)
        this.updatePlayers(this.currentEnemy, this.currentPlayer);
        this.playRound();
        return;
    }
}

export default GameController;
