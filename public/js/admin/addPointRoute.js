let martop = 0;

function addPoint() {
    setTimeout(() => {
        const addPointButton = document.querySelector('.add-point');
        addPointButton.addEventListener('click', () => {
            let point = document.querySelector('.add-select');
            let html = point.outerHTML.toString();

            let selectRegex = /<select[^>]*>/i;

            html = html.replace(selectRegex, '');

            const selectedOption = point.options[point.value - 1];
            const optionDataName = selectedOption.dataset.name;

            const htmlSelect = `<option value="${point.value}" data-name="${optionDataName}">${optionDataName}</option>`;
            let htmlSelectRegex = new RegExp(htmlSelect.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
            html = html.replace(htmlSelectRegex, '');

            const points = document.querySelectorAll('.one-point');
            html = `<div class="one-point" id="p${points.length + 1}"><label for="point${points.length + 1}">${points.length + 1} - </label>` +
                `<select id="point${points.length + 1}" name="point">` + htmlSelect + html;

            html += `<button type="button"  class="delete-point" data-position="p${points.length + 1}" id="pp${points.length + 1}">Удалить</button>`;

            point.insertAdjacentHTML('beforebegin', html);

            point = document.getElementById(`p${points.length + 1}`);
            document.getElementById(`pp${points.length + 1}`).addEventListener('click', () => deletePoint(point));

            updateScrollPosition();
        });

        const deletePointButtons = document.querySelectorAll('.delete-point');

        deletePointButtons.forEach(button => {
            const point = document.getElementById(button.dataset.position);
            button.addEventListener('click', () => deletePoint(point));
        });

    }, 200);
}

const deletePoint = (point) => {
    point.remove();
    updateElementPositions();
}

function updateScrollPosition() {
    const windowForm = document.getElementById('windowForm');
    windowForm.scrollTop = windowForm.scrollHeight;
}

function updateElementPositions() {
    let points = document.querySelectorAll('.one-point');

    points.forEach(point => {
        const button = point.querySelector('.delete-point');
        button.removeEventListener('click', () => deletePoint(point)); // Удаление старого обработчика события
    });

    points = document.querySelectorAll('.one-point');

    points.forEach((point, index) => {
        const label = point.querySelector('label');
        const select = point.querySelector('select');
        const button = point.querySelector('.delete-point');

        const newPosition = index + 1;

        label.textContent = `${newPosition} - `;
        label.setAttribute('for', `point${newPosition}`);

        select.setAttribute('id', `point${newPosition}`);

        button.setAttribute('data-position', `p${newPosition}`);
        button.setAttribute('id', `pp${newPosition}`);

        point.setAttribute('id', `p${newPosition}`);

    });

    points = document.querySelectorAll('.one-point');

    points.forEach(point => {
        const button = point.querySelector('.delete-point');
        button.addEventListener('click', () => deletePoint(point)); // Добавление нового обработчика события
    });
}
