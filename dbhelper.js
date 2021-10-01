const mysql = require("mysql");
require('dotenv').config()

const pool = mysql.createPool({
    connectionLimit: process.env.CONN_LIMIT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
});

globalQuery = (val) => {
    return new Promise((resolve, reject) => {
        pool.query(val, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });

    });
};

var bots = (chain) => "SELECT * FROM bots_data";

module.exports.globalQuery = globalQuery;
module.exports.bots = bots;
