define(function(require,exports){
    var Piece = require("mod/piece");
    var Mbox = require("mod/mbox");
    var Login = require("mod/login");

    var piece = new Piece({
        interval:10000,
        container:$(".pieces")
    }).start();

    var html = '<div class="box-text">'
        +'<textarea class="textarea" placeholder="记一句..." maxlength="70"></textarea>'
        +'</div>'
        +'<div class="box-bottom">'
        +'<div class="hint" style="display:none;">最多只能输入70个字</div><a class="btn" href="#">好了</a></div>';


    $(document).on("keyup",function(e){
        if(e.keyCode==32){
            piece.next();
        }
    });


    $("#write-note").on("click",function(){
        var content = $(html);
        var hint = content.find(".hint");
        var textarea = content.find("textarea");
        var btn = content.find(".btn");
        var write_box = new Mbox({
            content:content
        });
        var posting = false;


        btn.on("click",function(){
            var val = textarea.val().trim();
            if(!val.length){
                return false;
            }

            if(!posting){
                posting = true;
                $.ajax({
                    url:"/ajax/add",
                    method:"post",
                    dataType:"json",
                    data:{
                        content:val
                    }
                }).success(function(json){
                    if(json.code == 200 || json.code == 300){
                        Mbox.success("添加成功");
                    }else{
                        Mbox.fail("发送错误");
                    }
                    posting = false;
                    setTimeout(function(){
                        write_box.close()
                    },1000);
                });
            }
        });


        if(!write_box.opened()){
            textarea.on("keyup",function(){
                if($(this).val().length == 70){
                    hint.show();
                }else{
                    hint.hide();
                }
            })
            write_box.open();  
            write_box.find("textarea")[0].focus(); 
        }
    });

    $(".account").on("mouseenter",function(){
        $(".menu").show();
    }).on("mouseleave",function(){
        $(".menu").hide();
    });

    $(".login_douban").on("click",function(){
        Login.popdouban();
    });
});

