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

exports.substitute = function(tpl,obj){
    for(var key in obj){
        tpl = tpl.replace(new RegExp("{"+key+"}","g"),obj[key])
    }
    return tpl;
}

exports.parseQuery = function(query){
    var obj = {};
    var pairs = query.split("&");
    var splited;
    for(var i=0,l=pairs.length;i<l;i++){
        splited = pairs.split("=")
        obj[splited[0]] = obj[splited[1]]
    }
    return obj;
}


});