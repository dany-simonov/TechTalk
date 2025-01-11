document.addEventListener('DOMContentLoaded', () => {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const htmlElement = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            let theme = button.classList.contains('light-theme') ? 'light' : 'dark';
            applyTheme(theme);
        });
    });

    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.classList.contains(`${theme}-theme`)) {
                btn.classList.add('active');
            }
        });
    }
});
