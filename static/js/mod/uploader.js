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