var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var router = require('./router/index');

app.listen(3000, function(){
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(express.static('views'))
app.use(cors())
app.use(router);
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine', 'ejs')

