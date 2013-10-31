define(function(require,exports){
    require("mod/comm");
    var app_el = $(".app");

    $(".market").on("mouseenter",function(){
        var btn = $(this);
        var store_map = {
            "app-store":"ios",
            "google-play":"android"
        }

        for(var store in store_map){
            if(btn.hasClass(store)){
                app_el.attr("class","app "+store_map[store]);
            }
        }
    });
});