(function(){
function mix(a,b){for(var k in b){a[k]=b[k];}return a;}
var _0 = "huixiang@0.1.0/entries/app.js";
var _1 = "huixiang@0.1.0/entries/header.js";
var _2 = "huixiang@0.1.0/entries/index.js";
var _3 = "huixiang@0.1.0/entries/new.js";
var _4 = "huixiang@0.1.0/entries/people.js";
var _5 = "huixiang@0.1.0/entries/piece.js";
var _6 = "jquery@^1.9.1";
var entries = [_0,_1,_2,_3,_4,_5];
var asyncDepsToMix = {};
var globalMap = asyncDepsToMix;
define(_0, [_6], function(require, exports, module, __filename, __dirname) {
var $ = require('jquery');
var app_el = $('.app');

$('.market').on('mouseenter',function(){
    var btn = $(this);
    var store_map = {
        'app-store':'ios',
        'google-play':'android'
    }

    for(var store in store_map){
        if(btn.hasClass(store)){
            app_el.attr('class','app '+store_map[store]);
        }
    }
});
}, {
    entries:entries,
    map:globalMap
});
})();