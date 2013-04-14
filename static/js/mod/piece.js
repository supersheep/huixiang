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
                    complete:function(){
                        self.ready = true;
                    }
                });

            }

            self.ready = false;
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