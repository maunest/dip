const nav = document.querySelector('.header-nav-list')

nav.addEventListener('click', async event => {
    const targetClasses = event.target.classList;
    if (targetClasses.contains('show-ticket')) {
        await axios.get('/ticket')
            .then(response => {
                const html = response.data;
                document.querySelector('main').insertAdjacentHTML('afterend', html);
                const all_ticket = document.querySelector('.all_ticket');
                const back = document.querySelector('.back');
                setTimeout(() => {
                    all_ticket.style.visibility = 'visible';
                    back.style.visibility = 'visible';
                    all_ticket.style.opacity = '1';
                    back.style.opacity = '0.6';
                }, 100)

                const close = all_ticket.querySelector('.close');

                close.addEventListener('click', () => {
                    all_ticket.style.opacity = '0';
                    back.style.opacity = '0';
                    setTimeout(() => {
                        back.remove();
                        all_ticket.remove();
                    }, 500)
                });

                const about_ticket = all_ticket.querySelectorAll('.button-ticket');

                about_ticket.forEach(button => {
                    button.addEventListener('click', async () => {
                        await showTicket(button.dataset.ticketId);
                    });
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
});


async function showTicket(id) {
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

            // const downloadBtn = document.querySelector('.buy-ticket');
            // const content = document.querySelector('.one-ticket');
            //
            // downloadBtn.addEventListener('click', () => {
            //     const doc = new jsPDF({
            //         orientation: 'p',
            //         unit: 'mm',
            //         format: 'a4',
            //         putOnlyUsedFonts: true,
            //         floatPrecision: 16
            //     });
            //
            //
            //     doc.addFileToVFS('Roboto-Regular.ttf', 'Roboto-Regular.ttf');
            //     doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
            //     doc.setFont('Roboto');
            //
            //     doc.autoPaging = false; // переопределение свойства autoPaging
            //     doc.fromHTML(content, 15, 15, {}, () => {
            //         doc.save('ticket.pdf');
            //     });
            // });


            const downloadBtn = document.querySelector('.buy-ticket');

            downloadBtn.addEventListener('click', () => {
                // const all_ticket = document.querySelector('.all_ticket');
                // const flightss = document.querySelector('.flights');
                // all_ticket.style.opacity = '0';
                // flightss.style.display = 'none';
                document.querySelector('title').innerHTML = 'Билет';
                window.print();
                document.querySelector('title').innerHTML = 'Касса автововкзала';
                // flightss.style.display = 'flex';
                // all_ticket.style.opacity = '1';
            });
        })
        .catch(error => {
            console.log(error);
        });
}
