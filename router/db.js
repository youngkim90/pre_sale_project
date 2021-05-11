const mysql = require('mysql');

const db = mysql.createConnection({
    host : 'localhost',
    port : '3306',
    user : 'admin',
    password : 'sejin123',
    database : 'presale'
})
db.connect();

module.exports = db