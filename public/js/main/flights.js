let scriptExecuted = false;

async function showFlights() {
    const pointFrom = document.getElementById('search_from').value;
    const pointTo = document.getElementById('search_to').value;
    const date = document.getElementById('date').value;

    const searchSection = document.querySelector('.search');
    if (scriptExecuted) document.querySelector(".flights").remove();
    else scriptExecuted = true;

    await axios.get('/flight', {
        params: {
            pointFrom,
            pointTo,
            date
        },
    })
    .then(response => {
        const html = response.data;

        searchSection.insertAdjacentHTML('afterend', html);

        setTimeout(() => {
            searchSection.style.marginTop = '30px';
            document.querySelector(".flights").style.opacity = "1";
        }, 100);
        getSeat();

        const buyButton = document.querySelectorAll('.buy');

        buyButton.forEach(button => {
            button.addEventListener('click', async () => {

                const extra = button.closest('.extra-info');
                const flight = extra.previousElementSibling;

                const seat_number = extra.querySelector('#seat').value,
                    departure_point = flight.querySelector('.point-from').textContent,
                    arrival_point = flight.querySelector('.point-to').textContent,
                    cost = parseInt(extra.querySelectorAll('.cost p')[1].textContent),
                    departure_date = flight.querySelectorAll('.date-from p')[1].textContent,
                    departure_time = flight.querySelectorAll('.date-from p')[0].textContent,
                    arrival_date = flight.querySelectorAll('.date-to p')[1].textContent,
                    arrival_time = flight.querySelectorAll('.date-to p')[0].textContent;

                console.log(seat_number, departure_point, arrival_point, cost, departure_date, departure_time, arrival_date, arrival_time);

                await buyTicket(button.dataset.flightId, seat_number, departure_point, arrival_point, cost, departure_date, departure_time, arrival_date, arrival_time);
            });
        });
    })
    .catch(error => {
        console.log(error);
    });
}

function getSeat() {
    const flights = document.querySelectorAll('.flight');
    flights.forEach(flight => {
        flight.addEventListener('click', event => {
            const targetClasses = event.target.classList;
            if (targetClasses.contains('show-seat')) {
                flight.nextElementSibling.classList.toggle('show');
                if (flight.nextElementSibling.nextElementSibling) {
                    flight.nextElementSibling.nextElementSibling.classList.toggle('margin-up');
                } else {
                    document.querySelector('.flights').style.paddingBottom = '0';
                }
                flight.classList.toggle('border-fix');
            }
        });
    });
}



async function showTicketBuy(id) {
    await axios.get('/ticket/' + id)
        .then(response => {
            const html = response.data;

            document.querySelector('footer').insertAdjacentHTML('afterend', html);
            const one_ticket = document.querySelector('.one-ticket');
            const back = document.querySelector('.back2');
            setTimeout(() => {
                one_ticket.style.visibility = 'visible';
                back.style.visibility = 'visible';
                one_ticket.style.opacity = '1';
                back.style.opacity = '0.6';
            }, 100);

            const close = one_ticket.querySelector('.close');

            close.addEventListener('click', () => {
                one_ticket.style.opacity = '0';
                back.style.opacity = '0';
                setTimeout(() => {
                    back.remove();
                    one_ticket.remove();
                }, 500)
            });

            const downloadBtn = document.querySelector('.buy-ticket');
            downloadBtn.addEventListener('click', () => {
                const flightss = document.querySelector('.flights');
                flightss.style.display = 'none';
                document.querySelector('title').innerHTML = 'Билет';
                window.print();
                document.querySelector('title').innerHTML = 'Касса автововкзала';
                flightss.style.display = 'flex';
            });
        })
        .catch(error => {
            console.log(error);
        });
}


async function buyTicket(id, seat_number, departure_point, arrival_point, cost, departure_date, departure_time, arrival_date, arrival_time) {
    await axios.post('/ticket/buy/' + id, {
        params: {
            seat_number,
            departure_point,
            arrival_point,
            cost,
            departure_date,
            departure_time,
            arrival_date,
            arrival_time
        },
    }).then(async res => {
        if (res.data.message === 'Отказано в доступе') {
            answer('Покупка билета доступна только авторизированным пользователям!');
        } else await showTicketBuy(res.data.ticket_id);
    })
        .catch(error => {
            console.log(error);
        });
}

const back_error = document.querySelector('.back-error');
const messageBlock_error = document.querySelector('.message-error');
const messageText_error = document.querySelector('.message-text-error');
const close_error = document.querySelector('.close-error');

function answer(message) {
    back_error.style.visibility = 'visible';
    back_error.style.opacity = 1;

    messageBlock_error.style.visibility = 'visible';
    messageBlock_error.style.opacity = 1;
    messageBlock_error.style.top = '50%';

    messageText_error.innerHTML = message;

    close_error.addEventListener('click', () => {
        back_error.style.visibility = 'hidden';
        back_error.style.opacity = 0;

        messageBlock_error.style.visibility = 'hidden';
        messageBlock_error.style.opacity = 0;
        messageBlock_error.style.top = '80%';
        setTimeout(() => {
            messageText_error.innerHTML = '';
        }, 1000);

    });
}