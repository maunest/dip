const buttons = document.querySelectorAll('.nav-button');
const addPointHandler = () => addPoint();

buttons.forEach(button => {
    button.addEventListener('click', () => {
        buttons.forEach(button => {
            button.classList.remove('active');
        });
        button.classList.add('active');

        loadContent(button.dataset.url);
    });
});

const main = document.querySelector('main');

function loadContent(url, data = {}) {
    axios.get('/admin/' + url, {
        params: data
    }).then(res => {
        main.innerHTML = res.data;

        document.querySelector('.create').removeEventListener('click', addPointHandler);
        if (url === 'route')  {
            document.querySelector('.create').addEventListener('click', addPointHandler);
            const buttonsChangeRoute = document.querySelectorAll('.change');
            buttonsChangeRoute.forEach(button => {
                button.addEventListener('click', addPointHandler);
            });
        }

        const searchButton = document.querySelector('.search-button');
        searchButton.addEventListener('click', () => {
            let data;

            if (url === 'route') {
                data = {
                    number: document.getElementById('number_route').value,
                    pointFrom: document.getElementById('search_from').value,
                    pointTo: document.getElementById('search_to').value
                }
            } else if (url === 'bus') {
                data = {
                    number: document.getElementById('bus-number').value,
                    model: document.getElementById('bus-model').value,
                    mark: document.getElementById('bus-mark').value
                }
            } else if (url === 'flight') {
                data = {
                    flightNumber: document.getElementById('flight-number').value,
                    routeNumber: document.getElementById('number-route').value,
                    date: document.getElementById('date').value
                }
            } else if (url === 'point') {
                data = {
                    number: document.getElementById('point-number').value,
                    name: document.getElementById('point-name').value,
                    type: document.getElementById('point-type').value
                }
            } else if (url === 'rate') {
                data = {
                    number: document.getElementById('rate-number').value,
                    name: document.getElementById('rate-name').value,
                }
            } else if (url === 'user') {
                data = {
                    first_name: document.getElementById('first_name').value,
                    last_name: document.getElementById('last_name').value,
                    patronymic: document.getElementById('patronymic').value,
                    email: document.getElementById('email').value,
                }
            }

            loadContent(url, data);
        });

        update(url);

    })
    .catch(error => {
        console.log(error);
    });
}

loadContent('route');