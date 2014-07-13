(function(){
function mix(a,b){for(var k in b){a[k]=b[k];}return a;}
var _0 = "huixiang@0.1.0/././js/entries/app.js";
var _1 = "huixiang@0.1.0/././js/entries/header.js";
var _2 = "huixiang@0.1.0/././js/entries/index.js";
var _3 = "huixiang@0.1.0/././js/entries/new.js";
var _4 = "huixiang@0.1.0/././js/entries/people.js";
var _5 = "huixiang@0.1.0/././js/entries/piece.js";
var _6 = "jquery@^1.9.1";
var _7 = "huixiang@0.1.0/js/mod/uploader.js";
var _8 = "huixiang@0.1.0/js/mod/event.js";
var _9 = "huixiang@0.1.0/js/entries/new.js";
var entries = [_0,_1,_2,_3,_4,_5];
var asyncDepsToMix = {};
var globalMap = asyncDepsToMix;
define(_9, [_6,_7], function(require, exports, module, __filename, __dirname) {
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

define(_7, [_6,_8], function(require, exports, module, __filename, __dirname) {
var $ = require('jquery');
var Event = require("./event");

var Uploader = function(holder_id, options){
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

	var handlers = {
		fileDialogComplete:function(count,file_count){
			// number of files selected, number of files queued
			var swfu = this;
			var stats = swfu.getStats();
			if(file_count <= 0){return;}
			if(stats.files_queued + stats.successful_uploads - self.file_removed <= limit){
				uploadFile(this);
			}
		},
		uploadStart:function(file){
			var swfu = this;
			self.fire("start",{
				file:file
			});
		},
		fileQueued:function(file){
			var swfu = this;
			var stats = swfu.getStats();
			if(stats.files_queued + stats.successful_uploads - self.file_removed > limit){
				self.fire("error",{
					code:-100, // 与默认超出数量限制的错误码保持一致
					file:file
				});
			}else{
				self.fire("queued",{
					file:file
				});
			}

		},
		fileQueueError:function(file,code,message){
			self.fire("error",{
				file:file,
				code:code,
				message:message
			});
		},
		uploadProgress:function(file,uploaded,total){
			self.fire("progress",{
				file:file,
				uploaded:uploaded,
				total:total
			});
		},
		uploadError:function(file,code,message){
			self.fire("error",{
				file:file,
				code:code,
				message:message
			});
		},
		// file:
		// The file object that was successfully uploaded
		// data:
		// The data that was returned by the server-side script (anything that was echoed by the file)
		// response:
		// The response returned by the server—true on success or false if no response.
		// If false is returned, after the successTimeout option expires, a response of true is assumed.
		uploadSuccess:function(file,data,response){
			self.fire("success",{
				file:file,
				data:JSON.parse(data),
				res:response
			});
		},
		uploadComplete:function(file){
			self.fire("complete",{
				file:file
			});
			var state = this.getStats();
			if(state.files_queued){
				uploadFile(this);
			}else{
				self.fire("queueComplete",state);
			}
		}
	};
	var settings = {
		flash_url : "/static/swfupload/swfupload.swf",
		upload_url: "http://up.qiniu.com",
		post_params: {},
		file_size_limit : "100 MB",
		file_types : "*.jpg;*.png;*.bmp",
		file_types_description : "All Files",
		file_post_name: "file",
		file_upload_limit : 0,
		file_queue_limit : limit,
		custom_settings : {
			progressTarget : "fsUploadProgress",
			cancelButtonId : "btnCancel"
		},
		debug: false,

		// Button settings
		// button_image_url: "images/TestImageNoText_65x29.png",
		button_width: "24",
		button_height: "24",
		button_placeholder_id: holder_id,
		button_cursor : SWFUpload.CURSOR.HAND,
		button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
		// button_text: '<span class="theFont">Hello</span>',
		// button_text_style: ".theFont { font-size: 16; }",
		button_text_left_padding: 12,
		button_text_top_padding: 3,

		// The event handler functions are defined in handlers.js
		file_queued_handler : handlers.fileQueued,
		file_queue_error_handler : handlers.fileQueueError,
		file_dialog_complete_handler : handlers.fileDialogComplete,
		upload_start_handler : handlers.uploadStart,
		upload_progress_handler : handlers.uploadProgress,
		upload_error_handler : handlers.uploadError,
		upload_success_handler : handlers.uploadSuccess,
		upload_complete_handler : handlers.uploadComplete,
		queue_complete_handler : handlers.queueComplete	// Queue plugin event
	};

	self.swfu = new SWFUpload(settings);
};

Event.mixin(Uploader);

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
    map:mix(globalMap,{"./event":_8})
});

define(_8, [], function(require, exports, module, __filename, __dirname) {
function on(){
    var args = arguments;
    if(typeof args[0] == "object"){
        var obj = args[0];
        for(var key in obj){
            this.on(key, obj[key]);
        }
    }else{
        var name = args[0];
        var func = args[1];
        var events = this.events = this.events || {};
        var thisEvent = events[name] = events[name] || [];
        thisEvent.push(func);
    }
}

function off(name){
    if(!name){
        delete this.events;
    }

    if(this.events && this.events[name]){
        delete this.events[name];
    }
}

function fire(name,eventArgs){
    var self = this;
    var events = (this.events && this.events[name]) || [];
    events.forEach(function(func){
        func.call(self,eventArgs);
    });
}



function mixin(target){
    if(typeof target == "function"){
        target.prototype.on = on;
        target.prototype.off = off;
        target.prototype.fire = fire;
    }else{
        target.on = on;
        target.off = off;
        target.fire = fire;
    }
}

module.exports = {
    fire:fire,
    mixin:mixin,
    on:on,
    off:off
};
}, {
    entries:entries,
    map:globalMap
});
})();