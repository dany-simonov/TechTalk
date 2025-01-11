let currentRow = 0;
let currentCell = 0;
let gameOver = false;
let currentGuess = '';

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

    // Обработка физической клавиатуры
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;
        
        if (e.key === 'Enter') {
            handleKeyPress('ВВОД');
        } else if (e.key === 'Backspace') {
            handleKeyPress('⌫');
        } else if (/^[а-яА-ЯёЁ]$/.test(e.key)) {
            handleKeyPress(e.key.toUpperCase());
        }
    });
});

function handleKeyPress(key) {
    if (gameOver) return;

    const currentRowElement = document.querySelectorAll('.game-row')[currentRow];
    const cells = currentRowElement.querySelectorAll('.game-cell');

    if (key === '⌫') {
        if (currentCell > 0) {
            currentCell--;
            cells[currentCell].textContent = '';
            currentGuess = currentGuess.slice(0, -1);
        }
    } else if (key === 'ВВОД') {
        if (currentGuess.length === 5) {
            checkGuess();
        }
    } else if (currentCell < 5) {
        cells[currentCell].textContent = key;
        currentGuess += key;
        currentCell++;
    }
}

function checkGuess() {
    fetch('/check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess: currentGuess })
    })
    .then(response => response.json())
    .then(data => {
        const currentRowElement = document.querySelectorAll('.game-row')[currentRow];
        const cells = currentRowElement.querySelectorAll('.game-cell');

        data.result.forEach((result, index) => {
            cells[index].classList.add(result);
            const key = document.querySelector(`.key[data-key="${currentGuess[index]}"]`);
            if (key) {
                if (result === 'correct') {
                    key.classList.add('correct');
                } else if (result === 'present' && !key.classList.contains('correct')) {
                    key.classList.add('present');
                } else if (result === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present')) {
                    key.classList.add('absent');
                }
            }
        });

        if (data.finished) {
            gameOver = true;
            if (data.word === currentGuess) {
                showMessage('Поздравляем! Вы угадали слово!');
            } else {
                showMessage(`Игра окончена! Загаданное слово: ${data.word}`);
            }
        } else {
            currentRow++;
            currentCell = 0;
            currentGuess = '';
        }
    });
}

function showMessage(text) {
    const message = document.querySelector('.message');
    message.textContent = text;
    message.classList.add('show');
}

function changeWordLength(length) {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    // Создаем 6 рядов
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'word-row';
        
        // Создаем ячейки в соответствии с выбранной длиной
        for (let j = 0; j < length; j++) {
            const box = document.createElement('div');
            box.className = 'letter-box';
            row.appendChild(box);
        }
        
        gameBoard.appendChild(row);
    }
    
    // Запрашиваем новое слово с сервера
    fetch(`/get_word?length=${length}&lang=${currentLanguage}`)
        .then(response => response.json())
        .then(data => {
            currentWord = data.word;
            resetGame();
        });
}
