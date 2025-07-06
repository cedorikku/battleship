import './assets/styles/index.css';
import './assets/styles/modal.css';
import GameController from './modules/gameController.js';
import ScreenController from './modules/screenController.js';
import Player from './modules/player.js';

const gameController = new GameController();
const screenController = new ScreenController();

document.addEventListener('DOMContentLoaded', () => {
    // render main menu
    screenController.renderMenu();

    const playButton = document.getElementById('playButton');
    playButton.addEventListener('click', () => handleStartGame());
});

function handleStartGame() {
    screenController.closeMenu();
    startGame();
}

/**
 * WIP:
 * Starts the game.
 */
function startGame() {
    const playerOne = new Player('Player 1', false);
    gameController.populateBoard(playerOne.board);

    const playerTwo = new Player('Computer', true);
    gameController.populateBoard(playerTwo.board);

    // start the round with playerOne
    gameController.updatePlayers(playerOne, playerTwo);
    gameController.playRound();
}
