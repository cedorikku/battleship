import './assets/styles/index.css';
import './assets/styles/modal.css';
import GameController from './modules/gameController.js';

document.addEventListener('DOMContentLoaded', () => {
    // render initial UI
    const game = new GameController();

    // render empty grid
    game.loadMenu();
    
    // TEMP: audomatically starts the game
    game.startGame();
});

