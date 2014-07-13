var Login = require("../mod/login");
var Mbox = require("../mod/mbox");

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