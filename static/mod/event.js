function on(){
    var args = arguments;
    if(typeof args[0] == "object"){
        var obj = args[0];
        for(var key in obj){
            this.on(key, obj[key]);
        }
    }else{
        var name = args[0];
        var func = args[1];
        var events = this.events = this.events || {};
        var thisEvent = events[name] = events[name] || [];
        thisEvent.push(func);
    }
}

function off(name){
    if(!name){
        delete this.events;
    }

    if(this.events && this.events[name]){
        delete this.events[name];
    }
}

function fire(name,eventArgs){
    var self = this;
    var events = (this.events && this.events[name]) || [];
    events.forEach(function(func){
        func.call(self,eventArgs);
    });
}



function mixin(target){
    if(typeof target == "function"){
        target.prototype.on = on;
        target.prototype.off = off;
        target.prototype.fire = fire;
    }else{
        target.on = on;
        target.off = off;
        target.fire = fire;
    }
}

module.exports = {
    fire:fire,
    mixin:mixin,
    on:on,
    off:off
};