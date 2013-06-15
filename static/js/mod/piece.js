define(function(require,exports,module){

    function Piece(option){
        this.interval = option.interval || 10000;
        this.duration = 500;
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

            piece.on("click",function(){
                if(self.ready){
                    self.next();
                }
            });

            inner.on("click",function(){
                window.open("/piece/"+data.id);
            });

            return piece;
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

            function fadeOutOld(){
                var former = container.find('.piece').eq(0);
                if(!former.length){return;}
                // former.css("-webkit-filter","blur(4px)")
                former.css("-webkit-transform","scale(.92)");
                former.animate({
                    opacity:0
                },{
                    duration:self.duration,
                    complete:function(){
                        former.remove();
                    }
                });
            }

            function fadeInNew(){
                var newpiece;

                newpiece = self.create(data,container);
                newpiece.css("-webkit-filter","blur(0px)");
                newpiece.css("-webkit-transform","scale(1)");
                newpiece.animate({
                    opacity:1
                },{
                    duration:self.duration,
                    complete:function(){
                        self.ready = true;
                    }
                });

            }

            self.ready = false;
            fadeOutOld();
            setTimeout(fadeInNew,500);
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