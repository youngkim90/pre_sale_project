var express = require('express');
var router =express.Router();
var path = require('path');
var app = express();
var content = require('../../views/content');

router.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'../public/main.html'));
});

router.post('/content', function(req,res){
    console.log(req.body);
    if(req.body){
        var data = req.body.data;
        var responseData = content.content1(data);
        res.end(responseData);
    }
})

module.exports = router;