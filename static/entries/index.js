var $ = require('jquery');
var Piece = require("../mod/piece");
var piece = new Piece({
    interval:30000,
    container:$(".pieces")
}).start();

$(document).on("keyup",function(e){
    if(e.keyCode==32){
        piece.next();
    }
});