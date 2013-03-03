(function(F){
    var login_douban = $(".login_douban");

    var qs = F.toQueryString({
        client_id:F.douban_apikey,
        redirect_uri:"http://localhost:8090/auth/douban",
        response_type:"code"
    });

    login_douban.on("click",function(){
        F.openWin({
            url:"https://www.douban.com/service/auth2/auth?"+qs,
            width:500,
            height:400
        });
    });
})(Fennel)