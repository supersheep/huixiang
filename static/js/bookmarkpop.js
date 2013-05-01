define(function(require,exports,module){
    var WriteBox = require("mod/writebox");
    var Login = require("mod/login");
    var substitute = require("mod/util").substitute;
    var succtpl = '<div class="succ">'
        +'<img src="/static/img/huixiang_48.png" alt="">'
            +'<p>成功记下</p>'
            +'<p>'
                +'<a class="gnc" href="/piece/{id}" target="_blank">去看看</a>'
                +'<a class="cls" href="javascript:window.close()">关闭</a>'
            +'</p>'
        +'</div>';

    $(".login_douban").on("click",function(){
        Login.popdouban();
        return false;
    });


    $(".login_weibo").on("click",function(){
        Login.popweibo();
        return false;
    });

    WriteBox.init($("#box"));
    WriteBox.on("add",function(json){
        $("#box").html(substitute(succtpl,{id:json.msg.id}));
        setTimeout(function(){
            window.close();
        },5000);
    });
});