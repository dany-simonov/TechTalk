let gameSettings = {
    length: 5,
    theme: 'none'
};

function saveLength(value) {
    gameSettings.length = parseInt(value);
    highlightSaveButton(event.target.parentElement.querySelector('.save-btn'));
}

function saveTheme(value) {
    gameSettings.theme = value;
    highlightSaveButton(event.target.parentElement.querySelector('.save-btn'));
}

function highlightSaveButton(button) {
    button.style.background = '#45a049';
    setTimeout(() => {
        button.style.background = '#4CAF50';
    }, 500);
}

function startGame() {
    window.location.href = `/game?lang=${currentLanguage}&length=${gameSettings.length}&theme=${gameSettings.theme}`;
}
