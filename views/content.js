var db = require('../router/db');
var fs = require('fs');
var multer = require('multer');

module.exports = {
    content1:function(data, res) {
        var files = getFileList('./public/images/slide');
        var imgList = ``;

        var query = db.query('select * from content1', function (err, rows) {
            if (err) throw err;
            rows.sort(function (a, b) {
                var numA = a.name.slice(9);
                var numB = b.name.slice(9);
                return numA < numB ? -1 : numA > numB ? 1 : 0;
            });
            imgList += `<ul style="width:calc(100% * ${files.length})">`;
            for (var i = 0; i < files.length; i++) {
                imgList += `<li style="width:calc(100% / ${files.length})"><img class="slideImg" src="./images/slide/${files[i]}"/></li>`;
            }
            imgList += `</ul>`;
            var html = `<div class="contents" id="content1-1"><h1>${rows[0].content}</h1></div>
                <div class="contents" id="content1-2"><h2>${rows[1].content}</h2></div>
                <div class="contents" id="content1-3"><h2>${rows[2].content}</h2></div>
                <div class="contents" id="content1-4">
                    <div class="slide">
                        ${imgList}
                    </div>
                </div>
                <div class="contents" id="content1-5">
                    <img src=${rows[4].content}> 
                </div>
                `;
            res.end(html);
        })
    },

    content2:function(data, res) {
        var imgList = '';
        var files = getFileList('./public/images/content2');

        var query = db.query('select * from content2', function(err,rows) {
            if(err) throw err;
            if(rows.length>0){
                db.query('update content2 set content=?, name=?, tag=?',[files.toString(), 'content2-1', 'IMG'], function(err2,result) {
                    if(err2) throw err2
                    for(var i=0; i<files.length; i++){
                        imgList +=`<li><img class="imgList" src="./images/content2/${files[i]}" style="width:100%"/></li>`;
                    }
                    var html = `
                        <div class="contents" id="content2-1">
                            <div>
                                <ul>
                                    ${imgList}
                                </ul>
                            </div>
                        </div>`;
                    res.end(html);
                })
            }
        });
    },

    content3:function(data, res) {
        var files = getFileList('./public/images/content3');

        var query = db.query('select * from content3 where name=?', ['content3'], function (err, rows) {
            if (err) throw err;

            if (rows.length > 0) {
                db.query('update content3 set content=?, tag=? where name=?', [files.toString(), 'IMG', 'content3'], function (err2, result) {
                    if (err2) throw err2
                    var html = getImageHTML('content3',files);
                    res.end(html);
                })
            }
        });
    },

    content4:function(data, res) {
        var query = db.query('select * from content4', function(err,rows) {
            var html = `<div class="contents" id="content4-1" style="text-align:left;width:1000px;"><h1>${rows[0].content}</h1></div>
                <div class="contents" id="content4-2" style="text-align:left";width:1000px;><h2>${rows[1].content}</h2></div>`;
            res.end(html);
        });
    },

    content5:function(data, res) {
        var files = getFileList('./public/images/content5');

        var query = db.query('select * from content5 where name=?', ['content5'], function (err, rows) {
            if (err) throw err;

            if (rows.length > 0) {
                db.query('update content5 set content=?, tag=? where name=?', [files.toString(), 'IMG', 'content5'], function (err2, result) {
                    if (err2) throw err2
                    var html = getImageHTML('content5',files);
                    res.end(html);
                })
            }
        });
    },

    content6:function(data, res) {
        var files = getFileList('./public/images/content6');

        var query = db.query('select * from content6 where name=?', ['content6'], function (err, rows) {
            if (err) throw err;

            if (rows.length > 0) {
                db.query('update content6 set content=?, tag=? where name=?', [files.toString(), 'IMG', 'content6'], function (err2, result) {
                    if (err2) throw err2
                    var html = getImageHTML('content6',files);
                    res.end(html);
                })
            }
        });
    },

    content7:function(data, res) {
        var files = getFileList('./public/images/content7');

        var query = db.query('select * from content7 where name=?', ['content7'], function (err, rows) {
            if (err) throw err;

            if (rows.length > 0) {
                db.query('update content7 set content=?, tag=? where name=?', [files.toString(), 'IMG', 'content7'], function (err2, result) {
                    if (err2) throw err2
                    var html = getImageHTML('content7',files);
                    res.end(html);
                })
            }
        });
    },

    test:function(data,res) {
        var query = db.query('select * from test', function (err, rows) {
            if(err) throw err;
            if(rows.length==0){
                res.end();
            }
        });
    }
}

function getImageHTML(menu, imgList){
    var imgHTML='';
    for (var i=0; i<imgList.length; i++) {
        imgHTML += `<div class="contents" id="${menu}-${i+1}"><img class="imgList" src="./images/${menu}/${imgList[i]}" style="width:100%"/></div>`;
    }
    return imgHTML;
}

function getFileList(path){
    var files = new Array();
    fs.readdir(`${path}`, function(err,fileList){
        if(fileList.length>0){
            for(var j=0; j<fileList.length; j++) {
                files.push(fileList[j]);
            }
        }
    })
    return files;
}