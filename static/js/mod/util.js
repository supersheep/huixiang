/**
 * 提供基础工具函数
 */

define(function(require,exports){

exports.toQueryString = function(obj){
    var pairs = [];
    for(var key in obj){
        pairs.push(key+"="+obj[key]);
    }
    return pairs.join("&");
}

exports.openWin = function(obj){
    var win = window;
    win.open(obj.url,obj.id,[
        "height="+obj.height,
        "width="+obj.width,
        "top="+($(win).height() - obj.height)/2,
        "left="+($(win).width() - obj.width)/2].join(","))   
}


});