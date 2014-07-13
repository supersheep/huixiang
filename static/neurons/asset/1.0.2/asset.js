(function(){
function mix(a,b){for(var k in b){a[k]=b[k];}return a;}
var _0 = "asset@1.0.2/index.js";
var asyncDepsToMix = {};
var globalMap = asyncDepsToMix;
define(_0, [], function(require, exports, module, __filename, __dirname) {
/**
 * module  loader/assets
 */

var DOC = document;
var HEAD = DOC.getElementsByTagName('head')[0];


/**
 * static resource loader
 * meta functions for assets
 * --------------------------------------------------------------------------------------------------- */

/**
 * @param {string} url
 * @param {function()=} callback
 */
exports.css = function(uri, callback) {
  var node = DOC.createElement('link');

  node.href = uri;
  node.rel = 'stylesheet';

  callback && assetOnload.css(node, callback);

  // insert new CSS in the end of `<head>` to maintain priority
  HEAD.appendChild(node);

  return node;
};

/**
 * @param {string} url
 * @param {function()=} callback
 */
exports.js = function(uri, callback, options) {
  var node = DOC.createElement('script');
  options = options || {};

  node.src = uri;
  node.async = true;

  callback && assetOnload.js(node, function() {
    options.remove && HEAD.removeChild(node);
    callback.call(this);
  });

  // loadSrc.__pending = uri;
  HEAD.insertBefore(node, HEAD.firstChild);
  // loadSrc.__pending = NULL;

  return node;
};

/**
 * @param {string} url
 * @param {function()=} callback
 */
exports.img = function(uri, callback) {
  var node = DOC.createElement('img'),
    delay = setTimeout;

  function complete(name) {
    node.onload = node.onabort = node.onerror = complete = NULL;

    // on IE, `onload` event may be fired during the setting{1} of the src of image node
    // so setTimeout to make sure the callback function will be executed after the current loadSrc.img stack.
    setTimeout(function() {
      callback.call(node, {
        type: name
      });
      node = NULL;
    }, 0);
  };

  callback && ['load', 'abort', 'error'].forEach(function(name) {
    node['on' + name] = function() {
      complete(name);
    };
  });

  // {1}
  node.src = uri;

  callback && node.complete && complete && complete('load');

  return node;
};


// @this {element}
var assetOnload = {
  js: (DOC.createElement('script').readyState ?

    /**
     * @param {DOMElement} node
     * @param {!function()} callback asset.js makes sure callback is not null
     */
    function(node, callback) {
      node.onreadystatechange = function() {
        var rs = node.readyState;
        if (rs === 'loaded' || rs === 'complete') {
          node.onreadystatechange = NULL;

          callback.call(this);
        }
      };
    } :

    function(node, callback) {
      node.addEventListener('load', callback, false);
    }
  )
};

// assert.css from jQuery
var cssOnload = DOC.createElement('css').attachEvent 
  ? function(node, callback) {
    node.attachEvent('onload', callback);
  }

  : function(node, callback) {
    var is_loaded = false,
      sheet = node['sheet'];

    if (sheet) {
      if (K.UA.webkit) {
        is_loaded = true;

      } else {
        try {
          if (sheet.cssRules) {
            is_loaded = true;
          }
        } catch (ex) {
          if (ex.name === 'NS_ERROR_DOM_SECURITY_ERR') {
            is_loaded = true;
          }
        }
      }
    }

    if (is_loaded) {
      setTimeout(function() {
        callback.call(node);
      }, 0);
    } else {
      setTimeout(function() {
        cssOnload(node, callback);
      }, 10);
    }
  }; // end var


assetOnload.css = cssOnload;


/**
 change log:
 
 2012-06-29  Kael:
 - fix a bug of NR.load.img on IE, 
 
 
 */
}, {
    main:true,
    map:globalMap
});
})();