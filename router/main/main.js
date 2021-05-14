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

//image upload to folder
var upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, `/home/hosting_users/youngkim90/apps/youngkim90_marinacube/public/images/${req.body.folder}`);
        },
        filename(req, file, cb) {
            const extension = path.extname(file.originalname);  //확장자
            const fileName = `${req.body.num}` +"_"+path.basename(file.originalname, extension) + "_" + new Date().valueOf() + extension;
            cb(null, fileName);
        }
    })
});

//initial page
router.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'../public/main.html'));
});

//call content page
router.post('/content', function(req,res){
    if(req.body){
        const data = req.body.data;
        const tableName = 'content' + data.split("_")[1];
        if(data === 'footContent') content.footContent(res);
        else if(tableName === 'content4') content.content4(tableName, res);
        else content.content(tableName, res);
    }
})

//update contents
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
                content.content(menu, res);
            })
        } else {
            const query = db.query(`insert into ${menu} (name, content, tag, size) values (?,?,?,?)`, [num, data, tag, align], function (err2, result) {
                res.writeHead(302, {Location: `/`});
                res.end();
            })
        }
    })
})

//upload image
router.post("/uploadImg", upload.single("content_img"),function(req, res) {
    const menu = req.body.folder;
    const num = req.body.num;
    const size = req.body.size;
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
                    const query = db.query(`update ${menu} set name=?, content=?, tag=?, size=? where name=?`, [Number(rows[i].name) + 1, rows[i].content, rows[i].tag, rows[i].size, rows[i].name], function (err2, result) {
                        if(err2) throw err2;
                        console.log('update complete')
                    })
                }
            }
            const query = db.query(`insert into ${menu} (name, content, tag, size) values (?,?,?,?)`, [Number(num)+1, fileName, 'IMG', size], function (err2, result) {
                if(err2) throw err2;
                console.log('insert complete');
                content.content(menu, res);
            })
        }else {
            const query = db.query(`insert into ${menu} (name, content, tag, size) values (?,?,?,?)`, [num, fileName, 'IMG', size], function (err2, result) {
                if (err2) throw err2;
                content.content(menu, res);
                console.log('first insert complete');
            })
        }
    });
});

//upload text
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
                const numA = Number(a.name);
                const numB = Number(b.name);
                return numA < numB ? -1 : numA > numB ? 1 : 0;
            });
            for (var i = 0; i < rows.length; i++) {
                if (Number(rows[i].name) >= (Number(num) + 1)) {
                    const query =db.query(`update ${menu} set name=?, content=?, tag=?, size=? where name=?`, [Number(rows[i].name) + 1, rows[i].content, rows[i].tag, rows[i].size, rows[i].name], function (err2, result) {
                        if(err2) throw err2;
                        console.log('update complete')
                    })
                }
            }
            const query = db.query(`insert into ${menu} (name, content, tag, size) values (?,?,?,?)`, [Number(num)+1, data, tag, align], function (err2, result) {
                if(err2) throw err2;
                content.content(menu, res);
                console.log('insert complete');
            })
        }else {
            const query = db.query(`insert into ${menu} (name, content, tag, size) values (?,?,?,?)`, [num, data, tag, align], function (err2, result) {
                if (err2) throw err2;
                content.content(menu, res);
                console.log('first insert complete');
            })
        }
    });
});

//remove content
router.post('/remove', function(req,res){
    const remName = req.body.remMenu;
    const remNum = req.body.remNum;
    var filePath = __dirname

    const query = db.query(`select * from ${remName}`, function(err,rows) {
        if (err) throw err
        if (rows.length > 0) {
            rows.sort(function (a, b) {
                const numA = Number(a.name);
                const numB = Number(b.name);
                return numA < numB ? -1 : numA > numB ? 1 : 0;
            });
            const query = db.query(`select*from ${remName} where name=?`, [remNum], function (err, result) {
                if (err) throw err;
                filePath =`/home/hosting_users/youngkim90/apps/youngkim90_marinacube/public/images/${remName}/${result[0].content}`;
                fs.unlink(filePath, function(error){
                    if(error) return '삭제할 수 없습니다.';
                    console.log('file remove complete');
                });
            });
            const query2 = db.query(`delete from ${remName} where name=?`, [remNum], function (err2, result) {
                if (err2) throw err2;
                console.log('remove complete');
            });
            for (var i = 0; i < rows.length; i++) {
                if (Number(rows[i].name) > Number(remNum)) {
                    const query = db.query(`update ${remName} set name=? where name=?`, [Number(rows[i].name) - 1, rows[i].name], function (err2, result) {
                        if (err2) throw err2;
                        console.log('update complete')
                    })
                }
            }

            const query3 = db.query(`select * from ${remName} where name=?`, ['1'], function (err2, result) {
                if(err2) throw err2;
                content.content(remName, res);
            })
        }
    });
});

router.post('/question', function(req,res) {
    const custName = req.body.name;
    const custPhone = req.body.phone;
    var quest = req.body.quest;
    var emailData = {
        'from_name': custName,
        'message': quest,
        'phone': custPhone
    }

    if(quest.indexOf('\r\n')!=-1){
        quest = quest.split('\r\n').join('<br/>');
    }
    if(quest.indexOf('\n')!=-1){
        quest = quest.split('\n').join('<br/>');
    }

    const query = db.query(`insert into question (name,phone,quest) values (?,?,?)`, [custName,custPhone,quest], function (err, result) {
        if(err) return err;
        res.json(emailData);
    });
});

module.exports = router;