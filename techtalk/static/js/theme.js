document.addEventListener('DOMContentLoaded', () => {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const htmlElement = document.documentElement;
    
    // Загружаем сохраненную тему или используем светлую по умолчанию
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    // Обработчики для кнопок переключения тем
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            let theme;
            
            if (button.classList.contains('light-theme')) {
                theme = 'light';
            } else if (button.classList.contains('dark-theme')) {
                theme = 'dark';
            } else if (button.classList.contains('green-theme')) {
                theme = 'green';
            } else if (button.classList.contains('yellow-theme')) {
                theme = 'yellow';
            }
            
            applyTheme(theme);
        });
    });

    // Функция применения темы
    function applyTheme(theme) {
        // Удаляем все предыдущие темы
        htmlElement.classList.remove('theme-light', 'theme-dark', 'theme-green', 'theme-yellow');
        
        // Устанавливаем новую тему
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Обновляем активную кнопку
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.classList.contains(`${theme}-theme`)) {
                btn.classList.add('active');
            }
        });

        // Добавляем анимацию перехода
        document.body.style.transition = 'background-color 0.3s, color 0.3s';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
});
