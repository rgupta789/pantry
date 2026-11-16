const pgp = require('pg-promise')();
require('dotenv').config();

// const db = pgp(process.env.DATABASE_URL);

const db = pgp({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("localhost")
    ? false
    : { rejectUnauthorized: false},
    max: 1,
});

module.exports = db;