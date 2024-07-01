const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Bolcher',
    password: 'Admin',
    port: 5432,
});

module.exports = pool;