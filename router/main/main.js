var express = require('express');
var router =express.Router();
var path = require('path');
var app = express();
var content = require('../../views/content');
var db = require('../db');

router.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'../public/main.html'));
});

router.post('/content', function(req,res){
    if(req.body){
        var data = req.body.data;
        content.content1(data, res);
        // console.log('response  '+ responseData)
        // res.end(responseData);
    }
})

router.post('/update', function(req,res){
    var data = req.body.editData;
    var num = req.body.num;
    var tag = req.body.tag;
    if(data.indexOf('\n')!=-1){
        data = data.split('\n').join('<br/>');
    }

    db.query('select * from content1 where name=?', [num], function(err,rows) {
        if(err) throw err
        if(rows.length>0){
            var query = db.query('update content1 set name=?, content=?, tag=? where name=?', [num, data, tag, num], function (err2, result) {
            })
        } else {
            var query = db.query('insert into content1 (name, content, tag) values (?,?,?)', [num, data, tag], function (err2, result) {
            })
        }
        res.writeHead(302, {Location: `/`});
        res.end();
    })
})

module.exports = router;