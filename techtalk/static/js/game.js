document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const message = document.getElementById('message');
    const keyboardRu = document.getElementById('keyboard-ru');
    const keyboardEn = document.getElementById('keyboard-en');
    const newGameButton = document.getElementById('new-game');
    const switchLangButton = document.getElementById('switch-lang');

    let currentRow = 0;
    let currentTile = 0;
    const wordLength = 5;

    // Определяем текущий язык из URL
    const currentLang = window.location.pathname.includes('/game/ru') ? 'ru' : 'en';
    const currentKeyboard = currentLang === 'ru' ? keyboardRu : keyboardEn;
    const otherKeyboard = currentLang === 'ru' ? keyboardEn : keyboardRu;
    
    currentKeyboard.classList.remove('hidden');
    otherKeyboard.classList.add('hidden');

    function getCurrentRow() {
        return gameBoard.children[currentRow];
    }

    function updateTile(letter) {
        if (currentTile < wordLength) {
            const row = getCurrentRow();
            const tile = row.children[currentTile];
            tile.textContent = letter;
            tile.setAttribute('data-letter', letter);
            currentTile++;
        }
    }

    function deleteLetter() {
        if (currentTile > 0) {
            currentTile--;
            const row = getCurrentRow();
            const tile = row.children[currentTile];
            tile.textContent = '';
            tile.removeAttribute('data-letter');
        }
    }

    async function submitGuess() {
        if (currentTile !== wordLength) return;

        const row = getCurrentRow();
        const guess = Array.from(row.children)
            .map(tile => tile.getAttribute('data-letter'))
            .join('');

        const response = await fetch('/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ guess }),
        });

        const data = await response.json();

        if (data.error) {
            message.textContent = data.error;
            return;
        }

        // Подсветка букв
        data.result.forEach((result, index) => {
            const tile = row.children[index];
            tile.classList.add(result);
        });

        if (data.finished) {
            if (data.word === guess) {
                message.textContent = 'Поздравляем! Вы угадали слово!';
            } else {
                message.textContent = `Игра окончена. Загаданное слово: ${data.word}`;
            }
            return;
        }

        currentRow++;
        currentTile = 0;
    }

    // Обработка клавиатуры
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', () => {
            const value = key.textContent;
            
            if (value === '⌫') {
                deleteLetter();
            } else if (value === 'ВВОД' || value === 'ENTER') {
                submitGuess();
            } else {
                updateTile(value);
            }
        });
    });

    // Обработка физической клавиатуры
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            deleteLetter();
        } else if (e.key === 'Enter') {
            submitGuess();
        } else if (/^[а-яА-Яa-zA-Z]$/.test(e.key)) {
            updateTile(e.key.toUpperCase());
        }
    });

    // Новая игра
    newGameButton.addEventListener('click', async () => {
        const response = await fetch('/new-game', {
            method: 'POST'
        });
        const data = await response.json();
        
        if (data.success) {
            currentRow = 0;
            currentTile = 0;
            message.textContent = '';
            
            document.querySelectorAll('.letter-box').forEach(tile => {
                tile.textContent = '';
                tile.removeAttribute('data-letter');
                tile.className = 'letter-box';
            });
        }
    });

    // Переключение языка
    switchLangButton.addEventListener('click', () => {
        const newLang = currentLang === 'ru' ? 'en' : 'ru';
        window.location.href = `/game/${newLang}`;
    });
});
