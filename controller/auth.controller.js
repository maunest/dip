const path = require("path");
const user = require('../model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt.config')

const generateAccessToken = (user_id, role) => {
    const payload = {
        user_id,
        role
    };
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class authController {

    getRegistration(req, res) {
        return res.sendFile(path.join(__dirname, '..', 'views', 'auth', 'registration.html'));
    }

    async registration(req, res) {
        try {
            const {email, password} = req.body;

            if (await user.checkEmail(email)) {
                return res.json({message: "Пользователь с таким email существует"})
            }
            const access = 1;
            const hashPassword = bcrypt.hashSync(password, 5);
            await user.createUser({email, hashPassword, access});

            return res.json({message: "Пользователь успешно зарегистрирован"})

        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Registration error'})
        }
    }

    getLogin(req, res) {
        return res.sendFile(path.join(__dirname, '..', 'views', 'auth', 'login.html'));
    }

    async login(req, res) {
        try {
            const {email, password} = req.body;
            if (!await user.checkEmail(email)) {
                return res.json({message: "Пользователь с таким email не существует"});
            }

            const hashPassword = await user.getPassword(email);
            const validPassword = bcrypt.compareSync(password, hashPassword);
            if (!validPassword) return res.json({message: 'Введён неверный пароль'});

            const {user_id, role} = await user.getIdAndRole(email);

            const token = generateAccessToken(user_id, role);

            return res.json({token, message: 'Пользователь успешно авторизирован'});

        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            res.json("server work")
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new authController();