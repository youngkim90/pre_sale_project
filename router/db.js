const mysql = require('mysql');
const sync_mysql = require('sync-mysql');

const db = mysql.createConnection({
    host : 'localhost',
    port : '3306',
    user : 'admin_user',
    password : 'sejin123',
    database : 'presale'
})
db.connect();

module.exports = db