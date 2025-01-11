document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.store-items');
    const items = document.querySelectorAll('.store-item');
    const leftBtn = document.querySelector('.slider-arrow.left');
    const rightBtn = document.querySelector('.slider-arrow.right');
    let currentPosition = 0;

    function updateSlider() {
        slider.style.transform = `translateX(-${currentPosition * (100/3)}%)`;
    }

    leftBtn.addEventListener('click', () => {
        if (currentPosition > 0) {
            currentPosition--;
            updateSlider();
        }
    });

    rightBtn.addEventListener('click', () => {
        if (currentPosition < items.length - 3) {
            currentPosition++;
            updateSlider();
        }
    });

    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.store-item');
            const price = parseInt(item.querySelector('.price span').textContent);
            const currentCrystals = parseInt(document.querySelector('.crystal-count').textContent);

            if (currentCrystals >= price) {
                const newCrystals = currentCrystals - price;
                document.querySelector('.crystal-count').textContent = newCrystals;
                localStorage.setItem('crystals', newCrystals);
                alert('Вы успешно купили этот предмет!');
            } else {
                alert('Упс! У вас недостаточно кристаллов!');
            }
        });
    });
});
