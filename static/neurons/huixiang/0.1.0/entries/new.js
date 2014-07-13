(function(){
function mix(a,b){for(var k in b){a[k]=b[k];}return a;}
var _0 = "huixiang@0.1.0/entries/app.js";
var _1 = "huixiang@0.1.0/entries/header.js";
var _2 = "huixiang@0.1.0/entries/index.js";
var _3 = "huixiang@0.1.0/entries/new.js";
var _4 = "huixiang@0.1.0/entries/people.js";
var _5 = "huixiang@0.1.0/entries/piece.js";
var _6 = "jquery@^1.9.1";
var _7 = "huixiang@0.1.0/mod/uploader.js";
var _8 = "uploader@^0.1.0";
var _9 = "events@^1.0.5";
var _10 = "util@^1.0.4";
var entries = [_0,_1,_2,_3,_4,_5];
var asyncDepsToMix = {};
var globalMap = asyncDepsToMix;
define(_3, [_6,_7], function(require, exports, module, __filename, __dirname) {
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
}, {
    entries:entries,
    map:mix(globalMap,{"../mod/uploader":_7})
});

define(_7, [_8,_9,_10,_6], function(require, exports, module, __filename, __dirname) {
var uploader = require('uploader');
var events = require('events');
var util = require('util');
var $ = require('jquery');

util.inherits(Uploader, events.EventEmitter);

function Uploader(holder_id, options){
	options = options || {};
	var self = this;
	var limit = options.limit || 0;
	self.file_removed = 0;
	function uploadFile(swfu){
		var file = swfu.getFile();
		$.ajax({
			url:"/api/upload/token",
			dataType:"json",
			success:function(json){
				swfu.addPostParam("token", json.token);
				// filename
				swfu.addPostParam("key", "pic/" + json.fileName + file.type);
				swfu.startUpload();
			}
		});
	}

};

function init(selector,options){
	var holder = $("<div id='swfu_wrapper'><div id='swfu_holder' /></div>");
	var offset = $(selector).offset();
	holder.appendTo($("body"));
	holder.css({
		position:"absolute",
		top:offset.top,
		left:offset.left,
		height: 24,
		width: 24
	})
	return new Uploader("swfu_holder",options);
}

module.exports = {
	init:init
}
}, {
    entries:entries,
    map:globalMap
});
})();