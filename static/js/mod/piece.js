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
                        +'<div class="func">'
                            +'<div class="like tip"><a href="javascript:">♥</a></div>'
                            + (data.via ? '<div class="via tip"><a href="javascript:">via</a></div>':'')
                            +'<div class="next tip"><a href="javascript:">next</a></div>'
                        +'</div>'
                    +'</div>'
                +'</div>'
            +'</div>';
            var self = this;
            var piece = $(html);
            var txt = piece.find(".txt");
            var stat = {faved:false,nexted:false};

            container.append(piece);
            if(txt.height() < 50){
                txt.css("text-align","center");
            }
            piece.find(".like").on("click",function(){
                if(!stat.faved){
                    stat.faved = true;
                    $.post("/ajax/fav",{
                        pieceid:data.id
                    });
                }
            });
            piece.find(".next").on("click",function(){
                 if(!stat.nexted){
                    stat.nexted = true;
                    self.showone();
                }
            });
            return piece;
        },
        showone:function(){
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
                self.showone();
            },self.interval);
        },
        start:function(){
            var self = this;
            self.fetch(function(){
                self.showone();
                self.play();
            });
        }
    }

    module.exports = Piece;
});