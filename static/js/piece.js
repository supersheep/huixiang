define(function(require,exports){
    require("mod/comm");
    var poplogin = require("mod/poplogin");
    var liked_elems = $(".icon-heart,.people ul");
    var likebtn = $(".icon-heart");
    var id = likebtn.attr("data-id");

    var picCount = $(".pics li").length;
    var next = $(".pics .next");
    var last = $(".pics .last");
    if(picCount > 1){
        last.show();
        next.show();
    }

    last.on("click",function(){

    });

    next.on("click",function(){

    });

    likebtn.on("click",function(){
        var LIKED = "liked";
        if(likebtn.hasClass(LIKED)){
            $.ajax({
                url:"/ajax/unfav",
                type:"post",
                dataType:"json",
                data:{pieceid:id}
            }).success(function(json){
                if(json.code == 200){
                    liked_elems.removeClass(LIKED);
                }else{
                    poplogin()
                }
            });
        }else{
            $.ajax({
                url:"/ajax/fav",
                type:"post",
                dataType:"json",
                data:{pieceid:id}
            }).success(function(json){
                if(json.code == 200){
                    liked_elems.addClass(LIKED);
                }else{
                    poplogin()
                }
            });
        }
    })
});