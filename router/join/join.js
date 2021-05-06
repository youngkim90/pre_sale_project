const express = require('express');
const router =express.Router();
const path = require('path');
const mysql = require('mysql');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const db = mysql.createConnection({
    host : 'localhost',
    port : '3306',
    user : 'root',
    password : '111111',
    database : 'mydatabase'
})

db.connect();

router.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'../../public/join.html'));
});

passport.use('local-join', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    _passReqToCallback: true
}, function(email, password, done){
    const query = db.query('select * from user where email=?', [email], function(err,rows) {
        if(err) return done(err);

        if(rows.length) {
            console.log('existed user')
            return done(null, false, {message : 'your email is already used'})
        } else {
            const sql = {email: email, pw:password};
            const query = db.query('insert into user set ?', sql, function(err,rows) {
                if(err) throw err
                return done(null, {'email' : email, 'id' : rows.insertId});
            })
        }
    })
}));

router.post('/', passport.authenticate('local-join', {
    successRedirect: '/main',
    failureRedirect: '/join',
    failureFlash: true })
)
module.exports = router;
