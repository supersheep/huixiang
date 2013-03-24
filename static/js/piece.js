define(function(require,exports){
    require("mod/comm");
    var liked_elems = $(".like,.people ul");
    var likebtn = $(".like");
    var id = likebtn.attr("data-id");
    likebtn.on("click",function(){
        var LIKED = "liked";
        if(likebtn.hasClass(LIKED)){
            liked_elems.removeClass(LIKED);
            $.ajax({
                url:"/ajax/unfav",
                type:"post",
                data:{pieceid:id}
            });
        }else{
            $.ajax({
                url:"/ajax/fav",
                type:"post",
                data:{pieceid:id}
            });
            liked_elems.addClass(LIKED);
        }
    })    
});