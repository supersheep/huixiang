var util = require("./util");

exports.popdouban = function(){
    util.openWin({
        url:"/auth/redirect/douban",
        width:500,
        height:400
    });
}

exports.popweibo = function(){
    util.openWin({
        url:"/auth/redirect/weibo",
        width:500,
        height:400
    });
}