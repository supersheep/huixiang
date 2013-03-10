define(function(require,exports){
    var queue = require("mod/flow").queue;
    var Piece = require("mod/piece");
    var login = require("mod/login");

    new Piece({
        interval:10000,
        data:window.pieces,
        container:$(".pieces")
    }).start();


    $(".account").on("mouseenter",function(){
        $(".menu").show();
    }).on("mouseleave",function(){
        $(".menu").hide();
    });

    $(".login_douban").on("click",function(){
        login.popdouban();
    });
});

