const express = require('express');
const router =express.Router();
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const content = require('../../views/content');
const db = require('../db');
const multer = require('multer');
const fs = require('fs');

var upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, `public/images/${req.body.folder}`);
        },
        filename(req, file, cb) {
            const extension = path.extname(file.originalname);  //확장자
            const fileName = `${req.body.num}` +"_"+path.basename(file.originalname, extension) + "_" + new Date().valueOf() + extension;
            cb(null, fileName);
        }
    })
});

router.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'../public/main.html'));
});

router.post('/content', function(req,res){
    if(req.body){
        const data = req.body.data;
        const tableName = 'content' + data.split("_")[1];
        if(data === 'menu_1') content.content1(tableName, res);
        else if(data === 'footContent') content.footContent(res);
        else content.content(tableName, res);
    }
})

router.post('/update', function(req,res){
    var data = req.body.editData;
    var rowNum = req.body.num;
    var align = req.body.align;
    const tag = req.body.tag;
    const menu = rowNum.split("-")[0];
    const num = rowNum.split("-")[1];

    if(data.indexOf('\r\n')!=-1){
        data = data.split('\r\n').join('<br/>');
    }
    if(data.indexOf('\n')!=-1){
        data = data.split('\n').join('<br/>');
    }

    db.query(`select * from ${menu} where name=?`, [num], function(err,rows) {
        if(err) throw err
        if(rows.length>0){
            const query = db.query(`update ${menu} set name=?, content=?, tag=?, size=? where name=?`, [num, data, tag, align, num], function (err2, result) {
                if(data === 'content1') content.content1(menu, res);
                else content.content(menu, res);
            })
        } else {
            const query = db.query(`insert into ${menu} (name, content, tag, size) values (?,?,?,?)`, [num, data, tag, align], function (err2, result) {
                res.writeHead(302, {Location: `/`});
                res.end();
            })
        }
    })
})

router.post("/uploadImg", upload.single("content_img"),function(req, res) {
    const menu = req.body.folder;
    const num = req.body.num;
    const size = req.body.size;
    console.log(size);
    const fileName = req.file.filename;

    db.query(`select * from ${menu}`, function(err,rows) {
        if(err) throw err
        if(rows.length>0) {
            rows.sort(function (a, b) {
                const numA = Number(a.name);
                const numB = Number(b.name);
                return numA < numB ? -1 : numA > numB ? 1 : 0;
            });
            for (var i = 0; i < rows.length; i++) {
                if (Number(rows[i].name) >= (Number(num) + 1)) {
                    console.log('update test')
                    db.query(`update ${menu} set name=?, content=?, tag=?, size=? where name=?`, [Number(rows[i].name) + 1, rows[i].content, rows[i].tag, rows[i].size, rows[i].name], function (err2, result) {
                        if(err2) throw err2;
                    })
                }
            }
            console.log('insert test');
            const query = db.query(`insert into ${menu} (name, content, tag, size) values (?,?,?,?)`, [Number(num)+1, fileName, 'IMG', size], function (err2, result) {
                if(err2) throw err2;
                if(menu === 'content1') content.content1(menu, res);
                else content.content(menu, res);
            })
        }else {
            console.log('first insert test');
            db.query(`insert into ${menu} (name, content, tag) values (?,?,?)`, [num, fileName, 'IMG'], function (err2, result) {
                if (err2) throw err2;
                if(menu === 'content1') content.content1(menu, res);
                else content.content(menu, res);
            })
        }
        console.log('img upload complete');
    });
});

router.post("/uploadText",function(req, res) {
    var data = req.body.editData;
    const rowNum = req.body.num;
    const tag = req.body.tag;
    const align = req.body.align;
    const menu = rowNum.split("-")[0];
    const num = rowNum.split("-")[1];
    if(data.indexOf('\n')!=-1){
        data = data.split('\n').join('<br/>');
    }

    db.query(`select * from ${menu}`, function(err,rows) {
        if(err) throw err
        if(rows.length>0) {
            rows.sort(function (a, b) {
                const numA = a.name;
                const numB = b.name;
                return numA < numB ? -1 : numA > numB ? 1 : 0;
            });
            for (var i = 0; i < rows.length; i++) {
                    console.log('origin = '+ rows[i].name+'   new = '+ (Number(num) + 1));
                if (Number(rows[i].name) >= (Number(num) + 1)) {
                    console.log('update test')
                    db.query(`update ${menu} set name=?, content=?, tag=?, size=? where name=?`, [Number(rows[i].name) + 1, rows[i].content, rows[i].tag, rows[i].size, rows[i].name], function (err2, result) {
                        if(err2) throw err2;
                    })
                }
            }
            console.log('insert test');
            db.query(`insert into ${menu} (name, content, tag, size) values (?,?,?,?)`, [Number(num)+1, data, tag, align], function (err2, result) {
                if(err2) throw err2;
                if(menu === 'content1') content.content1(menu, res);
                else content.content(menu, res);
            })
        }else {
            console.log('first insert test');
            db.query(`insert into ${menu} (name, content, tag) values (?,?,?)`, [num, data, tag], function (err2, result) {
                if (err2) throw err2;
                if(menu === 'content1') content.content1(menu, res);
                else content.content(menu, res);
            })
        }
        console.log('text upload complete');
    });
});

router.post('/remove', function(req,res){
    const remName = req.body.remMenu;
    const remNum = req.body.remNum;
    var filePath = __dirname

    db.query(`select * from ${remName}`, function(err,rows) {
        if (err) throw err
        if (rows.length > 0) {
            rows.sort(function (a, b) {
                const numA = a.name;
                const numB = b.name;
                return numA < numB ? -1 : numA > numB ? 1 : 0;
            });
            db.query(`select*from ${remName} where name=?`, [remNum], function (err, result) {
                if (err) throw err;
                filePath =path.join(__dirname,`../../public/images/${remName}/${result[0].content}`);
                console.log(filePath);
                fs.unlink(filePath, function(error){
                    if(error) return '삭제할 수 없습니다.';
                    console.log('file remove');
                });
            });
            db.query(`delete from ${remName} where name=?`, [remNum], function (err2, result) {
                if (err2) throw err2;
                console.log('remove test');
            });
            for (var i = 0; i < rows.length; i++) {
                console.log('rowNum = ' + rows[i].name + '   removeNum = ' + (Number(remNum)));
                if (Number(rows[i].name) > Number(remNum)) {
                    console.log('update test')
                    db.query(`update ${remName} set name=? where name=?`, [Number(rows[i].name) - 1, rows[i].name], function (err2, result) {
                        if (err2) throw err2;
                    })
                }
            }

            db.query(`select * from ${remName} where name=?`, ['1'], function (err2, result) {
                if(err2) throw err2;
                if(remName === 'content1') content.content1(remName, res);
                else content.content(remName, res);
            })
        }
    });
});

module.exports = router;