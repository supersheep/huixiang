define(function(require){
    require('mod/comm');

    var share_btns = $(".toweibo,.todouban");
    var private_el = $("#private");
    var toggle_private = false;

    share_btns.on("click",function(e){
        if(private_el.prop("checked")){return;}
        var elem = $(this).toggleClass("active");
    });

    private_el.on("click",function(){
        if(!toggle_private){
            share_btns.each(function(i,el){
                el = $(el)
                el.data("selected",el.hasClass("active")).removeClass("active");   
            });
        }else{
            share_btns.each(function(i,el){
                el = $(el)
                if(el.data("selected")){
                    el.addClass("active");
                }   
            });
        }
        toggle_private = !toggle_private;
    })
});