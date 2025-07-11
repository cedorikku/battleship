import Player from './player.js';
import Config from './config.js';
import { randomInt } from './utils.js';

// TODO: Check and update docs if needed

class GameController {
    constructor() {
        this.players = {
            first: new Player('Player 1', false),
            second: null,
        };
        this.currentPlayer = null;
        this.currentEnemy = null;

        // randomizes the main player's board at the start
        GameController.randomizeBoard(this.players.first.board);
    }

    /**
     * Gets the first player.
     * @returns {Player}
     */
    get playerOne() {
        return this.players.first;
    }

    /**
     * Gets the second player.
     * @returns {Player}
     */
    get playerTwo() {
        return this.players.second;
    }

    /**
     * Sets the value of the first player.
     * @param {Player}
     */
    set playerOne(newPlayer) {
        this.players.first = newPlayer;
    }

    /**
     * Sets the value of the second player.
     * @param {Player}
     */
    set playerTwo(newPlayer) {
        this.players.second = newPlayer;
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
    updateTurn(active, enemy) {
        this.activePlayer = active;
        this.enemyPlayer = enemy;
    }

    /**
     * Starts an instance of a game by setting the players
     * and then plays a round.
     */
    startGame() {
        // start the round with playerOne
        this.updateTurn(this.playerOne, this.playerTwo);
        this.playRound();
    }

    /**
     * Plays a round, equivalent to a turn, continuously.
     * @returns {void}
     */
    playRound() {
        // bot player
        if (this.activePlayer.isBot) {
            // bot keeps going until valid
            let moveStatus;
            do {
                const x = randomInt(Config.boardSize);
                const y = randomInt(Config.boardSize);

                moveStatus = this.enemyPlayer.board.receiveAttack(x, y);
            } while (moveStatus === -1 || moveStatus === 2);

            this.handleMove(moveStatus);
        }
    }

    /**
     * Handles what to do after a successful move by the player that just did their turn.
     * Checks if all ship is sunk.
     * @param {number} moveStatus Result code of the most recent move
     * @returns {number} Result number of the move. 0 if continues (hit or miss), 1 if game over
     */
    handleMove(moveStatus) {
        if (moveStatus === 0) {
            // check if ship is sunk
            if (this.enemyPlayer.board.isDefeated()) {
                // game over
                console.log(`${this.activePlayer.name} wins`);
                return 1;
            }
        }

        // HACK: play next round automatically for now
        // if (this.activePlayer.isBot)
        this.updateTurn(this.enemyPlayer, this.activePlayer);
        this.playRound();
        return 0;
    }

    /**
     * For randomly populating a board.
     * @param {GameBoard} A player's board.
     */
    static randomizeBoard(board) {
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
     * HACK: Populating a board, for testing.
     * TODO: Remove implementation in the future.
     * @param {GameBoard} board A player's board.
     */
    static populateBoard(board) {
        let y = 0;
        for (let [key, value] of Object.entries(Config.variants)) {
            const x = 0;
            const length = value;
            const isVertical = true;

            board.placeShip(x, y, length, isVertical, key);
            y += 2;
        }
    }
}

export default GameController;
