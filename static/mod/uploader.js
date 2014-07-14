var Uploader = require('uploader');
var events = require('events');
var util = require('util');
var $ = require('jquery');

function uploadFile(file){
  var uploader = this;
  $.ajax({
    url:"/api/upload/token",
    dataType:"json",
    success:function(json){
      var fileName = json.fileName // random file name generated
      uploader.set('data',{
        token:json.token,
        key:"pic/" + json.fileName + file.type
      });
      uploader.upload();
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
    autoUpload:false,
    swf_config:{
    	flash_url : "/static/swfupload/swfupload.swf"
    }
	}).on("select",function(e){
    uploadFile.call(this,e.files[0]);
	}).on("success",function(e){
	    console.log("success",e);
	}).on("error",function(e){
	    console.log("error",e);
	}).on("complete",function(e){
	    console.log("complete",e);
      uploadFile.call(this,e.file);
	}).on("remove",function(e){
	    console.log("remove",e);
	}).on("load",function(){
	    $("#uploader_wrap .text").text("上传");
	});


	return u;
}

module.exports = {
	init:init
}