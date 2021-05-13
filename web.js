//require
const express = require('express');
const bodyParser = require('body-parser');
const web = express();
const cors = require('cors');
const router = require('./router/index');
const PORT = 8001

//login session
const passport = require('passport');
const session = require('express-session');
var flash = require('connect-flash');
web.use(flash());
web.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
web.use(passport.initialize());
web.use(passport.session());
//login session

//server start
web.listen(PORT, function(){
})

web.set('views', __dirname + '/views');
web.use(bodyParser.json())
web.use(bodyParser.urlencoded({extended:true}))
web.use(express.static('public'))
web.use(express.static('views'))
web.use(cors())

//route
web.use(router);

