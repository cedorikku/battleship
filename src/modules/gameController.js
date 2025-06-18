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
        this.#populateBoard(playerOne.board);

        const playerTwo = new Player('Computer', true);
        this.#populateBoard(playerTwo.board);

        // start the round with playerOne
        this.setCurrentPlayer(playerOne);
        this.playRound(playerOne, playerTwo);
    }

    /** Sets the current player */
    setCurrentPlayer(player) {
        this.currentPlayer = player;
    }

    /**
     * For temporarily populating the board with predetermined coords
     */
    #populateBoard(board) {
        // four ships
        board.placeShip(0, 0);
        board.placeShip(1, 0);
        board.placeShip(2, 0);
        board.placeShip(3, 0);
    }

    playRound(player, enemy) {
        // TODO replace with a real message later
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
            .querySelector('#right-side > .board')
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

    handleMoveResult(status) {
        this.screen.showMessage(status);
    }
}

export default GameController;
