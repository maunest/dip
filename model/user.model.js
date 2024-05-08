const pool = require('../config/db.config');

class UserModel {

    async checkEmail(email) {
        const find = await pool.query('SELECT "user".email FROM "user" ' +
                    'WHERE "user".email = $1', [email]);
        return Boolean(find.rows[0]);
    }

    async createUser({email, hashPassword, access}) {
        await pool.query('INSERT INTO "user" (email, password, access_id)\n' +
                        ' VALUES ($1, $2, $3) RETURNING *;', [email, hashPassword, access]);
    }

    async getPassword(email) {
        const find = await pool.query('SELECT password FROM "user" WHERE email = $1', [email]);
        return find.rows[0].password;
    }

    async getIdAndRole(email) {
        const find = await pool.query('SELECT user_id, access_name AS "role" FROM "user", access_level' +
            ' WHERE email = $1 AND "user".access_id = access_level.access_id;', [email]);
        return find.rows[0];
    }

    async getUser(user_id) {
        let select = 'select * from "user" as u, access_level as al ' +
            'where u.user_id = $1 and u.access_id = al.access_id;';
        const rows = await pool.query(select, [user_id]);

        return rows.rows[0];
    }

}

module.exports = new UserModel();