var express = require('express');
var router =express.Router();
var path = require('path');
var main = require('./main/main');
var join = require('./join/join');

router.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'../public/main.html'));
});

router.use('/main', main);
router.use('/join', join);

module.exports = router;