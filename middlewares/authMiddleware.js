const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt.config');


module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const token = req.headers.authorization;
        if (!token) {
            req.user = {user_id: null, role: 'Гость'};
        } else {
            req.user = jwt.verify(token.split(' ')[1], secret);
        }
        next();
    } catch (e) {
        // console.log(e);
        // return res.json({message: "Ошибка в authMiddleware"});
        req.user = {user_id: null, role: 'Гость'};
        next();
    }
}