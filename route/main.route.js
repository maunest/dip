const Router = require('express');
const router = new Router();
const mainController = require("../controller/main.controller");

const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), (req, res) => {
    // Определяем путь к загруженному файлу
    const filePath = 'uploads/' + req.file.filename;
    
    // Запускаем процесс Python с передачей пути к файлу в аргументах
    const pythonProcess = spawn('python', ['test-ml.py', filePath]);

    // Переменная для хранения вывода из процесса Python
    let pythonOutput = '';

    // Обрабатываем вывод из процесса Python
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        pythonOutput += data.toString(); // Сохраняем вывод в переменной
    });

    // Обрабатываем ошибки из процесса Python
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).send('Error processing file');
    });

    // Обработка завершения процесса Python
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            // Если процесс завершился успешно, отправляем результат клиенту
            res.send(pythonOutput);
        }
    });
});

router.get('/', mainController.getMain);


module.exports = router;