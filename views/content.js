var db = require('../router/db');
var fs = require('fs');

module.exports = {
    content1:function(data, res) {
        if(data=='menu_1') {
            var files = new Array();
            fs.readdir('./public/images/slide', function(err,fileList){
                if(fileList.length>0){
                    for(var j=0; j<fileList.length; j++) {
                        files.push(fileList[j]);
                    }
                }
            })
            var imgList = ``;
            var query = db.query('select * from content1', function(err,rows) {
                if(err) throw err;
                rows.sort(function (a,b){
                    var numA = a.name.slice(9);
                    var numB = b.name.slice(9);
                    return numA < numB ? -1 : numA > numB ? 1 : 0;
                });
                imgList += `<ul style="width:calc(100% * ${files.length})">`;
                for(var i=0; i<files.length; i++){
                    imgList +=`<li style="width:calc(100% / ${files.length})"><img class="slideImg" src="./images/slide/${files[i]}"/></li>`;
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
        }

        else if(data=='menu_2') {
            var files = new Array();
            var imgList = '';
            fs.readdir('./public/images/content2', function(err,fileList){
                if(fileList.length>0){
                    for(var j=0; j<fileList.length; j++) {
                        files.push(fileList[j]);
                    }
                }
            })
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
        }

        else if(data=='menu_3') {
            var files = new Array();
            var imgList = '';

            fs.readdir('./public/images/content3', function(err,fileList){
                if(fileList.length>0){
                    for(var j=0; j<fileList.length; j++) {
                        files.push(fileList[j]);
                    }
                }
            })

            var query = db.query('select * from content3 where name=?', ['content3'], function (err, rows) {
                if (err) throw err;

                if (rows.length > 0) {
                    db.query('update content3 set content=?, tag=? where name=?', [files.toString(), 'IMG', 'content3'], function (err2, result) {
                        if (err2) throw err2
                        for (var i=0; i<files.length; i++) {
                            imgList += `<div class="contents" id="content3-${i+1}"><img class="imgList" src="./images/content3/${files[i]}" style="width:100%"/></div>`;
                        }
                        var html = `${imgList}`;
                        res.end(html);
                    })
                } else {
                    db.query('insert into content3 (content,tag,name) values (?,?,?)', [files.toString(), 'IMG', 'content3'], function (err2, result) {
                        if (err2) throw err2
                    })
                }
            });
        }

        else if(data=='menu_4') {
            var query = db.query('select * from content4', function(err,rows) {
                var html = `<div class="contents" id="content4-1" style="text-align:left;width:1000px;"><h1>${rows[0].content}</h1></div>
                    <div class="contents" id="content4-2" style="text-align:left";width:1000px;><h2>${rows[1].content}</h2></div>`;
                res.end(html);
            });
        }
    }
}