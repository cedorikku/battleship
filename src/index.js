import './assets/styles/index.css';
import './assets/styles/modal.css';
import Config from './modules//config.js';
import GameController from './modules/gameController.js';
import ScreenController from './modules/screenController.js';
import Player from './modules/player.js';
import { randomInt } from './modules/utils.js';

const gameController = new GameController();
const screenController = new ScreenController();

const playerOne = new Player('Player 1', false);
const playerTwo = new Player('Computer', true);

document.addEventListener('DOMContentLoaded', () => {
    handleMainMenu();
});

function handleMainMenu() {
    // render main menu
    randomizeBoard(playerOne.board);
    screenController.renderBoards(playerOne, null);
    screenController.renderMenu();

    // menu button(s)
    const playButton = document.getElementById('playButton');
    playButton.addEventListener('click', () => handleStartGame('bot'));
}

/**
 * Starts the game.
 * @param {string} mode It is set to 'bot' by default, or something else in the future.
 */
function handleStartGame(mode = 'bot') {
    screenController.closeMenu();

    switch (mode) {
        case 'bot':
            populateBoard(playerTwo.board);
            gameController.startGame(playerOne, playerTwo);
            break;
        default:
            console.error('Unimplemented feature');
            throw new Error();
    }
}

/**
 * For randomly populating the board.
 * @param {GameBoard} Players' board.
 */
function randomizeBoard(board) {
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
function populateBoard(board) {
    let y = 0;
    for (let [key, value] of Object.entries(Config.variants)) {
        const x = 0;
        const length = value;
        const isVertical = true;

        board.placeShip(x, y, length, isVertical, key);
        y += 2;
    }
}
