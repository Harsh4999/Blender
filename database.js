const {Pool} = require('pg');

const proConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
}

const pool = new Pool(proConfig);

module.exports = {
    query: (text, params) => pool.query(text, params)
}