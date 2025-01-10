document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');
    const keyboard = document.querySelector('.keyboard');
    const message = document.querySelector('.message');
    
    // Создаем игровое поле
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'game-row';
        
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.className = 'game-cell';
            row.appendChild(cell);
        }
        
        gameBoard.appendChild(row);
    }
    
    // Создаем клавиатуру
    const keys = [
        ['Й','Ц','У','К','Е','Н','Г','Ш','Щ','З','Х'],
        ['Ф','Ы','В','А','П','Р','О','Л','Д','Ж','Э'],
        ['ВВОД','Я','Ч','С','М','И','Т','Ь','Б','Ю','⌫']
    ];
    
    keys.forEach(row => {
        const keyboardRow = document.createElement('div');
        keyboardRow.className = 'keyboard-row';
        
        row.forEach(key => {
            const button = document.createElement('button');
            button.className = 'key';
            if (key === 'ВВОД' || key === '⌫') button.className += ' wide';
            button.textContent = key;
            button.addEventListener('click', () => handleKeyPress(key));
            keyboardRow.appendChild(button);
        });
        
        keyboard.appendChild(keyboardRow);
    });
});
