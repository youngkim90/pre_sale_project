const db = require('../router/db');
const fs = require('fs');

module.exports = {
    // main content
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
                    const row = getContentHTML(data,sortRows[i]);
                    html+=row;
                }
                res.end(html);
            }
        });
    },
    content4:function(data, res){
        var html = `
            <div class="imgContent">
                <img src="./images/content4/고객접수.png" style="max-width:90%"></img>
            </div>
            <form class="receptionForm">
                <div><div class="contTitle">성함<span style="color:red">*</span></div>
                <div class="contInput"><input type="text" class="custInfo" id="info1"></input></div></div></br>             
                <div><div class="contTitle">연락처<span style="color:red">*</span></div>
                <div class="contInput"><input type="text" class="custInfo" id="info2"></div></div></br>             
                <div style="position:relative;"><div class="contTitle">문의사항<span style="color:red">*</span></div>
                <div class="contInput"><textarea class="questArea" id="info3" rows="5"></textarea></div></br>
                
                <div style="top:50px;position:relative;"><div class="agreeCheck"><input type="checkbox" id="agreeChk" name="custAgree"></div>
                <div class="agreeText">개인정보 수집 및 이용 동의 </div></div></br>
                
                <div class="submit_btn">문의하기</div>
            </form>
        `;
        res.end(html);
    },

    //not use
    // content1:function(data, res) {
    //     const files = getFileList('./public/images/slide');
    //
    //     db.query('select * from content1', function (err, rows) {
    //         if (err) throw err;
    //         const sortRows = sortWithName(rows);
    //         const slideList = files;
    //         var imgList = `<ul>`;
    //         for (var i = 0; i < slideList.length; i++) {
    //             imgList += `<li><img class="slideImg" src="./images/slide/${slideList[i]}"/></li>`;
    //         }
    //         imgList += `</ul>`;
    //         var html = `
    //             <div class="slide">
    //                 ${imgList}
    //             </div>
    //         `;
    //         if(rows.length>0) {
    //             for (var j = 0; j < sortRows.length; j++) {
    //                 const tag = sortRows[j].tag;
    //                 const content = sortRows[j].content;
    //                 const rowName = data + "-" + sortRows[j].name;
    //                 const row = getContentHTML(data,sortRows[j]);
    //                 html += row;
    //             }
    //         }
    //         res.end(html);
    //     })
    // },

    //foot contents
    footContent: function(res){
        var html = `<ul class="foot_list">
                        <li class="footMenu" id="footmenu_1"><a href="javascript:void(0)">반달섬 마리나 큐브</a></li>
                        <li class="footMenu" id="footmenu_2"><a href="javascript:void(0)">사업개요</a></li>
                        <li class="footMenu" id="footmenu_3"><a href="javascript:void(0)">교통안내</a></li>
                        <li class="footMenu" id="footmenu_4"><a href="javascript:void(0)">고객접수</a></li>
                        <li class="footMenu" id="footmenu_5"><a href="javascript:void(0)">평면도</a></li>
                        <li class="footMenu" id="footmenu_6"><a href="javascript:void(0)">커뮤니티</a></li>
                        <li class="footMenu" id="footmenu_7"><a href="javascript:void(0)">주변입지</a></li>
                    </ul>
                    <p class="footMark">반달섬 마리나 큐브 대표번호 1877-7449 Copyright © All rights reserved.</p>
                    <p class="footMark"> Hosting by cafe24 | MADE BY 김영완</p>
                    <div class="admin_login"><a href="./join">관리자</a></div>
                    <div class="admin_logout"><a href="./join">로그아웃</a></div>
        `;
        res.end(html);
    }
}

//sort data
function sortWithName(data){
    var rows = data;
    rows.sort(function (a, b) {
        const numA = Number(a.name);
        const numB = Number(b.name);
        return numA < numB ? -1 : numA > numB ? 1 : 0;
    });
    return rows;
}

//get content
function getContentHTML(data, rows){
    const tag = rows.tag;
    const content = rows.content;
    const rowName = data+"-"+rows.name;
    const size = rows.size;
    var html = `<div class="contents" id="${rowName}">`;
    if(tag=='H1'){
        if(size=='1') {
            html += `<h1 style="text-align: left;">${content}</h1>`
        } else {
            html += `<h1>${content}</h1>`
        }
    }
    else if(tag=='H2'){
        if(size=='1') {
            html += `<h2 style="text-align: left;">${content}</h2>`
        } else {
            html += `<h2>${content}</h2>`
        }
    }
    else if(tag=='H3'){
        if(size=='1') {
            html += `<h3 style="text-align: left;">${content}</h3>`
        } else {
            html += `<h3>${content}</h3>`
        }
    } else {
        const menu = rowName.split("-")[0];
        if(size === '2') {
            html += `<img class="imgList" src="./images/${menu}/${content}" style="width:100%;"/>`
        } else {
            html += `<img class="imgList" src="./images/${menu}/${content}"/>`
        }
    }
    html += '</div>';
    return html;
}

//get file list
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