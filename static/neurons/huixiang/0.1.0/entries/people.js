(function(){
function mix(a,b){for(var k in b){a[k]=b[k];}return a;}
var _0 = "huixiang@0.1.0/entries/app.js";
var _1 = "huixiang@0.1.0/entries/header.js";
var _2 = "huixiang@0.1.0/entries/index.js";
var _3 = "huixiang@0.1.0/entries/new.js";
var _4 = "huixiang@0.1.0/entries/people.js";
var _5 = "huixiang@0.1.0/entries/piece.js";
var _6 = "huixiang@0.1.0/mod/login.js";
var _7 = "huixiang@0.1.0/mod/util.js";
var entries = [_0,_1,_2,_3,_4,_5];
var asyncDepsToMix = {};
var globalMap = asyncDepsToMix;
define(_4, [_6], function(require, exports, module, __filename, __dirname) {
var Login = require("../mod/login");

$("#people .share .sharebtn").click(function(){
    if(!$(this).hasClass("active")){
        Login["pop" + $(this).attr("data-type")]();
    }
    return false;
});


$(".piece").each(function(i,e){
    var el = $(e),
        id = el.attr("data-id"),
        del = el.find(".del"),
        delay;

    if(!id){
        el.click(function(){return false;})
        return;
    }

    if($(window).width() > 480 ){
    el.on("mouseenter",function(){
        clearTimeout(delay);
        delay = setTimeout(function(){
            del.animate({
                right:-20
            },{
                duration:200
            });
        },200);
    })
    .on("mouseleave",function(){
        clearTimeout(delay);
        delay = setTimeout(function(){
            del.animate({
                right:0
            },{
                duration:200
            });
        },300);
    });
    }

    del.on("click",function(){
        if(!confirm("确认删除？")){return}

        $.ajax({
            url:"/api/remove",
            type:"post",
            data:{pieceid:id},
            dataType:"json"
        }).success(function(json){
            el.css("overflow","hidden");
            el.animate({
                height:0,
                opacity:0
            },{
                duration:625,
                complete:function(){
                    el.remove();
                }
            });
        });
    });
});
}, {
    entries:entries,
    map:mix(globalMap,{"../mod/login":_6})
});

define(_6, [_7], function(require, exports, module, __filename, __dirname) {
var util = require("./util");

exports.popdouban = function(){
    util.openWin({
        url:"/auth/redirect/douban",
        width:500,
        height:400
    });
}

exports.popweibo = function(){
    util.openWin({
        url:"/auth/redirect/weibo",
        width:500,
        height:400
    });
}
}, {
    entries:entries,
    map:mix(globalMap,{"./util":_7})
});

define(_7, [], function(require, exports, module, __filename, __dirname) {
/**
 * 提供基础工具函数
 */

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
}, {
    entries:entries,
    map:globalMap
});
})();