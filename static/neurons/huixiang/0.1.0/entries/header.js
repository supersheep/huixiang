(function(){
function mix(a,b){for(var k in b){a[k]=b[k];}return a;}
var _0 = "huixiang@0.1.0/entries/app.js";
var _1 = "huixiang@0.1.0/entries/header.js";
var _2 = "huixiang@0.1.0/entries/index.js";
var _3 = "huixiang@0.1.0/entries/new.js";
var _4 = "huixiang@0.1.0/entries/people.js";
var _5 = "huixiang@0.1.0/entries/piece.js";
var _6 = "huixiang@0.1.0/mod/login.js";
var _7 = "huixiang@0.1.0/mod/mbox.js";
var _8 = "huixiang@0.1.0/mod/util.js";
var _9 = "jquery@^1.9.1";
var entries = [_0,_1,_2,_3,_4,_5];
var asyncDepsToMix = {};
var globalMap = asyncDepsToMix;
define(_1, [_6,_7], function(require, exports, module, __filename, __dirname) {
var Login = require("../mod/login");
var Mbox = require("../mod/mbox");

$(".account").on("mouseenter",function(){
    $(".menu").show();
}).on("mouseleave",function(){
    $(".menu").hide();
});

$(".login_douban").on("click",function(){
    Login.popdouban();
    return false;
});


$(".login_weibo").on("click",function(){
    Login.popweibo();
    return false;
});
}, {
    entries:entries,
    map:mix(globalMap,{"../mod/login":_6,"../mod/mbox":_7})
});

define(_6, [_8], function(require, exports, module, __filename, __dirname) {
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
    map:mix(globalMap,{"./util":_8})
});

define(_7, [_9], function(require, exports, module, __filename, __dirname) {
var $ = require('jquery');
var body = $("body");
var win = $(window);

var wrap_html = '<div class="mbox-win"><div class="close">x</div><div class="mbox-content"></div></div>';
var instance = null;

function Mbox(opt){
    if(instance){
        return instance;
    }

    var content = $(opt.content);
    var wrap = $(wrap_html);
    wrap.find(".mbox-content").append(content);
    wrap.find(".close").on("click",function(){
        instance.close();
    });
    this._elem = wrap;
    this._offset = opt._offset || {top:0,left:0};
    this._opened = false;
    instance = this;
    return this;
}

Mbox.success = function(text){
    if(!instance){return}
    instance._elem.find(".mbox-content").html('<div class="msg-box"><i class="succ"></i>'+text+'</div>');
    instance.position();
}

Mbox.error = function(text){
    if(!instance){return}
    instance._elem.find(".mbox-content").html('<div class="msg-box"><i class="err"></i>'+text+'</div>');
    instance.position();
}

Mbox.close = function(){
    instance && instance.close();
}

Mbox.prototype = {
    opened:function(){
        return this._opened;
    },
    _create_overlay:function(){
        var self = this;
        this._overlay = $('<div class="mbox-overlay"></div>').appendTo(body);
        this._overlay.css({
            opacity:0
        }).animate({
            opacity:0.2
        }).on("click",function(){
            self.close();
        });
    },
    position:function(){
        var elem = this._elem;
        this._elem.css({
            top:(win.height() - elem.height()) / 2 + this._offset.top,
            left:(win.width() - elem.width()) / 2 + this._offset.left
        });
    },
    find:function(selector){
        return this._elem.find(selector)
    },
    open:function(){
        var self = this;
        if(!this._opened){
            this._opened = true;
            this._create_overlay();
            this._elem.css({
                zIndex:51
            }).appendTo(body);
            this.position();
            win.on("resize",function(){
                self.position();
            });
        }
        return this;
    },
    close:function(){
        var self = this;
        var overlay = this._overlay;
        instance = null;
        if(this._opened){
            this._opened = false;
            overlay.animate({
                opacity:0
            },{
                complete:function(){
                    overlay.remove()
                }
            });
            this._elem.animate({
                opacity:0
            },{
                complete:function(){
                    self._elem.remove()
                }
            });
        }
    }
}

module.exports = Mbox;
}, {
    entries:entries,
    map:globalMap
});

define(_8, [], function(require, exports, module, __filename, __dirname) {
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