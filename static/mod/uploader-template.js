var $ = require("jquery");
var _ = require('underscore');
var attributes = require('attributes');
var EMPTY='';

module.exports = Template;

function Template(container){
    this.container = $(container);

    var self = this;

     var tpl = '<div id="J_upload_item_<%=id%>" class="pic-wrapper">'
        +'<div class="pic"><div class="percent"></div></div>'
        +'<div class="icon-delete" />'
    +'</div>';

    this.set('tpl',tpl);
}

attributes.patch(Template,{
    uploader:{value:{}},
    tpl:{value:EMPTY}
});


Template.prototype._createItem = function(event){
    var self = this;
    var container = this.container;
    var file = event.file;
    var item = $(_.template(this.get('tpl'),file));
    item.find(".icon-delete").on("click",function(){
        var uploader = self.get("uploader");
        uploader.get("queue").remove(file.id);
    });
    file.block = item;
    item.appendTo(container);
};

Template.prototype._removeHandler = function(e){
    var file = e.file;
    file.block && file.block.remove();
}

Template.prototype._progressHandler = function(e){
    // var file = e.file;
    // var elem = $("#J_upload_item_" + file.id);
    // elem.find(".percent").css("width",e.uploaded/e.total*100 + "%");
}

Template.prototype._successHandler = function(e){
    var file = e.file;
    var data = e.data
    var self = this;
    var elem = $("#J_upload_item_" + file.id);
    var imgSrc = "http://huixiang.qiniudn.com/" + data.key + "?imageView/1/w/90/h/90";
    var img = $("<img />").attr("src",imgSrc);

    if(!elem){return;}
    img.load(function(){
        elem.find(".percent").remove();
        elem.find(".pic").append(img);
        elem.data("key",data.key);
        img.css("display","none");
        img.fadeIn();
    });
}

Template.prototype._completeHandler = function(e){
}


Template.prototype._errorHandler = function(e){
    var file = e.file;
    var data = e.data;
    var elem = $("#J_upload_item_" + file.id);
    // alert([e.code]);
}