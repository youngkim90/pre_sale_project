var express = require('express');
var router =express.Router();
var path = require('path');
var main = require('./main/main');
var join = require('./join/join');
var fs = require('fs');

router.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'../public/main.html'));
});

router.post('/searching', function(req,res){
    if(req.body.search){
        var responseData = {'result':'ok', 'search':req.body.search};
        res.json(responseData);
    }
})

router.use('/main', main);
router.use('/join', join);

module.exports = router;