const express = require('express');
const router =express.Router();
const path = require('path');
const main = require('./main/main');
const join = require('./join/join');

router.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'../public/main.html'));
});
router.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'../public/main.html'));
});

router.use('/main', main);
router.use('/join', join);

module.exports = router;