const mysql = require('mysql');

const db = mysql.createConnection({
    host : 'localhost',
    port : '3306',
    user : 'root',
    password : '111111',
    database : 'presale'
})
db.connect();

module.exports = db