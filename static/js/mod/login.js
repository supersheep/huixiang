define(function(require,exports){
    var appcfg = require("mod/appcfg");
    var util = require("mod/util");

    exports.popdouban = function(){
        var qs = util.toQueryString({
            client_id:appcfg.douban_apikey,
            redirect_uri:"http://"+ location.host + (location.port ? (":" + location.port) : "") +"/auth/douban",
            response_type:"code"
        });
        util.openWin({
            url:"https://www.douban.com/service/auth2/auth?"+qs,
            width:500,
            height:400
        });
    }
});