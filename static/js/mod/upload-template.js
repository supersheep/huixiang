var $ = require("jquery");
var _ = require('underscore');
var attributes = require('attributes');
var EMPTY='';

module.exports = Template;

function Template(container){
    this.container = $(container);

    var self = this;

     var tpl = '<li id="J_upload_item_<%=id%>">'+
                '<div class="pic" style="display:none"><img /></div>'+
                '<div class="name"><%=name%></div>'+
                '<div class="status"></div>'+
                '<div class="progress">'+
                    '<div class="percent" style="background-color:#39d;"></div>'+
                '</div>'+
                '<span class="remove">x</span>'+
            '</li>';

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
    item.find(".remove").on("click",function(){
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
    var file = e.file;
    var elem = $("#J_upload_item_" + file.id);
    elem.find(".percent").css("width",e.uploaded/e.total*100 + "%");
}

Template.prototype._successHandler = function(e){
    var file = e.file;
    var data = e.data;
    var elem = $("#J_upload_item_" + file.id);
    elem.find(".pic").show();
    elem.find("img").attr("src",data.path);
    elem.find(".progress").hide();
    elem.find(".status").addClass("ok").html("成功");
}

Template.prototype._completeHandler = function(e){
}

Template.prototype._errorHandler = function(e){
    console.log("ERROR",e);
    var file = e.file;
    var data = e.data;
    var elem = $("#J_upload_item_" + file.id);
    elem.find(".progress").hide();
    elem.find(".status").addClass("fail").html("失败");
}