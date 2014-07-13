var $ = require('jquery');
var uploader = require('../mod/uploader');

var share_btns = $(".toweibo,.todouban");
var private_el = $("#private");
var toggle_private = false;

var uploadInstance = uploader.init(".icon-image",{
    limit:2
});
var uploading = {};
uploadInstance.on({
    "start":function(e){
    },
    "success":function(e){
        var self = this;
        var imgSrc = "http://huixiang.qiniudn.com/" + e.data.key + "?imageView/1/w/90/h/90";
        var img = $("<img />").attr("src",imgSrc);

        var block = uploading[e.file.id] && uploading[e.file.id].block;
        if(!block){return;}
        img.load(function(){
            block.find(".percent").remove();
            block.find(".pic").append(img);
            block.data("key",e.data.key);
            img.css("display","none");
            img.fadeIn();
        });
    },
    "progress":function(e){
        var percent = (e.uploaded/e.total * 100).toFixed(0);
        var block = uploading[e.file.id] && uploading[e.file.id].block;
    },
    "queued":function(e){
        uploading[e.file.id] = {};
        $(".pic-row").show();
        var block = uploading[e.file.id].block = $('<div class="pic-wrapper"><div class="pic"><div class="percent"></div></div></div>');
        block.appendTo($(".pic-row"));
        var close = $("<div class='icon-delete' />");
        close.on("click",function(){
            if(!uploading[e.file.id]){
                uploadInstance.file_removed++;
            }
            uploadInstance.swfu.cancelUpload(e.file.id);
            block.remove();
        });
        block.append(close);
    },
    "error":function(e){
        var errors = {
            "-100":"一次最多上传四张"
        }
        e.file && uploadInstance.swfu.cancelUpload(e.file.id);
        errors[e.code] && alert(errors[e.code]);
    },
    "complete":function(e){
        delete uploading[e.file.id];
    },
    "queueError":function(e){
        console && console.error("queueError",e);
    },
    "queueComplete":function(e){
        console && console.log("queueComplete",e);
    }
});

share_btns.on("click",function(e){
    if(private_el.prop("checked")){return;}
    var elem = $(this).toggleClass("active");
});

private_el.on("click",function(){
    if(!toggle_private){
        $(".share").hide();
        share_btns.each(function(i,el){
            el = $(el)
            el.data("selected",el.hasClass("active")).removeClass("active");
        });
    }else{
        $(".share").show();
        share_btns.each(function(i,el){
            el = $(el)
            if(el.data("selected")){
                el.addClass("active");
            }
        });
    }
    toggle_private = !toggle_private;
});

$(".new-form").on("submit",function(){
    if(!$(".textarea").val().trim()){
        alert("请填写内容");
        return false;
    }
    if($(".pic .percent").length){
        alert("图还没传完呢");
        return false;
    }
    $("#pics").val($(".pic-wrapper").map(function(i,el){
        return $(el).data("key");
    }).get().join(","));
    return true;
});