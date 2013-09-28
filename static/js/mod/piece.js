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
                            + (data.by ? ('<div class="by">—— ' + data.by + '</div>') : '')
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
            var former = container.find('.piece');

            if(this.current_data.length == 1){
                self.fetch();
            }

            function fadeOutOld(cb){
                if(!former.length){return;}

                former.removeClass("in").addClass("out");
                setTimeout(function(){
                    former.remove();
                    cb();
                },self.duration);
            }

            function fadeInNew(){
                var newpiece;

                newpiece = self.create(data,container);

                newpiece.removeClass("out").addClass("in");
                setTimeout(function(){
                    self.ready = true;
                },self.duration);

            }

            self.ready = false;
            if(former.length){
                fadeOutOld(fadeInNew);
            }else{
                fadeInNew();
            }
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