seajs.config({
  // 加载 shim 插件
  plugins: ['shim'],

  // 配置 shim 信息，这样我们就可以通过 require('jquery') 来获取 jQuery
  shim: {
    'jquery': {
        src: 'static/js/jquery-1.9.1.min.js',
        exports: 'jQuery'
    }
  }
});