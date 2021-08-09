//require
const express = require('express');
const bodyParser = require('body-parser');
const web = express();
const path = require('path');
const cors = require('cors');
const router = require('./router/index');
const PORT = 8002


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
web.set('view engine', __dirname + 'pug');
web.set('views', path.join(__dirname,'views'));

//server start
web.listen(PORT, function(){
})

web.use(bodyParser.json())
web.use(bodyParser.urlencoded({extended:true}))
// web.set('public', __dirname + '/public');
web.use(express.static(path.join(__dirname,'public')));
web.use(express.static(path.join(__dirname,'views')));
// web.use(express.static('views'))
web.use(cors())

//route
web.use(router);


