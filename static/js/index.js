define(function(require,exports){
    var queue = require("mod/flow").queue;
    var Piece = require("mod/piece");
    var login = require("mod/login");

    var piece = new Piece({
        interval:10000,
        container:$(".pieces")
    }).start();

    $(document).on("keyup",function(e){
        if(e.keyCode==32){
            piece.next();
        }
    });


    $(".account").on("mouseenter",function(){
        $(".menu").show();
    }).on("mouseleave",function(){
        $(".menu").hide();
    });

    $(".login_douban").on("click",function(){
        login.popdouban();
    });
});

