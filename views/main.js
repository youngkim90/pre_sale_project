window.onload = function(){
    getFooter();
    $(window).resize(function(){
        if(window.innerWidth > 767){
            $(".menu_list").css('display','flex');
            $(".menu-toggle").attr('expanded','false');
        } else {
            $(".menu_list").css('display','none');
        }
    });
}

//get main contents
function getContent(data) {
    $(".main-content").empty();
    var data = {'data' : data};
    data = JSON.stringify(data);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '../main/content');
    xhr.setRequestHeader('Content-Type',"application/json");
    xhr.send(data);

    xhr.addEventListener('load', function(){
        if($("li[class='menu active']")[0].id == 'menu_4'){
            addEventsForCustReception(xhr.responseText);
        } else {
            if (xhr.responseText != 'nodata') {
                const main_content = document.querySelector('.main-content');
                main_content.innerHTML = xhr.responseText;
                if($("li[class='menu active']")[0].id == 'menu_1'){
                    const contact = `
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
                    main_content.innerHTML = xhr.responseText + contact;
                }
                if ($("input[name='adCheck']").length > 0 && $("input[name='adCheck']")[0].value == 'checked') {
                    addEventsForContent();
                } else {
                    $(".slide").mouseover(function () {
                        $(".slide").attr('class', 'slide is-paused');
                    });
                    $(".slide").mouseout(function () {
                        $(".slide").attr('class', 'slide');
                    });
                }
            }
            if ($("input[name='adCheck']").length > 0 && $("input[name='adCheck']")[0].value == 'checked') {
                addEmptyContent();
            }
        }
    });
}

function addEventsForCustReception(html){
    const main_content = document.querySelector('.main-content');
    main_content.innerHTML = html;

    $("div.submit_btn").on("click",function(){
        const info1 = $("#info1").val();
        const info2 = $("#info2").val();
        const info3 = $("#info3").val();
        const cheInfo = $("input:checkbox[id='agreeChk']").is(':checked');
        if(!info1 || !info2 || !info3){
            alert('내용을 모두 입력해주세요');
            return
        }
        if(!cheInfo){
            alert('개인정보 수집의 동의가 필요합니다.');
            return
        }
        var data = {'name' : info1,
            'phone' : info2,
            'quest' : info3
        };
        data = JSON.stringify(data);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '../main/question');
        xhr.setRequestHeader('Content-Type',"application/json");
        xhr.send(data);

        xhr.addEventListener('load', function(){
            if(xhr.responseText){
                alert('문의가 완료되었습니다. 최대한 빠르게 연락 드리겠습니다.');
                sendMail(xhr.responseText);
            }
        });
    })
}

function sendMail(info){
    var template = JSON.parse(info);
    console.log(template);
    emailjs.send("service_ufxaalk", "template_rmqms6e", template,"user_Ry68wJ7hQ53fSlQDmlVtt").then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        window.location.href = "/";
    }, function(err) {
        console.log('FAILED...', err);
    });
}

function addEmptyContent(){
    const contentDiv = $("div.contents");
    if(contentDiv.length===0){
        const menuId = $("li.active")[0].id;
        const conNum = menuId.split("_")[1];
        const contentsDiv = $("<div>").attr({class:'emptyContents show',id:`empty${conNum}-1`});
        const addCont = $("<img>").attr({class:'addCont',src:'./images/추가.png'}).appendTo(contentsDiv);
        contentsDiv.appendTo($(".main-content"));

        addCont.on('mousedown', function(event){
            addCont.attr('src','./images/추가_클릭.png');
        })
        addCont.on('click', function(event){
            addCont.attr('src','./images/추가.png');
            const parent = this.parentElement;
            uploadContents(parent);
        })
    } else {
        for (var i = 0; i < contentDiv.length; i++) {
            const emptyId = 'empty' + contentDiv[i].id.substring(7, contentDiv[i].id.length)
            const emptyDiv = $("<div>").attr({class: 'emptyContents show', id: emptyId});
            contentDiv[i].after(emptyDiv[0]);

            const addCont = $("<img>").attr({class: 'addCont', src: './images/추가.png'}).appendTo(emptyDiv);
            addCont.on('mousedown', function (event) {
                addCont.attr('src', './images/추가_클릭.png');
            })
            addCont.on('click', function (event) {
                addCont.attr('src','./images/추가.png');
                if($(".editForm").length==0 && $(".uploadForm").length==0) {
                    uploadContents(emptyDiv[0]);
                } else {
                    alert('진행중인 작업이 있습니다.');
                    addCont.attr('src', './images/추가.png');
                }
            });
        }
    }
}

function uploadContents(parent){
    const menu = parent.id.split("-")[0];
    parent.children[0].style.display ="none";
    const addImg = $("<img>").attr({class:'addImg',src:'./images/이미지.png',style:'width:100px;'}).appendTo(parent);
    const addText = $("<img>").attr({class:'addText',src:'./images/글.png',style:'width:52px;'}).appendTo(parent);
    addImg.on('mousedown', function(event){
        this.setAttribute('src','./images/이미지_클릭.png');
    })
    addText.on('mousedown', function(event){
        this.setAttribute('src','./images/글_클릭.png');
    })
    addImg.on('click', function(event){
        const parent = this.parentElement;
        this.remove();
        $(".addText").remove();
        const num = Number(parent.id.split("-")[1]);
        const folder = 'content'+ $("li[class='menu active']")[0].id.split("_")[1];
        const uploadForm = $("<form>").attr({class:'uploadForm',action:'/main/uploadImg',encType:'multipart/form-data',method:'POST'});
        $("<input>").attr({type:'hidden', name:'folder', value:folder}).appendTo(uploadForm);
        $("<input>").attr({type:'hidden', name:'num', value:num}).appendTo(uploadForm);
        $("<input>").attr({type:'file',name:'content_img',accept:'image/jpg,image/png,image/jpeg'}).appendTo(uploadForm);
        $("<div>").attr('style','display:inline').text('글씨크기: ').appendTo(uploadForm);
        $("<input>").attr({type:'radio', name:'chk_size', id:'size_1', value:'1', checked:true}).appendTo(uploadForm);
        $("<label>").attr({for:'size_1'}).text('원본').appendTo(uploadForm);
        $("<input>").attr({type:'radio', name:'chk_size', id:'size_2', value:'2'}).appendTo(uploadForm);
        $("<label>").attr({for:'size_2'}).text('크게').appendTo(uploadForm);
        const submitBtn = $("<input>").attr({type:'submit'});
        const cancelBtn = $("<button>").attr('class','cancel').text('취소');
        uploadForm.appendTo(parent);
        submitBtn.appendTo(parent);
        cancelBtn.appendTo(parent);

        cancelBtn.on('click', function(event){
            $(".uploadForm")[0].previousSibling.style.display='';
            $(".uploadForm")[0].previousSibling.parentElement.className = 'emptyContents show'
            $(".uploadForm").remove();
            this.remove();
            $("input[type='submit']").remove();
        });

        submitBtn.on('click', function(event){
            const chkList = $("input[name='chk_size']");
            var chk = '';
            for(var j=0; j<chkList.length; j++){
                if(chkList[j].checked == true){
                    chk = chkList[j].value;
                }
            }
            $("<input>").attr({type:'hidden', name:'size', value:chk}).appendTo($(".uploadForm"));
            const formData = new FormData($(".uploadForm")[0]);
            const contType = 'image';
            sendAjax('/main/uploadImg',formData,contType);
        });
    })
    addText.on('click', function(event){
        const parent = this.parentElement;
        const contentName = parent.id.replace('empty','content');
        parent.className = 'emptyContents';
        parent.style.height = 'auto';
        this.remove();
        $(".addImg").remove();

        const editForm = $("<form>").attr({class:'editForm',action:'/main/uploadText', method:'POST'});
        $("<div>").attr('style','display:inline').text('글씨크기: ').appendTo(editForm);
        $("<input>").attr({type:'radio', name:'chk_tag', id:'tag_h3', value:'H3'}).appendTo(editForm);
        $("<label>").attr({for:'tag_h3'}).text('작게').appendTo(editForm);
        $("<input>").attr({type:'radio', name:'chk_tag', id:'tag_h2', value:'H2', checked:true}).appendTo(editForm);
        $("<label>").attr({for:'tag_h2'}).text('중간').appendTo(editForm);
        $("<input>").attr({type:'radio', name:'chk_tag', id:'tag_h1', value:'H1'}).appendTo(editForm);
        $("<label>").attr({for:'tag_h1'}).text('크게').appendTo(editForm);
        $("<div>").attr('style','display:inline;left:20%;position:relative;').text('정렬: ').appendTo(editForm);
        $("<input>").attr({type:'radio', name:'chk_align', id:'align_1', value:'1', style:'left:20%;position:relative;'}).appendTo(editForm);
        $("<label>").attr({for:'align_1',style:'left:20%;position:relative;'}).text('왼쪽').appendTo(editForm);
        $("<input>").attr({type:'radio', name:'chk_align', id:'align_2', value:'2', style:'left:20%;position:relative;',checked:true}).appendTo(editForm);
        $("<label>").attr({for:'align_2',style:'left:20%;position:relative;'}).text('가운데').appendTo(editForm);

        $("<textarea>").attr({class:'editContent',rows:'3',cols:'100',name:'editData'}).appendTo(editForm);
        $("<input>").attr({type:'hidden', name:'num', value:contentName}).appendTo(editForm);


        //form에 추가
        editForm.appendTo(parent);
        //submit 버튼 추가
        const divBtn = $("<div>").attr('class', 'btn_div');
        const submitBtn = $("<button>").attr('class','submit').text('확인');
        const cancelBtn = $("<button>").attr('class','cancel').text('취소');
        submitBtn.appendTo(divBtn);
        cancelBtn.appendTo(divBtn);
        divBtn.appendTo(parent);

        submitBtn.on('click', function(event){
            if($(".editContent")[0].value){
                const tagList = $("input[name='chk_tag']");
                const alignList = $("input[name='chk_align']");
                var chkTag = '';
                var chkAlign = '';
                for(var j=0; j<tagList.length; j++){
                    if(tagList[j].checked == true){
                        chkTag = tagList[j].value;
                    }
                }
                for(var k=0; k<alignList.length; k++){
                    if(alignList[k].checked == true){
                        chkAlign = alignList[k].value;
                    }
                }
                var data = {
                    "editData": $(".editContent")[0].value,
                    "num": $(".editContent")[0].nextSibling.value,
                    "tag": chkTag,
                    "align": chkAlign
                };
                data = JSON.stringify(data);
                const contType = 'text';
                sendAjax('/main/uploadText', data, contType);
            } else {
                alert('내용을 입력하세요');
            }
        });
        cancelBtn.on('click', function(event){
            $(".editForm")[0].previousSibling.style.display='';
            $(".editForm")[0].previousSibling.parentElement.className = 'emptyContents show'
            $(".editForm").remove();
            $(".btn_div").remove();
        });
    });
}

function addEventsForContent(){
    $(".slide").mouseover(function(){
        $(".slide").attr('class','slide is-paused');
    });
    $(".slide").mouseout(function(){
        $(".slide").attr('class','slide');
    });
    $(".contents").mouseover(function(){
        if($(".btn_group").length==0 && $(".editForm").length==0){
            const parent = this;
            parent.setAttribute('class', 'contents editable');
            const div = $("<div>").attr('class','btn_group');
            const editBtn = $("<button>").attr('class','edit').text('수정');
            const removeBtn = $("<button>").attr('class','remove').text('삭제');
            if(parent.children[0].tagName=='IMG'){
                removeBtn.appendTo(div);
            } else {
                editBtn.appendTo(div);
                removeBtn.appendTo(div);
            }
            div.prependTo(parent);

            editBtn[0].addEventListener('click',function(event){
                const parent = event.path[2];
                const content = parent.children[1];
                parent.className = 'contents editMode';
                $("button.remove").remove();
                this.remove();
                const editForm = $("<form>").attr({class:'editForm',action:'/main/update', method:'POST'});

                if(content.tagName=='DIV'){
                    if(content.className!=null && content.className=='slide'){
                        const imgList = $('.slide').children().children().children();
                        var srcList =''
                        for(var i=0; i<imgList.length; i++){
                            if(imgList.length-1 == i){
                                srcList = srcList + imgList[i].getAttribute('src')
                            } else {
                                srcList = srcList + imgList[i].getAttribute('src') + ',';
                            }
                        }
                        $("<input>").attr({class:'editContent',type:'hidden', name:'editData', value:srcList}).appendTo(editForm);
                        $("<input>").attr({type:'hidden', name:'tag', value:'IMG'}).appendTo(editForm);
                        $("<input>").attr({type:'hidden', name:'num', value:parent.id}).appendTo(editForm);
                    }
                } else if(content.tagName=='IMG'){
                    const imgSrc = content.getAttribute('src');
                    $("<input>").attr({class:'editContent', type:'hidden', name:'editData', value:imgSrc}).appendTo(editForm);
                    $("<input>").attr({type:'hidden', name:'tag', value:'IMG'}).appendTo(editForm);
                    $("<input>").attr({type:'hidden', name:'num', value:parent.id}).appendTo(editForm);
                } else {
                    content.style.display = 'none';
                    //편집모드 전환, textarea 생성
                    $("<div>").attr('style','display:inline').text('글씨크기: ').appendTo(editForm);
                    $("<input>").attr({type:'radio', name:'chk_tag', id:'tag_h3', value:'H3'}).appendTo(editForm);
                    $("<label>").attr({for:'tag_h3'}).text('작게').appendTo(editForm);
                    $("<input>").attr({type:'radio', name:'chk_tag', id:'tag_h2', value:'H2', checked:true}).appendTo(editForm);
                    $("<label>").attr({for:'tag_h2'}).text('중간').appendTo(editForm);
                    $("<input>").attr({type:'radio', name:'chk_tag', id:'tag_h1', value:'H1'}).appendTo(editForm);
                    $("<label>").attr({for:'tag_h1'}).text('크게').appendTo(editForm);
                    $("<div>").attr('style','display:inline;left:20%;position:relative;').text('정렬: ').appendTo(editForm);
                    $("<input>").attr({type:'radio', name:'chk_align', id:'align_1', value:'1', style:'left:20%;position:relative;'}).appendTo(editForm);
                    $("<label>").attr({for:'align_1',style:'left:20%;position:relative;'}).text('왼쪽').appendTo(editForm);
                    $("<input>").attr({type:'radio', name:'chk_align', id:'align_2', value:'2', style:'left:20%;position:relative;',checked:true}).appendTo(editForm);
                    $("<label>").attr({for:'align_2',style:'left:20%;position:relative;'}).text('가운데').appendTo(editForm);
                    $("<textarea>").attr({class:'editContent',rows:'3',cols:'100',name:'editData'})
                        .html(content.innerHTML.replaceAll("<br>","\n")).appendTo(editForm);
                    $("<input>").attr({type:'hidden', name:'tag', value:content.tagName}).appendTo(editForm);
                    $("<input>").attr({type:'hidden', name:'num', value:parent.id}).appendTo(editForm);

                    const divTag = $("<div>").attr('class', 'tag_div');
                }
                editForm.appendTo(parent);

                //submit 버튼 추가
                const divBtn = $("<div>").attr('class', 'btn_div');
                const submitBtn = $("<button>").attr('class','submit').text('확인');
                submitBtn.appendTo(divBtn);
                divBtn.appendTo(parent);

                submitBtn.on('click', function(event){
                    if($(".editContent")[0].value) {
                        $("input:radio[name='chk_align']:checked").val()
                        $("input:radio[name=chk_tag]").is(':checked');
                        var chkTag = '';
                        var chkAlign = '';
                        if($("input:radio[name='chk_tag']").is(':checked')) {
                            chkTag = $("input:radio[name='chk_tag']:checked").val();
                        } else {
                            chkTag = $(".editContent")[0].nextSibling.value;
                        }
                        if($("input:radio[name='chk_align']").is(':checked')){
                            chkAlign = $("input:radio[name='chk_align']:checked").val();
                        }
                        var contData = {
                            "editData": $(".editContent")[0].value,
                            "tag": chkTag,
                            "num": $(".editContent")[0].nextSibling.nextSibling.value,
                            "align": chkAlign
                        };
                        contData = JSON.stringify(contData);
                        const contType = 'text';
                        sendAjax('/main/update', contData, contType);
                    } else {
                        alert('내용을 입력하세요')
                    }
                });
            });

            removeBtn[0].addEventListener('click',function(event) {
                const parent = event.path[2];
                const content = parent.children[0];
                parent.className = 'contents editMode';
                $("button.edit").remove();
                this.remove();
                if($(".emptyContents").length==1){
                    const resetId = $("li[class='menu active']")[0].id.split("_")[1];
                    $(".emptyContents")[0].setAttribute('id','empty'+resetId+'-1')
                }

                var contData = {
                    "remMenu": parent.id.split("-")[0],
                    "remNum": parent.id.split("-")[1]
                };
                contData = JSON.stringify(contData);
                var contType = '';
                if(content.tagName=='IMG'){
                    contType = 'image';
                } else {
                    contType = 'text';
                }
                sendAjax('/main/remove',contData,contType);
            });
        }
    });
    $(".contents").mouseout(function(event){
        if(event.toElement.className!=null && (event.toElement.className=='btn_group' || event.toElement.className=='edit' || event.toElement.className=='remove')) {
        } else {
            this.setAttribute('class','contents');
            if($(".btn_group")){
                $(".btn_group").remove();
            }
        }
    });
}

function checkAdmin(){
    const data = {'loginCheck':'main'};
    var xhr = new XMLHttpRequest();
    xhr.open("POST" , '/chkAdmin' );
    // xhr.setRequestHeader('Content-Type',"application/json");
    xhr.send(data);

    xhr.addEventListener('load', function(){
        var headArea = $(".header-area")
        if(JSON.parse(xhr.responseText) === "true"){
            if($("input[name='adCheck']").length>0) {
                $("input[name='adCheck']").value == 'checked';
            } else {
                $("<input>").attr({type: 'hidden', name: 'adCheck', value: 'checked'}).appendTo(headArea[0]);
            }
            $(".admin_login").css('display','none');
            $(".admin_logout").css('display','');
            $("body").attr('');
        } else if(JSON.parse(xhr.responseText) === "false") {
            if($("input[name='adCheck']").length>0) {
                $("input[name='adCheck']").value == 'notChecked';
            } else {
                $("<input>").attr({type: 'hidden', name: 'adCheck', value: 'notChecked'}).appendTo(headArea[0]);
            }
            $(".admin_logout").css('display','none');
            $(".admin_login").css('display','');
            $("body").attr({oncontextmenu:'return false', ondragstart:'return false',onselectstart:'return false'});
        }
        const allMenu = document.querySelectorAll('.menu');
        allMenu[0].classList.add('active');
        getContent(allMenu[0].id);

        for(var i=0; i<allMenu.length; i++){
            allMenu[i].addEventListener('click', function(){
                $("li[class='menu active']").attr('class','menu');
                this.classList.add('active');
                const menuId = this.id
                if($(".menu-toggle").attr('expanded') === "true"){
                    $(".menu-toggle").attr('expanded','false');
                    $(".menu_list").css('display','none');
                }
                getContent(menuId);
            })
        }
    });
}

//비동기 방식으로 컨텐츠 호출
function sendAjax(url, data, type){
    var xhr = new XMLHttpRequest();
    xhr.open("POST" , url );
    if(type=='text') xhr.setRequestHeader('Content-Type',"application/json");
    xhr.send(data); //서버로 요청

    //서버에서 응답이 왔을 때 이벤트 발생
    xhr.addEventListener('load', function(){
        const main_content = document.querySelector('.main-content');
        main_content.innerHTML = xhr.responseText;
        if($("input[name='adCheck']").length>0 && $("input[name='adCheck']")[0].value=='checked') {
            addEventsForContent();
            addEmptyContent();
        }
    });
}

function toggleHedaer(){
    if ($(".menu-toggle").attr('expanded') == 'false') {
        $(".menu-toggle").attr('expanded', 'true');
        $(".menu_list").css('display', 'block');
    } else {
        $(".menu-toggle").attr('expanded', 'false');
        $(".menu_list").css('display', 'none');
    }
}

function getFooter(){
    $(".footer-area").empty();
    var data = {'data' : 'footContent'};
    data = JSON.stringify(data);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '../main/content');
    xhr.setRequestHeader('Content-Type',"application/json");
    xhr.send(data);

    xhr.addEventListener('load', function(){
        const foot_content = document.querySelector('.footer-area');
        foot_content.innerHTML = xhr.responseText;

        var footMenu = $(".footMenu");
        for(var i=0; i<footMenu.length; i++){
            footMenu[i].addEventListener('click', function(){
                var menuId = this.id
                menuId = menuId.replace('footmenu','menu');
                $("li.active").attr('class','menu');
                document.querySelector('#'+menuId).classList.add('active');
                getContent(menuId);
                window.scrollTo(0,0);
            })
        }
        checkAdmin();

    });
}
