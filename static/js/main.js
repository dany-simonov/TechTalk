document.addEventListener('DOMContentLoaded', () => {
    // Инициализация данных пользователя
    let userData = {
        streak: localStorage.getItem('streak') || 0,
        crystals: localStorage.getItem('crystals') || 100,
        lastPlayed: localStorage.getItem('lastPlayed') || null,
        theme: localStorage.getItem('theme') || 'light'
    };

    // Обновление UI статистики
    function updateStats() {
        document.querySelector('.streak-count').textContent = userData.streak;
        document.querySelector('.crystal-count').textContent = userData.crystals;
    }

    // Проверка и обновление streak
    function checkStreak() {
        const today = new Date().toDateString();
        if (userData.lastPlayed) {
            const lastPlayed = new Date(userData.lastPlayed);
            const diffDays = Math.floor((new Date() - lastPlayed) / (1000 * 60 * 60 * 24));
            
            if (diffDays > 1) {
                userData.streak = 0;
            } else if (diffDays === 1) {
                userData.streak++;
            }
        }
        userData.lastPlayed = today;
        localStorage.setItem('lastPlayed', today);
        localStorage.setItem('streak', userData.streak);
    }

    // Функционал магазина
    const shopItems = [
        {
            id: 'streak_potion',
            name: 'Зелье удержания серии',
            price: 50,
            description: 'Восстанавливает серию побед'
        },
        {
            id: 'crystal_boost',
            name: 'Удвоение кристаллов',
            price: 100,
            description: 'Удваивает получение кристаллов на 24 часа'
        },
        {
            id: 'mega_potion',
            name: 'Большое зелье',
            price: 150,
            description: 'Восстанавливает присутствие за пропущенный день'
        }
    ];

    // Открытие магазина
    document.querySelector('.shop-link').addEventListener('click', (e) => {
        e.preventDefault();
        openShop();
    });

    function openShop() {
        const modal = document.createElement('div');
        modal.className = 'shop-modal';
        modal.innerHTML = `
            <div class="shop-content">
                <h2>Магазин</h2>
                <div class="shop-items">
                    ${shopItems.map(item => `
                        <div class="shop-item">
                            <h3>${item.name}</h3>
                            <p>${item.description}</p>
                            <div class="price">
                                <span class="crystal">💎</span>
                                <span>${item.price}</span>
                            </div>
                            <button class="buy-btn" data-id="${item.id}">Купить</button>
                        </div>
                    `).join('')}
                </div>
                <button class="close-shop">Закрыть</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Обработчики событий магазина
        modal.querySelector('.close-shop').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.id;
                const item = shopItems.find(i => i.id === itemId);
                
                if (userData.crystals >= item.price) {
                    userData.crystals -= item.price;
                    localStorage.setItem('crystals', userData.crystals);
                    updateStats();
                    
                    // Применение эффекта предмета
                    applyItemEffect(itemId);
                    
                    alert('Покупка успешно совершена!');
                } else {
                    alert('Недостаточно кристаллов!');
                }
            });
        });
    }

    function applyItemEffect(itemId) {
        switch(itemId) {
            case 'streak_potion':
                userData.streak = Math.max(userData.streak, 1);
                break;
            case 'crystal_boost':
                localStorage.setItem('crystal_boost_until', 
                    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
                break;
            case 'mega_potion':
                userData.lastPlayed = new Date().toDateString();
                break;
        }
        updateStats();
        saveUserData();
    }

    function saveUserData() {
        Object.keys(userData).forEach(key => {
            localStorage.setItem(key, userData[key]);
        });
    }

    // Инициализация
    updateStats();
    checkStreak();
});
