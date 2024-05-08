const messageBlock = document.querySelector('.message');
const messageText = document.querySelector('.message-text');
const messageClose = document.querySelector('.message-close');

function answer(message = "Что-то пошло не так", url) {
    messageBlock.style.width = '600px';
    messageBlock.style.height = '300px';
    messageBlock.style.visibility = 'visible';
    messageBlock.style.opacity = 1;
    messageBlock.style.top = '50%';

    messageText.innerHTML = message;

    messageClose.addEventListener('click', () => answerClose(url));
}

function answerClose(url) {
        messageBlock.style.top = '80%';
        messageBlock.style.opacity = 0;
        messageBlock.style.visibility = 'visible';
        messageText.innerHTML = '';

        const window = document.querySelector('.window');
        const back = document.querySelector('.back');

        window.style.opacity = '0';
        back.style.opacity = '0';
        window.style.visibility = 'visible';
        back.style.visibility = 'visible';

        setTimeout(() => {
            messageBlock.style.width = '0';
            messageBlock.style.height = '0';
            window.remove();
            back.remove();
        }, 300)

        loadContent(url);
        messageClose.removeEventListener('click', () => answerClose(url));
}

function update(url) {
    const buttonsChange = document.querySelectorAll('.change');

    buttonsChange.forEach(buttonChange => {
        buttonChange.addEventListener('click', () => {
            axios.get('/admin/' + url + '/change/' + buttonChange.dataset.id)
                .then(res => {
                    document.querySelector('main').insertAdjacentHTML("afterend", res.data);

                    const window = document.querySelector('.window');
                    const back = document.querySelector('.back');
                    setTimeout(() => {
                        window.style.visibility = 'visible';
                        back.style.visibility = 'visible';
                        window.style.opacity = '1';
                        back.style.opacity = '0.6';
                    }, 100)

                    const close = window.querySelector('.close');

                    close.addEventListener('click', () => {
                        window.style.opacity = '0';
                        back.style.opacity = '0';
                        setTimeout(() => {
                            back.remove();
                            window.remove();
                        }, 500)
                    });


                    let flag = false;
                    document.querySelector('.button-window').addEventListener('click', () => {
                        flag = true;
                    });

                    const form = document.getElementById('windowForm');

                    form.addEventListener('submit', event => {
                        event.preventDefault();
                        if (flag) {
                            if (url !== 'route') {
                                const formData = new FormData(form);
                                let jsonData = {};

                                for (let [key, value] of formData.entries()) {
                                    jsonData[key] = value;
                                }

                                axios.post('/admin/' + url + '/change/' + buttonChange.dataset.id, jsonData)
                                    .then(res => {
                                        answer(res.data.message, url);
                                    })
                                    .catch(error => {
                                        console.log(error);
                                    });
                            }
                            else {
                                const rateSelect = document.getElementById('rate');
                                const points = Array.from(document.querySelectorAll('.one-point'));

                                const selectedRateId = rateSelect.value;

                                const pointsArray = points.map(point => {
                                    const pointId = point.querySelector('select').value;
                                    const pointPosition = point.querySelector('.delete-point').getAttribute('data-position').slice(1);
                                    return { id: pointId, position: pointPosition };
                                });

                                axios.post('/admin/' + url + '/change/' + buttonChange.dataset.id, {
                                    rate: selectedRateId,
                                    points: pointsArray
                                })
                                    .then(res => {
                                        answer(res.data.message, url);
                                    })
                                    .catch(error => {
                                        console.log(error);
                                    });

                            }
                        }
                    });


                })
                .catch(error => {
                    console.log(error);
                });
        });
    });

    const buttonsDelete = document.querySelectorAll('.delete');

    buttonsDelete.forEach(buttonDelete => {
        buttonDelete.addEventListener('click', () => {
            axios.delete('/admin/' + url + '/delete/' + buttonDelete.dataset.id)
                .then(res => {
                    answerDelete(res.data.message);
                    document.getElementById(buttonDelete.dataset.id).remove();
                })
                .catch(error => {
                    console.log(error);
                });
        })
    });
}

