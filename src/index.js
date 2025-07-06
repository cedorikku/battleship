import './assets/styles/index.css';
import './assets/styles/modal.css';
import GameController from './modules/gameController.js';
import ScreenController from './modules/screenController.js';
import Player from './modules/player.js';

const gameController = new GameController();
const screenController = new ScreenController();

document.addEventListener('DOMContentLoaded', () => {
    // render main menu
    screenController.renderBoards();
    screenController.renderMenu();

    const playButton = document.getElementById('playButton');
    playButton.addEventListener('click', () => handleStartGame());
});

function handleStartGame() {
    screenController.closeMenu();
    gameController.startGame();
}
