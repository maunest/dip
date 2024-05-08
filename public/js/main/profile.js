const navigation = document.querySelector('.header-nav-list')

navigation.addEventListener('click', async event => {
    const targetClasses = event.target.classList;
    if (targetClasses.contains('show-profile')) {
        await axios.get('/profile')
            .then(response => {
                const html = response.data;
                document.querySelector('main').insertAdjacentHTML('afterend', html);
                const profile = document.querySelector('.profile');
                const back = document.querySelector('.back');
                setTimeout(() => {
                    profile.style.visibility = 'visible';
                    back.style.visibility = 'visible';
                    profile.style.opacity = '1';
                    back.style.opacity = '0.6';
                }, 100)

                const close = profile.querySelector('.close');

                close.addEventListener('click', () => {
                    profile.style.opacity = '0';
                    back.style.opacity = '0';
                    setTimeout(() => {
                        back.remove();
                        profile.remove();
                    }, 500)
                });

                document.getElementById('profileForm').addEventListener('submit', function(event) {
                    event.preventDefault();
                    let data = {
                        name: document.getElementById('name').value,
                        surname: document.getElementById('surname').value,
                        patronymic: document.getElementById('patronymic').value,
                        passport: document.getElementById('passport').value,
                        email: document.getElementById('email').value,
                        password: document.getElementById('password').value
                    };

                    axios.post('/profile/change', data)
                        .then(function(response) {
                            window.location.href = "/";
                        })
                        .catch(function(error) {
                            console.error(error);
                        });
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
});