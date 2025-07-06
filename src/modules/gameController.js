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
     * Gets the current player of the turn
     * @returns {Player}
     */
    get activePlayer() {
        return this.currentPlayer;
    }

    /**
     * Gets the current enemy player of the turn
     * @param {Player}
     */
    get enemyPlayer() {
        return this.currentEnemy;
    }

    /**
     * Sets the current player of the turn
     * @param {Player}
     */
    set activePlayer(player) {
        this.currentPlayer = player;
    }

    /**
     * Sets the current enemy player of the turn
     * @returns {Player}
     */
    set enemyPlayer(player) {
        this.currentEnemy = player;
    }

    /**
     * Sets the current player
     * @param {Player} active
     * @param {Player} enemy
     */
    updatePlayers(active, enemy) {
        this.activePlayer = active;
        this.enemyPlayer = enemy;
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
    populateBoard(board) {
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
        console.log(`${this.activePlayer.name}'s turn`);
        this.screen.renderBoards(this.activePlayer, this.enemyPlayer);

        // bot player
        if (this.activePlayer.isBot) {
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
        this.screen.renderBoards(this.activePlayer, this.enemyPlayer);

        if (moveResult === 0) {
            // check if ship is sunk
            if (this.enemyPlayer.board.isDefeated()) {
                // game over
                this.screen.showModal(
                    'Game Over',
                    `${this.activePlayer.name} wins`,
                );

                // TODO: after game finishes, show an option for rematch, or something else
                return;
            }
        }

        // HACK: play next round automatically for now
        // if (this.activePlayer.isBot)
        this.updatePlayers(this.enemyPlayer, this.activePlayer);
        this.playRound();
        return;
    }
}

export default GameController;
