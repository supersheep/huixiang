(function(win){
    var btn = document.createElement("img");

    btn.src="http://huixiang.spud.in/static/img/huixiang_48.png";
    btn.style.borderRadius = "4px";
    btn.style.width = "24px";
    btn.style.height = "24px";
    btn.style.position = "absolute";
    btn.style.backgroundColor = "#d5c5b0";
    btn.style.padding = "2px";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "inset 0 0 5px #999";

    function trim(str){
        return str.replace(/(^\s*)|(\s*$)/g, ""); 
    }

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

    function getSelectionText() {                                       
        // http://snipplr.com/view/10912/get-html-of-selection/
        var userSelection = window.getSelection();
        if (userSelection.isCollapsed) 
            return '';
        else {
            var range = userSelection.getRangeAt(0);
            var clonedSelection = range.cloneContents();
            var div = document.createElement('div');
            div.appendChild(clonedSelection);
            return trim(div.innerText);
        }
    }

    function createPiece(text){
        
        hideBtn();
        
        query = {
            "title":encodeURIComponent(text),
            "url":encodeURIComponent(location.href)
        }

        openWin({
            url:"http://huixiang.spud.in/bookmarklet?"+toQueryString(query),
            width:350,
            height:174
        });
    }

    function showBtn(e){
        btn.style.top = e.pageY + 20 + "px";
        btn.style.left = e.pageX + 20 + "px";
        btn.style.display = "block";
    }

    function hideBtn(e){
        btn.style.display = "none";
    }


    function determine(text){
        if(!text || text.length > 70){
            return false;
        }else{
            return true;
        }
    }

    function getAndDetermine(){
        var text = getSelectionText();
        if(determine(text)){
            createPiece(text);  
        }
    }



    document.body.appendChild(btn);
    getAndDetermine();
    btn.onclick = getAndDetermine;

    document.onmouseup = function(e){
        var text = getSelectionText();
        if(determine(text)){
            showBtn(e);
        }else{
            hideBtn();
        }
    };
})(window);
