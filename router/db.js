const mysql = require('mysql');

const db = mysql.createConnection({
    host : 'localhost',
    port : '3306',
    user : 'youngkim90',
    password : 'motor2021',
    database : 'youngkim90'
})
db.connect();

module.exports = db