document.addEventListener('DOMContentLoaded', () => {
    // Обработка загрузки фото профиля
    const pictureForm = document.getElementById('picture-form');
    if (pictureForm) {
        pictureForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(pictureForm);
            
            try {
                const response = await fetch('/upload-picture', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                if (response.ok) {
                    location.reload();
                } else {
                    alert(data.error);
                }
            } catch (error) {
                alert('Ошибка при загрузке фото');
            }
        });
    }

    // Обработка использования предметов
    const useButtons = document.querySelectorAll('.use-item-btn');
    useButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const itemId = btn.dataset.itemId;
            try {
                const response = await fetch('/use-item', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ itemId })
                });
                
                const data = await response.json();
                if (response.ok) {
                    alert('Предмет успешно использован!');
                    location.reload();
                } else {
                    alert(data.error);
                }
            } catch (error) {
                alert('Ошибка при использовании предмета');
            }
        });
    });
});
