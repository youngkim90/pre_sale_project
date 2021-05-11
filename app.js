const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const router = require('./router/index');
//login session
const passport = require('passport');
const session = require('express-session');
var flash = require('connect-flash');
app.use(flash());
//login session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.listen(8000, function(){
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(express.static('views'))
// app.use(express.static('views'))
app.use(cors())
// app.set('view engine', 'ejs')

app.use(router);


