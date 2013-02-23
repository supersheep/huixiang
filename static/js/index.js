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
        var piece_content = $("<div />").addClass("piece-content");
        var piece = $("<div />").addClass('piece');
        var piece_inner = $("<div />").addClass("piece-inner").html(data.content);
        var like = $("<div />").html("♥");
        like.on("click",function(){
            $.post("/fav",{
                pieceid:data.id
            })
        });
        piece_inner.appendTo(piece_content);
        like.appendTo(piece_content);
        piece_content.appendTo(piece);
        return piece;
    }

    function showone(){
        var piece = pieces[count%pieces.length];

        // fade out old
        // former.css("-webkit-filter","blur(4px)");
        Queue([function(done){
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
        },function(done){
            var newpiece;
            newpiece = create_piece(piece);
            newpiece.appendTo(container);
            newpiece.css("-webkit-filter","blur(0px)");
            
            newpiece.animate({
                opacity:1
            },{
                duration:duration,
                complete:done
            });
        }]);
        count++;
    }

    showone();
    setInterval(function(){
        showone();
    },duration*5);

})()        