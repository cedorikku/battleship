import Player from './player.js';
import Config from './config.js';
import ScreenController from './screenController.js';
import { randomInt } from './utils.js';

class GameController {
    constructor() {
        this.currentPlayer = null;
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
        this.randomizeBoard(playerOne.board);

        const playerTwo = new Player('Computer', true);
        this.randomizeBoard(playerTwo.board);

        // start the round with playerOne
        this.setCurrentPlayer(playerOne);
        this.playRound(playerOne, playerTwo);
    }

    /** Sets the current player */
    setCurrentPlayer(player) {
        this.currentPlayer = player;
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

    playRound(player, enemy) {
        // TODO: replace with a real message later
        console.log(`${player.name}'s turn`);

        this.screen.renderBoards(player, enemy);

        // bot player
        if (player.isBot) {
            // bot keeps going until valid
            let status;
            do {
                const x = randomInt(Config.boardSize);
                const y = randomInt(Config.boardSize);

                status = enemy.board.receiveAttack(x, y);

                this.handleMoveResult(status);
            } while (status === -1 || status === 2);

            this.screen.renderBoards(player, enemy);
            this.playRound(enemy, player);
            return;
        }

        // human player
        document
            .querySelector('#enemy-side > .board')
            .addEventListener('click', (e) => {
                if (e.target.hasAttribute('data-coords')) {
                    const coords = e.target
                        .getAttribute('data-coords')
                        .split('');

                    const status = enemy.board.receiveAttack(
                        coords[0],
                        coords[1],
                    );

                    if (status === 2) return;

                    this.handleMoveResult(status);

                    // play next round if not all sunk yet

                    this.screen.renderBoards(player, enemy);
                    this.playRound(enemy, player);
                }
            });
    }

    /** TODO: Handles what to do after a successful move by the player
     *   shows a feedback on the screen
     * - check if all ship is sunk
     */
    handleMoveResult(status) {
        this.screen.showMessage(status);

        // check if ship is sunk
    }
}

export default GameController;
