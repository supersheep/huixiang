(function(){
    var count = 0;
    var count_num = 5;
    var duration = 1000;
    var win = window;
    var container = $(".pieces");

    function Queue(tasks,alldone){
      var currentTask = tasks[0];
        Queue.result = Queue.result || [];
        function done(result){
            Queue.result.push(result);
            tasks.shift();
            Queue(tasks,alldone);
        }
        if(tasks.length){
            currentTask(done);
        }else{
            alldone && alldone(Queue.result);
        }
    }

    function create_piece(data){

        var html = '<div class="piece" style="-webkit-filter: blur(0px); opacity: 1;">'
            +'<div class="piece-content">'
                +'<div class="piece-inner">'
                    +'<div class="piece-main">'
                        +'<div class="txt">'+data.content+'</div>'
                        + (data.by ? ('<div class="by">—— '+data.by+'</div>') : '')
                    +'</div>'
                    // +'<div class="func">'
                    //     +'<div class="like">♥</div>'
                    //     +'<div class="via"><a href="javascript:">via</a></div>'
                    // +'</div>'
                +'</div>'
            +'</div>'
        +'</div>';

        piece = $(html);
        piece.one(".like").on("click",function(){
            $.post("/fav",{
                pieceid:data.id
            })
        });
        return piece;
    }

    function showone(){
        var data = pieces[count%pieces.length];

        function fadeOutOld(done){
            var former = container.find('.piece');
            if(!former.length){done();return;}
            former.css("-webkit-filter","blur(4px)")
            former.animate({
                opacity:0
            },{
                duration:duration,
                complete:function(){
                    former.remove();
                    done();
                }
            });
        }

        function fadeInNew(done){
            var newpiece;
            newpiece = create_piece(data);
            newpiece.appendTo(container);
            newpiece.css("-webkit-filter","blur(0px)");
            newpiece.animate({
                opacity:1
            },{
                duration:duration,
                complete:done
            });
        }

        Queue([fadeOutOld,fadeInNew]);
        count++;
    }

    showone();
    setInterval(function(){
        showone();
    },duration*5);

    $(".account").on("mouseenter",function(){
        $(".menu").show();
    }).on("mouseleave",function(){
        $(".menu").hide();
    });


})()        