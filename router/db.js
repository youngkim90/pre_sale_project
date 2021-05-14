const mysql = require('mysql');

const db = mysql.createConnection({
    host : 'marinacube.cafe24app.com',
    port : '3306',
    user : 'youngkim90',
    password : 'motor2021',
    multipleStatements : true,
    database : 'youngkim90'
})
db.connect();

module.exports = db