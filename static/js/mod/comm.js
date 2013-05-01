define(function(require,exports){
    var Login = require("mod/login");
    var Mbox = require("mod/mbox");
    var WriteBox = require("mod/writebox");

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

    var html = '<div class="box-text">'
        +'<textarea class="textarea" placeholder="记一句..." maxlength="70"></textarea>'
        +'</div>'
        +'<div class="box-bottom">'
        +'<div class="hint" style="display:none;">最多只能输入70个字</div><a class="btn" href="#">好了</a></div>';




    $("#write-note").on("click",function(){
        var content = $(html);
        var write_box = new Mbox({
            content:content
        }).open();
        WriteBox.init(content);
        WriteBox.on("add",function(json){
            Mbox.success("添加成功");
            location.href="/piece/"+json.msg.id
        });
        WriteBox.on("err",function(){
            Mbox.fail("发送错误");
        });
        WriteBox.on("done",function(id){
            setTimeout(function(){
                Mbox.close();
            },1000);
        });
        return false;
    });
})