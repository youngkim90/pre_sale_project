var express = require('express');
var router =express.Router();
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
var content = require('../../views/content');
var db = require('../db');
var multer = require('multer');

var upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            console.log(file);
            console.log(req.body);
            cb(null, `../public/images/${req.body.folder}`);
        },
        filename(req, file, cb) {
            const extension = path.extname(file.originalname);  //확장자
            cb(null, `${req.body.num}` +"_"+path.basename(file.originalname, extension) + "_" + new Date().valueOf() + extension);
        }
    })
});

router.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'../public/main.html'));
});

router.post('/content', function(req,res){
    if(req.body){
        const data = req.body.data;
        if(data=='menu_1') content.content1(data, res);
        else if(data=='menu_2') content.content2(data, res);
        else if(data=='menu_3') content.content3(data, res);
        else if(data=='menu_4') content.content4(data, res);
        else if(data=='menu_5') content.content5(data, res);
        else if(data=='menu_6') content.content6(data, res);
        else if(data=='menu_7') content.content7(data, res);
        else if(data=='test_8') content.test(data, res);
    }
})

router.post('/update', function(req,res){
    var data = req.body.editData;
    var num = req.body.num;
    const tag = req.body.tag;
    const menu = num.split("-")[0];
    if(menu==('content3') || menu==('content5') || menu==('content6') || menu==('content7')){
        num = menu;
    }
    if(data.indexOf('\r\n')!=-1){
        data = data.split('\r\n').join('<br/>');
    }

    db.query(`select * from ${menu} where name=?`, [num], function(err,rows) {
        if(err) throw err
        if(rows.length>0){
            const query = db.query(`update ${menu} set name=?, content=?, tag=? where name=?`, [num, data, tag, num], function (err2, result) {
            })
        } else {
            const query = db.query(`insert into ${menu} (name, content, tag) values (?,?,?)`, [num, data, tag], function (err2, result) {
            })
        }
        res.writeHead(302, {Location: `/`});
        res.end();
    })
})

router.post("/upload", upload.single("content_img"),function(req, res) {
    console.log('body ='+req.body);
    console.log('upload complete');
    const data = req.body.data;
    res.end(req.file);
});

module.exports = router;