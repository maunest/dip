const path = require('path');

const user = require('../model/user.model')

const ejs = require('ejs');




class MainController{

    async getMain(req, res) {
        const role = req.user.role;
        let userData;
        if (role !== 'Гость') {
            userData = await user.getUser(req.user.user_id);
        }
        const template = path.join(__dirname, '..', 'views', 'main', 'main.ejs');
        const html = await ejs.renderFile(template, { userData, role });

        res.send(html);
    }

}

module.exports = new MainController();