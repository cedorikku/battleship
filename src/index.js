import './assets/styles/index.css';
import './assets/styles/modal.css';
import ScreenController from './modules/screenController.js';

document.addEventListener('DOMContentLoaded', () => {
    const screen = new ScreenController();

    // render main menu
    screen.renderBoards();
    screen.renderMenu();
});
