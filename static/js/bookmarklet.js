(function(win){
    function openWin(obj){
        win.open(obj.url,obj.id,[
            "height="+obj.height,
            "width="+obj.width,
            "top=200",
            "left=200"])
    }

    function toQueryString(obj){
        var pairs = [];
        for(var key in obj){
            pairs.push(key+"="+obj[key]);
        }
        return pairs.join("&");
    }

    var query = {
        "title":"hahahaha",
        "url":encodeURIComponent(location.href)
    }

    openWin({
        url:"http://huixiang.spud.in/bookmarklet?"+toQueryString(query),
        width:350,
        height:174
    });

})(window);
