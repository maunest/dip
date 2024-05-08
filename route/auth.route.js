const Router = require('express');
const router = new Router();

const authController = require("../controller/auth.controller");
const {check} = require("express-validator");

router.get('/registration', authController.getRegistration);
router.post('/registration', authController.registration);

router.get('/login', authController.getLogin);
router.post('/login', authController.login);

module.exports = router;