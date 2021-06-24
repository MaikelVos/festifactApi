const mysql = require('mysql');
const config = require('../config');

/**
 * When the variables in precess.env are set (config vars in Heroku), user them instead of config.json.
 * @type {{host: string, username: string, password: string, name: string}}
 */
const dbConfig = process.env.DB_DATABASE && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_HOST ? {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_DATABASE,
} : config.database;

/**
 * Create the database connection and store it in this variable.
 * @type {Pool}
 */
const db = mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.username,
    password: dbConfig.password

});
console.log(`Connected to ${dbConfig.host}:${dbConfig.name || config.database.schema}`);
// db.connect((error) => {
//     console.log(error ? error : `Connected to ${dbConfig.host}:${dbConfig.name || config.database.schema}`);
// });


module.exports = db;