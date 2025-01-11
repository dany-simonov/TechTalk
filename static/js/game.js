const WORD_LENGTH = new URLSearchParams(window.location.search).get('length') || 5;
const KEYBOARD_RU = [
    ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ'],
    ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
    ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю']
];
const KEYBOARD_EN = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

const currentLanguage = window.location.pathname.includes('_ru') ? 'ru' : 'en';
const keyboard = currentLanguage === 'ru' ? KEYBOARD_RU : KEYBOARD_EN;

function initializeGame() {
    createGameBoard();
    createKeyboard();
}

function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'word-row';
        for (let j = 0; j < WORD_LENGTH; j++) {
            const box = document.createElement('div');
            box.className = 'letter-box';
            row.appendChild(box);
        }
        gameBoard.appendChild(row);
    }
}

function createKeyboard() {
    const keyboardElement = document.getElementById('keyboard');
    keyboard.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.className = 'keyboard-row';
        
        row.forEach(letter => {
            const key = document.createElement('button');
            key.className = 'key';
            key.textContent = letter;
            key.onclick = () => handleKeyPress(letter);
            rowElement.appendChild(key);
        });
        
        keyboardElement.appendChild(rowElement);
    });
}

window.onload = initializeGame;
