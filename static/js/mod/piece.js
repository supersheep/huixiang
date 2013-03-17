define(function(require,exports,module){
    var Queue = require("mod/flow").queue;

    function Piece(option){
        this.interval = option.interval || 10000;
        this.duration = 1000;
        this.container = option.container;
        this.current_data = [];
        return this;
    }

    Piece.prototype = {
        create:function(data,container){
            var html = '<div class="piece" >'
                +'<div class="piece-content">'
                    +'<div class="piece-inner">'
                        +'<div class="piece-main">'
                            +'<div class="txt">'+data.content+'</div>'
                            + (data.by ? ('<div class="by">—— '+data.by+'</div>') : '')
                        +'</div>'
                    +'</div>'
                +'</div>'
            +'</div>';
            var self = this;
            var piece = $(html);
            var txt = piece.find(".txt");
            var inner = piece.find(".piece-inner");


            container.append(piece);
            if(txt.height() < 50){
                txt.css("text-align","center");
            }

            piece.data("data",data);

            inner.on("mouseenter",function(){
                self.showFuncs();
            }).on("mouseleave",function(){
                self.hideFuncs();
            });

            return piece;
        },
        showFuncs:function(){
            var piece = this.container.find('.piece');
            var piece_main = piece.find('.piece-main');
            var txt = piece.find('.txt');
            var self = this;
            var faved = false;
            var nexted = false;

            var funcs = $('<div class="func"></div>');
            var func_inner = $('<div class="func-inner"></div>');
            var like = $('<div class="like btn"></div>');
            var next = $('<div class="next btn"></div>');


            var txt_width = parseInt(txt.width());
            var txt_height = parseInt(txt.height());

            if(piece.find(".func").length){
                return false;
            }


            funcs.css({
                width:txt_width,
                height:txt_height
            });


            funcs.append(func_inner);
            func_inner.append(like);
            func_inner.append(next);
            funcs.css("opacity",0);
            piece_main.append(funcs);


            func_inner.css({
                left: (txt_width - func_inner.width()) / 2,
                top: (txt_height - func_inner.height()) / 2
            });

            funcs.animate({
                opacity:1
            });


            like.on("click",function(){
                if(!faved){
                    faved = true;
                    $.post("/ajax/fav",{
                        pieceid:piece.data("data").id
                    });
                }
            });

            next.on("click",function(){
                 if(!nexted){
                    nexted = true;
                    self.next();
                }
            });
        },
        hideFuncs:function(){
            var funcs = this.container.find(".func");
            funcs.animate({
                opacity:0
            },{
                complete:function(){
                    funcs.remove();
                }
            });
        },
        next:function(){
            if(!this.current_data.length){
                return false;
            }
            var self = this;
            var data = self.current_data.shift();
            var container = self.container;

            if(this.current_data.length == 1){
                self.fetch();
            }

            function fadeOutOld(done){
                var former = container.find('.piece');
                if(!former.length){done();return;}
                former.css("-webkit-filter","blur(4px)")
                former.animate({
                    opacity:0
                },{
                    duration:self.duration,
                    complete:function(){
                        former.remove();
                        done();
                    }
                });
            }

            function fadeInNew(done){
                var newpiece;

                newpiece = self.create(data,container);
                newpiece.css("-webkit-filter","blur(0px)");
                newpiece.animate({
                    opacity:1
                },{
                    duration:self.duration,
                    complete:done
                });
            }

            Queue([fadeOutOld,fadeInNew]);
            return this;
        },
        fetch:function(cb){
            var self = this;
            $.getJSON("/ajax/pieces",function(json){
                json.forEach(function(item){
                    self.current_data.push(item);
                });
                cb && cb();
            });
        },
        play:function(){
            var self = this;
            setTimeout(function(){
                self.next();
            },self.interval);
        },
        start:function(){
            var self = this;
            self.fetch(function(){
                self.next();
                self.play();
            });
            return this;
        }
    }

    module.exports = Piece;
});