var Uploader = require('uploader');
var events = require('events');
var util = require('util');
var $ = require('jquery');


function beforeUpload(file, done){
  var uploader = this;
  $.ajax({
    url:"/api/upload/token",
    dataType:"json",
    success:function(json){
      var fileName = json.fileName; // random file name generated
      var token = json.token;
      var type = file.type;
      uploader.set('data',{
        token: token,
        key:"pic/" + fileName + type
      });
      done();
    }
  });
}

function init(selector){
	var u = new Uploader(selector, {
    multipleLen:10,
    action:"http://up.qiniu.com",
    name:"file",
    queueTarget:".pic-row",
    theme:require('./uploader-template'),
    beforeUpload: beforeUpload,
    swf_config:{
    	flash_url : "/static/swfupload/swfupload.swf"
    }
	}).on("load",function(){
	    $("#uploader_wrap .text").text("上传");
	});

	return u;
}

module.exports = {
	init:init
}