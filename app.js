const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const router = require('./router/index');

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

