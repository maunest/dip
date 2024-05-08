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
            answer(response.data.message);
        })
        .catch(error => {
            console.log(error);
        });
}

const back = document.querySelector('.back');
const messageBlock = document.querySelector('.message');
const messageText = document.querySelector('.message-text');
const close = document.querySelector('.close');

function answer(message = "Что-то пошло не так") {
    back.style.visibility = 'visible';
    back.style.opacity = 1;

    messageBlock.style.visibility = 'visible';
    messageBlock.style.opacity = 1;
    messageBlock.style.top = '50%';

    messageText.innerHTML = message;

    if (message === "Пользователь успешно зарегистрирован") {
        close.addEventListener('click', () => {
            window.location.href = '/auth/login';
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


const password = document.querySelector('#password');
const passwordRepeat = document.querySelector('#password-copy');
const button = document.querySelector('[type = "submit"]');

password.addEventListener('input', () => {
    if (password.value !== passwordRepeat.value) {
        password.classList.remove('corrected');
        passwordRepeat.classList.remove('corrected');
        password.classList.add('uncorrected');
        passwordRepeat.classList.add('uncorrected');
        button.disabled = true;
    } else {
        password.classList.remove('uncorrected');
        passwordRepeat.classList.remove('uncorrected');
        password.classList.add('corrected');
        passwordRepeat.classList.add('corrected');
        button.disabled = false;
    }
    if (password.value === "") {
        password.classList.remove('uncorrected');
        passwordRepeat.classList.remove('uncorrected');
        password.classList.remove('corrected');
        passwordRepeat.classList.remove('corrected');
    }
});