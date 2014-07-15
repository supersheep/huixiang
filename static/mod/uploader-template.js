module.exports = {
    template: '<div id="J_upload_item_<%=id%>" class="pic-wrapper">'
        +'<div class="pic"><div class="percent"></div></div>'
        +'<div class="icon-delete J_upload_remove" />'
    +'</div>',
    success: function(e){
        var elem = e.elem;
        var data = e.data;
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
    },
    error: function(e){
        console && console.log("e")
    }
};