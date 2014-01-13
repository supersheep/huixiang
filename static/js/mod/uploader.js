define(function(require){
    require("lib/swfupload.js");
	var Event = require("mod/event");

	var Uploader = function(holder_id){
		var self = this;

		function uploadFile(swfu){
			$.ajax({
				url:"/api/upload/token",
				success:function(token){
					swfu.addPostParam("token",token);
					// filename
					swfu.addPostParam("key", "", +new Date() + ".png");
					swfu.startUpload();
				}
			});
		}

		var handlers = {
			fileDialogComplete:function(count,file_count){
				// number of files selected, number of files queued
				if(file_count <= 0){return;}
				uploadFile(this);
			},
			uploadStart:function(file){
				var swfu = this;

				self.fire("start",{
					file:file
				});
			},
			fileQueued:function(file){
				var swfu = this;
				self.fire("queued",{
					file:file
				})
			},
			fileQueueError:function(file,code,message){
				self.fire("queueError",{
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
			file_upload_limit : 100,
			file_queue_limit : 0,
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

	function init(selector){
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
		return new Uploader("swfu_holder");
	}

	return {
		init:init
	}

});