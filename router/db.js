var mysql = require('mysql');
var sync_mysql = require('sync-mysql');

var db = mysql.createConnection({
    host : 'localhost',
    port : '3306',
    user : 'admin_user',
    password : 'sejin123',
    database : 'presale'
})
db.connect();

module.exports = db