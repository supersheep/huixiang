(function(){
function mix(a,b){for(var k in b){a[k]=b[k];}return a;}
var _0 = "huixiang@0.1.0/././js/entries/app.js";
var _1 = "huixiang@0.1.0/././js/entries/header.js";
var _2 = "huixiang@0.1.0/././js/entries/index.js";
var _3 = "huixiang@0.1.0/././js/entries/new.js";
var _4 = "huixiang@0.1.0/././js/entries/people.js";
var _5 = "huixiang@0.1.0/././js/entries/piece.js";
var _6 = "jquery@^1.9.1";
var _7 = "huixiang@0.1.0/js/mod/piece.js";
var _8 = "huixiang@0.1.0/js/entries/index.js";
var entries = [_0,_1,_2,_3,_4,_5];
var asyncDepsToMix = {};
var globalMap = asyncDepsToMix;
define(_8, [_6,_7], function(require, exports, module, __filename, __dirname) {
var $ = require('jquery');
var Piece = require("../mod/piece");
var piece = new Piece({
    interval:30000,
    container:$(".pieces")
}).start();

$(document).on("keyup",function(e){
    if(e.keyCode==32){
        piece.next();
    }
});
}, {
    entries:entries,
    map:mix(globalMap,{"../mod/piece":_7})
});

define(_7, [_6], function(require, exports, module, __filename, __dirname) {
var $ = require('jquery');
function Piece(option){
    this.interval = option.interval || 10000;
    this.duration = 500;
    this.container = option.container;
    this.current_data = [];
    return this;
}

Piece.prototype = {
    create:function(data,container){
        var html = '<div class="piece" >'
            +'<div class="piece-content">'
                +'<div class="piece-inner">'
                    +'<div class="piece-main">'
                        +'<div class="txt">'+data.content+'</div>'
                        + (data.by ? ('<div class="by">—— ' + data.by + '</div>') : '')
                    +'</div>'
                +'</div>'
            +'</div>'
        +'</div>';
        var self = this;
        var piece = $(html);
        var txt = piece.find(".txt");
        var inner = piece.find(".piece-inner");

        container.append(piece);
        if(txt.height() < 50){
            txt.css("text-align","center");
        }


        piece.data("data",data);

        piece.on("click",function(){
            if(self.ready){
                self.next();
            }
        });

        inner.on("click",function(){
            window.open("/piece/"+data.id);
        });

        return piece;
    },
    next:function(){
        if(!this.current_data.length){
            return false;
        }
        var self = this;
        var data = self.current_data.shift();
        var container = self.container;
        var former = container.find('.piece');

        if(this.current_data.length == 1){
            self.fetch();
        }

        function fadeOutOld(cb){
            if(!former.length){return;}

            former.removeClass("in").addClass("out");
            setTimeout(function(){
                former.remove();
                cb();
            },self.duration);
        }

        function fadeInNew(){
            var newpiece;

            newpiece = self.create(data,container);

            newpiece.removeClass("out").addClass("in");
            setTimeout(function(){
                self.ready = true;
            },self.duration);

        }

        self.ready = false;
        if(former.length){
            fadeOutOld(fadeInNew);
        }else{
            fadeInNew();
        }
        return this;
    },
    fetch:function(cb){
        var self = this;
        $.getJSON("/ajax/pieces",function(json){
            json.forEach(function(item){
                self.current_data.push(item);
            });
            cb && cb();
        });
    },
    play:function(){
        var self = this;
        setTimeout(function(){
            self.next();
        },self.interval);
    },
    start:function(){
        var self = this;
        self.fetch(function(){
            self.next();
            self.play();
        });
        return this;
    }
}

module.exports = Piece;
}, {
    entries:entries,
    map:globalMap
});
})();