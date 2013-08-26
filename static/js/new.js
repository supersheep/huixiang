define(function(require){
    require('mod/comm');

    var share = $("#share");
    $("#toweibo,#todouban").on("click",function(e){
        var elem = $(this).toggleClass("active");
        elem.next().toggleClass("active");
        $(".active[name=share]").get().map(function(ele){return $(ele).val()}).join(",")
    });

});