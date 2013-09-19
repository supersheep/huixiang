define(function(require,exports,module){

    var body = $("body");
    var win = $(window);

    var wrap_html = '<div class="mbox-win"><div class="close">x</div><div class="mbox-content"></div></div>';
    var instance = null;

    function Mbox(opt){
        if(instance){
            return instance;
        }

        var content = $(opt.content);
        var wrap = $(wrap_html);
        wrap.find(".mbox-content").append(content);
        wrap.find(".close").on("click",function(){
            instance.close();
        });
        this._elem = wrap;
        this._offset = opt._offset || {top:0,left:0};
        this._opened = false;
        instance = this;
        return this;
    }

    Mbox.success = function(text){
        if(!instance){return}
        instance._elem.find(".mbox-content").html('<div class="msg-box"><i class="succ"></i>'+text+'</div>');
        instance.position();
    }

    Mbox.error = function(text){
        if(!instance){return}
        instance._elem.find(".mbox-content").html('<div class="msg-box"><i class="err"></i>'+text+'</div>');
        instance.position();
    }

    Mbox.close = function(){
        instance && instance.close();
    }

    Mbox.prototype = {
        opened:function(){
            return this._opened;
        },
        _create_overlay:function(){
            var self = this;
            this._overlay = $('<div class="mbox-overlay"></div>').appendTo(body);
            this._overlay.css({
                opacity:0
            }).animate({
                opacity:0.2
            }).on("click",function(){
                self.close();
            });
        },
        position:function(){
            var elem = this._elem;
            this._elem.css({
                top:(win.height() - elem.height()) / 2 + this._offset.top,
                left:(win.width() - elem.width()) / 2 + this._offset.left
            });
        },
        find:function(selector){
            return this._elem.find(selector)
        },
        open:function(){
            var self = this;
            if(!this._opened){
                this._opened = true;
                this._create_overlay();
                this._elem.css({
                    zIndex:51
                }).appendTo(body);
                this.position();
                win.on("resize",function(){
                    self.position();
                });
            }
            return this;
        },
        close:function(){
            var self = this;
            var overlay = this._overlay;
            instance = null;
            if(this._opened){
                this._opened = false;
                overlay.animate({
                    opacity:0
                },{
                    complete:function(){
                        overlay.remove()
                    }
                });
                this._elem.animate({
                    opacity:0
                },{
                    complete:function(){
                        self._elem.remove()
                    }
                });
            }
        }
    }

    module.exports = Mbox;
});