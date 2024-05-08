const downloadBtn = document.querySelector('.create-report');

downloadBtn.addEventListener('click', () => {
    const name = document.querySelector('.nav-button.active').dataset.url;
    const title = document.querySelector('title');
    if (name === 'route') title.innerHTML = 'Маршруты';
    if (name === 'bus') title.innerHTML = 'Автобусы';
    if (name === 'user') title.innerHTML = 'Пользователи';
    if (name === 'flight') title.innerHTML = 'Рейсы';
    if (name === 'rate') title.innerHTML = 'Тарифы';
    if (name === 'point') title.innerHTML = 'Пункты';
    window.print();
    title.innerHTML = 'Панель администратора';
});