define(function(require,exports,module){
    var Mbox = require("mod/mbox");
    var Login = require("mod/login");
    var content = ""
    
    

    function pop(){
        var html = '<div class="box-title">请先登录</div>'
        +'<div class="box-text">'
        +'<div class="box-login-body">'
        +'<a href="#" class="login_douban"><img src="http://img3.douban.com/pics/douban-icons/favicon_24x24.png" title="豆瓣登录"></a>'
        +'<a href="#" class="login_weibo"><img src="http://www.sinaimg.cn/blog/developer/wiki/LOGO_24x24.png" title="微博登录"></a>'
        +'</div>'
        +'</div>';

        var content = $(html);

        content.find(".login_douban").on("click",function(){
            Login.popdouban();
        });

        content.find(".login_weibo").on("click",function(){
            Login.popweibo();
        });
        
        new Mbox({
            content:content
        }).open();
    }

    module.exports = pop;
});