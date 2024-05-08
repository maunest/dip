const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

async function submitForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    let jsonData = {};

    for (let [key, value] of formData.entries()) {
        jsonData[key] = value;
    }

    await axios.post(form.action, jsonData)
        .then(response => {
            answer(response);
        })
        .catch(error => {
            console.log(error);
        });
}

const back = document.querySelector('.back');
const messageBlock = document.querySelector('.message');
const messageText = document.querySelector('.message-text');
const close = document.querySelector('.close');

function answer(response) {
    back.style.visibility = 'visible';
    back.style.opacity = 1;

    messageBlock.style.visibility = 'visible';
    messageBlock.style.opacity = 1;
    messageBlock.style.top = '50%';

    messageText.innerHTML = response.data.message;

    if (response.data.message === "Пользователь успешно авторизирован") {
        setCookie('token', response.data.token, 7);
        close.addEventListener('click', () => {
            window.location.href = '/';
        });
    }
}

close.addEventListener('click', () => {
    back.style.visibility = 'hidden';
    back.style.opacity = 0;

    messageBlock.style.visibility = 'hidden';
    messageBlock.style.opacity = 0;
    messageBlock.style.top = '80%';
});


function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}