function answerDelete(message = "Что-то пошло не так") {
    messageBlock.style.width = '600px';
    messageBlock.style.height = '300px';
    messageBlock.style.visibility = 'visible';
    messageBlock.style.opacity = 1;
    messageBlock.style.top = '50%';

    messageText.innerHTML = message;

    messageClose.addEventListener('click', () => {

        messageBlock.style.top = '80%';
        messageBlock.style.opacity = 0;
        messageBlock.style.visibility = 'visible';
        messageText.innerHTML = '';

        setTimeout(() => {
            messageBlock.style.width = '0';
            messageBlock.style.height = '0';
        }, 200)

    });
}


/* create */

const buttonCreate = document.querySelector('.create');

buttonCreate.addEventListener('click', () => {
    const url = document.querySelector('.active').dataset.url;
    axios.get('/admin/' + url + '/create')
        .then(res => {
            document.querySelector('main').insertAdjacentHTML("afterend", res.data);

            const window = document.querySelector('.window');
            const back = document.querySelector('.back');
            setTimeout(() => {
                window.style.visibility = 'visible';
                back.style.visibility = 'visible';
                window.style.opacity = '1';
                back.style.opacity = '0.6';
            }, 100)

            const close = window.querySelector('.close');

            close.addEventListener('click', () => {
                window.style.opacity = '0';
                back.style.opacity = '0';
                setTimeout(() => {
                    back.remove();
                    window.remove();
                }, 500)
            });

            const form = document.getElementById('windowForm');

            let flag = false;
            document.querySelector('.button-window').addEventListener('click', () => {
                flag = true;
            });

            form.addEventListener('submit', event => {
                event.preventDefault();
                if (flag) {
                    if (url !== 'route') {
                        const formData = new FormData(form);
                        let jsonData = {};

                        for (let [key, value] of formData.entries()) {
                            jsonData[key] = value;
                        }

                        axios.post('/admin/' + url + '/create', jsonData)
                            .then(res => {
                                answerCreate(res.data.message, url);
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                     else {
                        const rateSelect = document.getElementById('rate');
                        const points = Array.from(document.querySelectorAll('.one-point'));

                        const selectedRateId = rateSelect.value;

                        const pointsArray = points.map(point => {
                            const pointId = point.querySelector('select').value;
                            const pointPosition = point.querySelector('.delete-point').getAttribute('data-position').slice(1);
                            return { id: pointId, position: pointPosition };
                        });


                        axios.post('/admin/' + url + '/create', {
                            rate: selectedRateId,
                            points: pointsArray
                        })
                            .then(res => {
                                answerCreate(res.data.message, url);
                            })
                            .catch(error => {
                                console.log(error);
                            });

                    }
                }
            });
        })
        .catch(error => {
            console.log(error);
        });
});

function answerCreate(message = "Что-то пошло не так", url) {
    messageBlock.style.width = '600px';
    messageBlock.style.height = '300px';
    messageBlock.style.visibility = 'visible';
    messageBlock.style.opacity = 1;
    messageBlock.style.top = '50%';

    messageText.innerHTML = message;

    messageClose.addEventListener('click', () => {

        messageBlock.style.top = '80%';
        messageBlock.style.opacity = 0;
        messageBlock.style.visibility = 'visible';
        messageText.innerHTML = '';

        setTimeout(() => {
            messageBlock.style.width = '0';
            messageBlock.style.height = '0';
        }, 200)

        if (message !== 'Пользователь с таким email существует') {
            const window = document.querySelector('.window');
            const back = document.querySelector('.back');

            window.style.opacity = '0';
            back.style.opacity = '0';
            window.style.visibility = 'visible';
            back.style.visibility = 'visible';

            setTimeout(() => {
                window.remove();
                back.remove();
            }, 200)

            loadContent(url);
        }

    });
}