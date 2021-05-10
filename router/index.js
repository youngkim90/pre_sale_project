const express = require('express');
const router =express.Router();
const path = require('path');
const main = require('./main/main');
const join = require('./join/join');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const db = require('./db');

router.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'../public/main.html'));
});
router.get('/logCheck', function(req,res){
    var msg;
    var errMsg = req.flash('error')
    if(errMsg) {
        msg = errMsg;
        console.log('msg = ' + msg);
        // res.sendFile(path.join(__dirname,'../public/join.html'));
        res.json(msg);
    }
});

router.post('/chkAdmin', function(req, res){
    const query = db.query('select * from userTB where user=?', ['admin'], function(err,rows) {
        if(req.user){
            if(req.user === rows[0].id){
                res.json("true");
            } else {
                res.json("false");
            }
        } else {
            res.json("false");
        }

    });
});

passport.serializeUser(function(user,done){
    console.log('ser= '+ user[0])
    done(null, user.id);
})

passport.deserializeUser(function(id,done){
    console.log('deser= '+ id)
    done(null, id);
})

passport.use('local-join', new localStrategy({
    usernameField: 'userid',
    passwordField: 'password',
    _passReqToCallback: true
}, function(user, password, done){
    const query = db.query('select * from userTB where user=? and passwd=?', [user, password], function(err,rows) {
        if(err) return done(err);

        if(rows.length==0) {
            console.log('existed user')
            return done(null, false, {message : '관리자 정보가 틀립니다.'})
        } else {
            return done(null, {'userid':rows[0].user, 'id':rows[0].id})
            // const sql = {email: email, pw:password};
            // const query = db.query('insert into user set ?', sql, function(err,rows) {
            //     if(err) throw err
            //     return done(null, {'email' : email, 'id' : rows.insertId});
            // })
        }
    })
}));

router.post('/login', function(req,res,next){
    passport.authenticate('local-join', function(err,user,info){
        if(err) res.status(500).json(err);
        if(!user) return res.status(401).json(info.message);

        req.logIn(user, function(err){
           if(err) return next(err);
           return res.json(user);
        });
    })(req, res, next);
});

router.use('/main', main);
router.use('/join', join);

module.exports = router;