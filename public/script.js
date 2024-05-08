function submitFile() {
    let messageElement = document.getElementById('message');

    // Изменяем текст и цвет сообщения
    messageElement.innerText = 'Процесс пошёл';
    messageElement.style.color = 'green';

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);

    axios.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        document.getElementById('response').value = response.data;
    })
    .catch(error => {
        console.error(error);
        messageElement.innerText = 'Произошла ошибка';
        messageElement.style.color = 'red';
    });

}


