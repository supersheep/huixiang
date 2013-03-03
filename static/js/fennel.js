/**
 * 提供基础工具函数
 */

(function(win){

var F = win.Fennel || {};

F.douban_apikey = "011b6a499b6cc93903523edcd2465bab";
F.weibo_apikey = null;

F.toQueryString = function(obj){
    var pairs = [];
    for(var key in obj){
        pairs.push(key+"="+obj[key]);
    }
    return pairs.join("&");
}
F.openWin = function(obj){
    console.log([
        "height="+obj.height,
        "width="+obj.width,
        "top="+($(win).height() - obj.height)/2,
        "left="+($(win).width() - obj.width)/2].join(","),$(win).height(),obj.height)
    window.open(obj.url,obj.id,[
        "height="+obj.height,
        "width="+obj.width,
        "top="+($(win).height() - obj.height)/2,
        "left="+($(win).width() - obj.width)/2].join(","))   
}

win.Fennel = F;

})(window);