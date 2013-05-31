define(function(require,exports,module){
    var Event = require("mod/event");
    var Util = require("mod/util");

    exports.LIMIT = 70;
    Event.mixin(module.exports);

    function init(content){
        var posting = false;

        var hint = content.find(".hint");
        var textarea = content.find("textarea");
        var link = content.find(".link").attr("href");
        var btn = content.find(".btn");
        var sharebtns = content.find(".sharebtn");

        sharebtns.on("click",function(e){
            e.preventDefault();
            $(this).toggleClass("active")
        })
        btn.on("click",function(){
            var val = textarea.val().trim();
            var share = [];
            if(!val.length){
                return false;
            }

            sharebtns.filter('.active').each(function(i,el){
                var type = $(el).attr("data-type");
                share.push(type);
            });
            
            if(!posting){
                posting = true;
                $.ajax({
                    url:"/ajax/add",
                    method:"post",
                    dataType:"json",
                    data:{
                        share:share.join(","),
                        content:val,
                        link:link
                    }
                }).success(function(json){
                    posting = false;
                    if(json.code == 200 || json.code == 300){
                        exports.fire("add",json);
                    }else{
                        exports.fire("err");
                    }
                    exports.fire("done");
                });
            }
        });

        textarea.on("keyup",function(){
            if($(this).val().length == exports.LIMIT){
                hint.show();
            }else{
                hint.hide();
            }
        });

        textarea.get(0).focus()
    }

    exports.init = init;
});