(function(){
  var date = new Date();
  function addZero(num){
    return num < 10 ? ("0" + num) : num;
  }
  seajs.config({
  // 加载 shim 插件
  plugins: ['shim'],
  base: '/static/js',
  map: [
    [/^(.*\/.*\.(?:css|js))(?:.*)$/i, '$1?20140130' ]
  ],
  // 配置 shim 信息，这样我们就可以通过 require('jquery') 来获取 jQuery
  shim: {
    'jquery': {
        src: 'jquery-1.9.1.min.js',
        exports: 'jQuery'
    }
  }
});
})();
