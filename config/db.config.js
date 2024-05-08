const Pool = require('pg').Pool;
const pool = new Pool({
    user: "new_user",
    password: "password",
    host: "188.225.42.31",
    port: "5432",
    database: "dip"
});

module.exports = pool;