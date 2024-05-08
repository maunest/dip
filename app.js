const express = require('express');
const app = express();

const PORT = 8081;
const path = require('path');

const authMiddleware = require('./middlewares/authMiddleware');
const addAuthorizationHeader = require('./middlewares/addAuthorizationHeader');
const roleMiddleware = require('./middlewares/roleMiddleware');
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// all route
const mainRoute = require('./route/main.route');
const authRoute = require('./route/auth.route');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoute);
app.use('/', addAuthorizationHeader, authMiddleware, mainRoute);
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));