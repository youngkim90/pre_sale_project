const db = require('../router/db');
const fs = require('fs');

module.exports = {
    content:function(data,res) {
        const query = db.query(`select * from ${data}`, function (err, rows) {
            if(err) throw err;
            if(rows.length==0){
                res.end();
            } else {
                var html = '';
                const sortRows = sortWithName(rows)
                // const num = data.substring(data.length-1,data.length);
                for(var i=0; i<sortRows.length; i++){
                    const tag = sortRows[i].tag;
                    const content = sortRows[i].content;
                    const rowName = data+"-"+sortRows[i].name;
                    const row = getContentHTML(rowName, content, tag);
                    html+=row;
                }
                res.end(html);
            }
        });
    },
    content1:function(data, res) {
        const files = getFileList('./public/images/slide');
        var imgList = ``;

        const query = db.query('select * from content1', function (err, rows) {
            if (err) throw err;
            imgList += `<ul style="width:calc(100% * ${files.length})">`;
            for (var i = 0; i < files.length; i++) {
                imgList += `<li style="width:calc(100% / ${files.length})"><img class="slideImg" src="./images/slide/${files[i]}"/></li>`;
            }
            imgList += `</ul>`;
            var html = `
                <div class="slide">
                    ${imgList}
                </div>
            `;
            if(rows.length>0) {
                const sortRows = sortWithName(rows)
                for (var j = 0; j < sortRows.length; j++) {
                    const tag = sortRows[j].tag;
                    const content = sortRows[j].content;
                    const rowName = data + "-" + sortRows[j].name;
                    const row = getContentHTML(rowName, content, tag);
                    html += row;
                }
            }
            res.end(html);
        })
    }
}

function sortWithName(data){
    var rows = data;
    rows.sort(function (a, b) {
        const numA = a.name;
        const numB = b.name;
        return numA < numB ? -1 : numA > numB ? 1 : 0;
    });
    return rows;
}

function getContentHTML(rowId, content, tag){
    var html = `<div class="contents" id="${rowId}">`;
    if(tag=='H1'){
        html+=`<h1>${content}</h1>`
    }
    else if(tag=='H2'){
        html+=`<h2>${content}</h2>`
    }
    else if(tag=='H3'){
        html+=`<h3>${content}</h3>`
    } else {
        const menu = rowId.split("-")[0];
        html+=`<img class="imgList" src="./images/${menu}/${content}"/>`
    }
    html += '</div>';
    return html;
}

function getFileList(path){
    const files = new Array();
    fs.readdir(`${path}`, function(err,fileList){
        if(fileList.length>0){
            for(var j=0; j<fileList.length; j++) {
                files.push(fileList[j]);
            }
        }
    })
    return files;
}