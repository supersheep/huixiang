/**
 * @preserve Neuron JavaScript Framework (c) Kael Zhang <i@kael.me>
 */

// Goal
// 1. Implement safe native ecma5 methods for they are basic requirements which, nevertheless, is pluggable
// 2. Manage module dependencies and initialization 

// Non-goal
// > What neuron will never do
// 1. Neuron will never care about non-browser environment
// 2. Neuron core will never care about module loading

'use strict';

// version 6.2.0
// build 2014-07-04

var neuron = {};

// @param {Window|Object} ENV environment
// @param {undefined=} undefined
;(function(ENV, undefined){

// @const
var DOC = document;
var NULL = null;

// Create new `neuron` object or use the existing one
// var neuron = ENV.neuron || (ENV.neuron = {});

neuron.version = '6.2.0';


// ## ECMAScript5 implementation
//////////////////////////////////////////////////////////////////////

// - methods native object implemented
// - methods native object extends

// codes from mootools, MDC or by Kael Zhang

// ## Indexes

// ### Array.prototype
// - indexOf
// - lastIndexOf
// - filter
// - forEach
// - every
// - map
// - some
// - reduce
// - reduceRight

// ### Object
// - keys
// - create: removed

// ### String.prototype
// - trim
// - trimLeft
// - trimRight

// ## Specification

// ### STANDALONE language enhancement

// - always has no dependencies on Neuron
// - always follow ECMA standard strictly, including logic, exception type
// - throw the same error hint as webkit on a certain exception


function extend(host, methods) {
  for (var name in methods) {
    if (!host[name]) {
      host[name] = methods[name];
    }
  }
}


function implement(host, methods) {
  extend(host.prototype, methods);
}


var TYPE_ERROR = TypeError;


// ref: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array
implement(Array, {

  // Accessor methods ------------------------

  indexOf: function(value, from) {
    var len = this.length >>> 0;

    from = Number(from) || 0;
    from = Math[from < 0 ? 'ceil' : 'floor'](from);

    if (from < 0) {
      from = Math.max(from + len, 0);
    }

    for (; from < len; from++) {
      if (from in this && this[from] === value) {
        return from;
      }
    }

    return -1;
  },

  lastIndexOf: function(value, from) {
    var len = this.length >>> 0;

    from = Number(from) || len - 1;
    from = Math[from < 0 ? 'ceil' : 'floor'](from);

    if (from < 0) {
      from += len;
    }

    from = Math.min(from, len - 1);

    for (; from >= 0; from--) {
      if (from in this && this[from] === value) {
        return from;
      }
    }

    return -1;
  },


  // Iteration methods -----------------------

  filter: function(fn, thisObject) {
    var ret = [];
    for (var i = 0, len = this.length; i < len; i++) {

      // Kael:
      // Some people might ask: "why we use a `i in this` here?".
      // ECMA:
      // > callback is invoked only for indexes of the array which have assigned values; 
      // > it is not invoked for indexes which have been deleted or which have never been assigned values

      // Besides, `filter` method is not always used with real Arrays, invocations below might happen:

      //     var obj = {length: 4}; obj[3] = 1;
      //     Array.prototype.filter.call({length: 4});
      //     Array.prototype.filter.call($('body'));

      // as well as the lines below
      if ((i in this) && fn.call(thisObject, this[i], i, this)) {
        ret.push(this[i]);
      }
    }

    return ret;
  },

  forEach: function(fn, thisObject) {
    for (var i = 0, len = this.length; i < len; i++) {
      if (i in this) {

        // if fn is not callable, it will throw
        fn.call(thisObject, this[i], i, this);
      }
    }
  },

  every: function(fn, thisObject) {
    for (var i = 0, len = this.length; i < len; i++) {
      if ((i in this) && !fn.call(thisObject, this[i], i, this)) {
        return false;
      }
    }
    return true;
  },

  map: function(fn, thisObject) {
    var ret = [],
      i = 0,
      l = this.length;

    for (; i < l; i++) {

      // if the subject of the index i is deleted, index i should not be contained in the result of array.map()
      if (i in this) {
        ret[i] = fn.call(thisObject, this[i], i, this);
      }
    }
    return ret;
  },

  some: function(fn, thisObject) {
    for (var i = 0, l = this.length; i < l; i++) {
      if ((i in this) && fn.call(thisObject, this[i], i, this)) {
        return true;
      }
    }
    return false;
  },

  reduce: function(fn) {
    if (typeof fn !== 'function') {
      throw new TYPE_ERROR(fn + ' is not an function');
    }

    var self = this,
      len = self.length >>> 0,
      i = 0,
      ret;

    if (arguments.length > 1) {
      ret = arguments[1];

    } else {
      do {
        if (i in self) {
          ret = self[i++];
          break;
        }

        // if array contains no values, no initial value to return
        if (++i >= len) {
          throw new TYPE_ERROR('Reduce of empty array with on initial value');
        }
      } while (true);
    }

    for (; i < len; i++) {
      if (i in self) {
        ret = fn.call(NULL, ret, self[i], i, self);
      }
    }

    return ret;
  },

  reduceRight: function(fn) {
    if (typeof fn !== 'function') {
      throw new TYPE_ERROR(fn + ' is not an function');
    }

    var self = this,
      len = self.length >>> 0,
      i = len - 1,
      ret;

    if (arguments.length > 1) {
      ret = arguments[1];

    } else {
      do {
        if (i in self) {
          ret = self[i--];
          break;
        }
        // if array contains no values, no initial value to return
        if (--i < 0) {
          throw new TYPE_ERROR('Reduce of empty array with on initial value');
        }

      } while (true);
    }

    for (; i >= 0; i--) {
      if (i in self) {
        ret = fn.call(NULL, ret, self[i], i, self);
      }
    }

    return ret;
  }

});


extend(Object, {

  // ~ https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create ~
  // create: function(o){
  //    if(o !== Object(o) && o !== NULL){
  //        throw new TYPE_ERROR('Object prototype may only be an Object or NULL');
  //    }

  //    function F() {}
  //    F.prototype = o;

  //    return new F();
  // },

  // refs:
  // http://ejohn.org/blog/ecmascript-5-objects-and-properties/
  // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
  // https://developer.mozilla.org/en/ECMAScript_DontEnum_attribute
  // http://msdn.microsoft.com/en-us/library/adebfyya(v=vs.94).aspx
  keys: (function() {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
      has_dontEnumBug = !{
        toString: ''
      }.propertyIsEnumerable('toString'),

      // In some old browsers, such as OLD IE, keys below might not be able to iterated with `for-in`,
      // even if each of them is one of current object's own properties  
      NONT_ENUMS = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ],

      NONT_ENUMS_LENGTH = NONT_ENUMS.length;

    return function(o) {
      if (o !== Object(o)) {
        throw new TYPE_ERROR('Object.keys called on non-object');
      }

      var ret = [],
        name;

      for (name in o) {
        if (hasOwnProperty.call(o, name)) {
          ret.push(name);
        }
      }

      if (has_dontEnumBug) {
        for (var i = 0; i < NONT_ENUMS_LENGTH; i++) {
          if (hasOwnProperty.call(o, NONT_ENUMS[i])) {
            ret.push(NONT_ENUMS[i]);
          }
        }
      }

      return ret;
    };

  })()

  // for our current OOP pattern, we don't reply on Object based inheritance
  // so Neuron has not implemented the methods of Object such as Object.defineProperty, etc.
});


implement(String, {
  trimLeft: function() {
    return this.replace(/^\s+/, '');
  },

  trimRight: function() {
    return this.replace(/\s+$/, '');
  },

  trim: function() {
    return this.trimLeft().trimRight();
  }
});


// common code slice
//////////////////////////////////////////////////////////////////////
// - constants
// - common methods

// @const
// 'a@1.2.3/abc' -> 
// ['a@1.2.3/abc', 'a', '1.2.3', '/abc']

//                    01            2         3
var REGEX_PARSE_ID = /^((?:[^\/])+?)(?:@([^\/]+))?(\/.*)?$/;
// On android 2.2,
// `[^\/]+?` will fail to do the lazy match, but `(?:[^\/]+?)` works.
// Shit, go to hell!

// @param {string} resolved path-resolved module identifier
// 'a@1.0.0'    -> 'a@1.0.0'
// 'a'          -> 'a@*'
// 'a/inner'    -> 'a@*/inner'
function parseModuleId(resolved) {
  var match = resolved.match(REGEX_PARSE_ID);
  var name = match[1];

  // 'a/inner' -> 'a@latest/inner'
  var version = match[2] || '*';
  var path = match[3] || '';

  // There always be matches
  return {
    n: name,
    v: version,
    p: path
  };
}


// A very simple `mix` method
// copy all properties in the supplier to the receiver
// @param {Object} receiver
// @param {Object} supplier
// @returns {mixed} receiver
function mix(receiver, supplier) {
  var c;
  for (c in supplier) {
    receiver[c] = supplier[c];
  }
}


function mergeObjectArray (array) {
  if (!array) {
    return;
  }

  var ret = {};
  array.forEach(function (obj) {
    mix(ret, obj);
  });
  return ret;
}


// greedy match:
var REGEX_DIR_MATCHER = /.*(?=\/.*$)/;

// Get the current directory from the location
//
// http://jsperf.com/regex-vs-split/2
// vs: http://jsperf.com/regex-vs-split
function dirname(uri) {
  var m = uri.match(REGEX_DIR_MATCHER);

  // abc/def  -> abc
  // abc      -> abc  // which is different with `path.dirname` of node.js
  // abc/     -> abc
  return m ? m[0] : uri;
}


// Canonicalize path
// similar to path.resolve() of node.js
// NOTICE that the difference between `pathResolve` and `path.resolve` of node.js is:
// `pathResolve` treats paths which dont begin with './' and '../' as top level paths,
// but node.js as a relative path.

// For example:
// pathResolve('a', 'b')    -> 'b'
// node_path.resolve('a', 'b')   -> 'a/b'

// pathResolve('a/b', './c')    -> 'a/b/c'
// pathResolve('a/b', '../c')   -> 'a/c'
// pathResolve('a//b', './c')   -> 'a//b/c'   - for 'a//b/c' is a valid uri

// #75: 
// pathResolve('../abc', './c') -> '../abc/'
function pathResolve(from, to) {
  // relative
  if (isPathRelative(to)) {
    var parts = (dirname(from) + '/' + to).split('/');
    to = normalizeArray(parts).join('/');
  }

  return to;
}


// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  var i = parts.length - 1;
  for (; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);

    } else if (last === '..') {
      parts.splice(i, 1);
      up++;

    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  while (up--) {
    parts.unshift('..');
  }

  return parts;
}


// @param {string} path
function isPathRelative(path) {
  return path.indexOf('./') === 0 || path.indexOf('../') === 0;
}


var REGEX_LEADING_SLASH = /^\//;
function removesLeadingSlash (str) {
  return str.replace(REGEX_LEADING_SLASH, '');
}


function err (message) {
  throw new Error('neuron: ' + message);
}


// ## Neuron Core: Module Manager
//////////////////////////////////////////////////////////////////////

// ## CommonJS
// Neuron 3.x or newer is not the implementation of any CommonJs proposals
// but only [module/1.0](http://wiki.commonjs.org/wiki/Modules/1.0), one of the stable CommonJs standards.
// And by using neuron and [cortex](http://github.com/cortexjs/cortex), user could write module/1.0 modules.
// Just FORGET `define`.

// ## Naming Conventions of Variables
// All naming of variables should accord to this.

// Take `'a@1.0.0/relative'` for example:

// ### package 
// The package which the current module belongs to.
// - name or package name:  {string} package `name`: 'a'
// - package or package id: {string} contains package `name` and `version` and the splitter `'@'`. 
//   'a@1.0.0' for instance.

// ### module
// A package is consist of several module objects.
// - mod: {object} the module object. use `mod` instead of `module` to avoid confliction
// - id or module id: the descripter that contains package name, version, and path information
//      {string} for example, `'a@1.0.0/relative'` is a module id(entifier)

// ### version
// Package version: '1.0.0'

// ### main entry
// The module of a package that designed to be accessed from the outside


// map -> identifier: module
// Expose the object for debugging
// @expose
var mods = neuron.mods = {};


// Legacy
// Old neuron modules will not define a real resolved id.
// We determine the new version by `env.map`
// Since 6.2.0, actually, neuron will and should no longer add file extension arbitrarily,
// because `commonjs-walker@3.x` will do the require resolve during parsing stage.
// But old version of neuron did and will add a `config.ext` to the end of the file.
// So, if commonjs-walker does so, we adds a 
function legacyTransformId (id, env) {
  return env.map
    ? id
    : id + '.js';
}


// module define
// ---------------------------------------------------------------------------------------------------

// Method to define a module.

// **NOTICE** that `define` has no fault tolerance and type checking since neuron 2.0,
// because `define` method is no longer designed for human developers to use directly.
// `define` should be generated by some develop environment such as [cortex](http://github.com/cortexjs/cortex)
// @private

// @param {string} id (optional) module identifier
// @param {Array.<string>} dependencies ATTENSION! `dependencies` must be array of standard 
//   module id and there will be NO fault tolerance for argument `dependencies`. Be carefull!
// @param {function(...[*])} factory (require, exports, module)
// @param {Object=} options

// @return {undefined}
function define(id, dependencies, factory, options) {
  (options) || (options = {});

  // When define a module,
  // there is no context dependent
  var mod = defineById(id, options);
  mix(mod, options);

  // A single module might be defined more than once.
  // use this trick to prevent module redefining, avoiding the subsequent side effect.
  // mod.factory        -> already defined
  // X mod.exports  -> the module initialization is done
  if (!mod.factory) {
    mod.factory = factory;

    // if has dependencies
    if (dependencies.length) {
      mod.deps = dependencies;

      // ['a@0.0.1']  -> {'a' -> 'a@0.0.1'}
      generateModuleVersionMap(dependencies, mod.v);
      var asyncDeps = options.asyncDeps;
      if (asyncDeps) {
        generateModuleVersionMap(asyncDeps, mod.v);
      }

      // if the module is required before `define()`d
      if (mod.c.length) {
        loadModuleDependencies(mod);
      }
    } else {
      // for standalone modules, inform dependents immediately.
      ready(mod);
    }
  }
}


// Formally define a module with id,
// and dealing with the equivalent modules, merging registered callbacks.
function defineById (id, options) {
  var parsed = parseModuleId(id);

  // Legacy
  // in old times, main entry: 
  // - define(id_without_ext)
  // - define(pkg) <- even older
  // now, main entry: define(id_with_ext)
  if (parsed.p) {
    id = legacyTransformId(id, options);
    parsed.p = legacyTransformId(parsed.p, options);
  }

  var pkg = formatPackageId(parsed);

  var mod = mods[id];
  if (!mod) {
    mod = createModule(parsed, id, pkg);
  }

  if (options.main) {
    // If define a main module,
    // `id === pkg` must be true 
    //    'a@1.2.9/index' is equivalent to 'a@1.2.9'
    // But mods[pkg] might exist
    var modMain = mods[pkg];

    if (modMain && modMain !== mod) {
      // Combine registered callbacks of `mods['a@1.2.9']`
      mod.c = mod.c.concat(modMain.c);
      // Clean
      modMain.c.length = 0;
    }
      
    mods[pkg] = mod;
  }

  return mod;
}


// cases:

// 1. calculate relative paths 
// 2. load modules

// ```
// 'a@0.0.1/b.js'
// -> define('a@0.0.1/b', ['./c'], factory, {main: true});
// if main entry is not 
// -> {
//     'a@0.0.1/b': mod_b,
//     'a@0.0.1': mod_b
// }
// -> 'a/0.0.1/a.js'

// 'a@0.0.1/c'
// -> define('a@0.0.1/c', [], factory, {});
// -> {
//     'a@0.0.1/c': mod_c
// }
// ```

// Get a module by id. 
// If not exists, a ghost module(which will be filled after its first `define`) will be created
// @param {string} id
// @param {Object} env the environment module, 
// @param {boolean} main whether is main module
// @param {boolean} strict whether is strict definition. if a module is not found, 
//   it will throw errors instead of creating a new module
function getModuleById(id, env, strict) {
  var notFound = "Cannot find module '" + id + "'";
  env || (env = {});

  // commonjs parser could not parse non-literal argument of `require`
  if (!id) {
    err('null id');
  }

  // {
  //   alias: {
  //     // id -> path
  //     './a' -> './a.js'
  //   }
  // }
  var map = env.map || {};
  id = map[id] || id;

  // Two kinds of id:
  // - relative module path
  // - package name
  // - a module with path loaded by facade or _use
  var parsed;
  var pkg;
  var relative = isPathRelative(id);

  // `env` exists, which means the module is accessed by requiring within another module.
  // `id` is something like '../abc'
  if (relative) {
    if (!env.id) {
      err(notFound);
    }

    // pathResolve('align', './abc') -> 'align/abc'
    id = pathResolve(env.id, id);

    // Legacy
    // If >= 6.2.0, there is always a map,
    // and a value of map is always a top level module id.
    // So, only if it is old wrappings, it would come here.
    // Besides, if not a relative id, we should not adds `'.js'` even it is an old wrapping.
    // How ever, we pass `env` to have a double check.
    id = legacyTransformId(id, env);

    parsed = parseModuleId(id);
    pkg = formatPackageId(parsed);

  // `id` is something like 'jquery'
  } else {
    // 1. id is a package name
    // 'jquery' -> 'jquery@~1.9.3'
    // 2. id may be is a package id
    // 'jquery@^1.9.3' -> 'jquery@^1.9.3'
    id = env.v && env.v[id] || id;
    // 'jquery' -> {n: 'jquery', v: '*', p: ''}
    // 'jquery@~1.9.3' -> {n: 'jquery', v: '~1.9.3', p: ''}
    parsed = parseModuleId(id);

    // We route a package of certain range to a specific version according to `config.tree`
    // so several modules may point to a same exports
    parsed.v = NEURON_CONF.r(parsed.v, parsed.n, env.version, env.name);
    pkg = formatPackageId(parsed);
    id = pkg + parsed.p;
  }

  var mod = mods[id];
  if (!mod) {
    if (strict) {
      err(notFound);
    }
    mod = createModule(parsed, id, pkg);
  }

  return mod;
}


function createModule(parsed, id, pkg) {
  return mods[id] = {
    // package name: 'a'
    name: parsed.n,
    // package version: '1.1.0'
    version: parsed.v,
    // module path: '/b'
    path: parsed.p,
    // module id: 'a@1.1.0/b'
    id: id,
    // package id: 'a@1.1.0'
    pkg: pkg,
    // @type {Array.<function()>} callbacks
    c: [],
    // @type {Object} version map of the current module
    v: {},
    // If no path, it must be a main entry.
    // Actually, it actually won't happen when defining a module
    main: !parsed.p
  };
}


function ready (mod) {
  // execute pending callbacks and clean
  var callbacks = mod.c;
  // We might use the same method inside the previous, then `mod.c` will be `forEach()`d.
  // So we must clean the callbacks before they are called, 
  // or the callback of the latter `use` will never be called.
  // ```
  // _use(a, function () {
  //   _use(a, function (){});
  // });
  // ```
  delete mod.c;

  callbacks.forEach(function(c) {
    c(mod);
  });
  callbacks.length = 0;

  // never delete `mod.v`, coz `require` method might be executed after module factory executed
  // ```js
  // module.exports = {
  //    abc: function() {
  //        return require('b'); 
  //    }
  // }
  // ```
}


// @private
// create version info of the dependencies of current module into current sandbox
// @param {Array.<string>} modules no type detecting
// @param {Object} host

// ['a@~0.1.0', 'b@~2.3.9']
// -> 
// {
//     a: '~0.1.0',
//     b: '~2.3.9'
// }
function generateModuleVersionMap(modules, host) {
  modules.forEach(function(mod) {
    var name = mod.split('@')[0];
    host[name] = mod;
  });
}


// Generate the exports
// @param {Object} mod
function getExports(mod) {
  // Since 6.0.0, neuron will not emit a "cyclic" event.
  // But, detecing static cyclic dependencies is a piece of cake for compilers, 
  // such as [cortex](http://github.com/cortexjs/cortex)
  var exports = mod.loaded
    ? mod.exports

    // #82: since 4.5.0, a module only initialize factory functions when `require()`d.
    // A single module might
    : generateExports(mod);

  return exports;
}


function generateExports (mod) {
  var exports = {};
  // @expose
  var module = {
    exports: exports
  };

  // # 85
  // Before module factory being invoked, mark the module as `loaded`
  // so we will not execute the factory function again.
  
  // `mod.loaded` indicates that a module has already been `require()`d
  // When there are cyclic dependencies, neuron will not fail.
  mod.loaded = true;
  var __filename = mod.p = absolutizeURL(moduleId2RelativeURLPath(mod.id));
  var __dirname = dirname(__filename);

  // to keep the object mod away from the executing context of factory,
  // use `factory` instead `mod.factory`,
  // preventing user from fetching runtime data by 'this'
  var factory = mod.factory;
  factory(createRequire(mod), exports, module, __filename, __dirname);
  // delete mod.factory;

  // during the execution of `factory`, `module.exports` might be changed
  // exports:
  // TWO ways to define the exports of a module
  // 1. 
  // exports.method1 = method1;
  // exports.method2 = method2;

  // 2.
  // module.exports = {
  //        method1: method1,
  //        method2: method2
  // }

  // priority: 2 > 1
  return mod.exports = module.exports;
}


// function emit (mod, type) {
//   neuron.emit(type, {
//     mod: mod
//   });
// }

// module load
// ---------------------------------------------------------------------------------------------------

// @private
// @param {Array.<String>} dependencies
// @param {(function()} callback
// @param {Object} env Environment for cyclic detecting and generating the uri of child modules
// {
//     r: {string} the uri that its child dependent modules referring to
//     n: {string} namespace of the current module
// }
function loadDependencies(dependencies, callback, env) {
  var counter = dependencies.length;

  dependencies.forEach(function(id) {
    if (id) {
      var mod = getModuleById(id, env);
      registerModuleLoadCallback(mod, function() {
        if (--counter === 0) {
          callback();

          // prevent memleak
          callback = NULL;
        }
      }, env);

      // Prevent bad dependencies
    } else {
      --counter;
    }
  });
}


function useModule (mod, callback) {
  registerModuleLoadCallback(mod, function (mod) {
    callback(getExports(mod));
  });
}


// provide a module
// method to provide a module
// @param {Object} mod
// @param {function()} callback
function registerModuleLoadCallback(mod, callback) {
  if (!mod.c) {
    return callback(mod);
  }

  var length = mod.c.length;
  mod.c.push(callback);

  if (!mod.factory) {
    loadByModule(mod);
  } else {
    // If the module is required after `define()`d.
    !length && loadModuleDependencies(mod);
  }
}


function loadModuleDependencies (mod) {
  loadDependencies(mod.deps, function() {
    ready(mod);
  }, mod);
}


// Since 4.2.0, neuron would not allow to require an id with version
function testRequireId (id) {
  if (~id.indexOf('@')) {
    err("id with '@' is prohibited");
  }
}


// use the sandbox to specify the environment for every id that required in the current module 
// @param {Object} env The object of the current module.
// @return {function}
function createRequire(env) {
  var require = function(id) {
    // `require('a@0.0.0')` is prohibited.
    testRequireId(id);

    var mod = getModuleById(id, env, true);
    return getExports(mod);
  };

  // @param {string} id Module identifier. 
  // Since 4.2.0, we only allow to asynchronously load a single module
  require.async = function(id, callback) {
    if (callback) {
      // `require.async('a@0.0.0')` is prohibited
      testRequireId(id);
      var relative = isPathRelative(id);
      if (relative) {
        id = pathResolve(env.id, id);
        var entries = env.entries;
        id = entries
          ? testEntries(id, entries) 
            || testEntries(id + '.js', entries) 
            || testEntries(id + '.json', entries)
            || id
          : legacyTransformId(id, env);
      }

      var mod = getModuleById(id, env);
      if (!mod.main) {
        if (relative) {
          // If user try to load a non-entry module, it will get a 404 response
          mod.a = true;
        } else {
          // We only allow to `require.async` main module or entries of the current package 
          return;
        }
      }

      useModule(mod, callback);
    }
  };

  // @param {string} path
  // @returns
  // - {string} if valid
  // - otherwise `undefined`
  require.resolve = function (path) {
    // NO, you should not do this:
    // `require.resolve('jquery')`
    // We only allow to resolve a relative path

    // Trying to load the resources of a foreign package is evil.
    if (isPathRelative(path)) {
      // Prevent leading `'/'`,
      // which will cause empty item of an array
      path = pathResolve(env.path.slice(1), path);

      // If user try to resolve a url outside the current package
      // it fails silently
      if (!~path.indexOf('../')) {
        return absolutizeURL(
          moduleId2RelativeURLPath(env.pkg + '/' + path)
        );
      }
    }
  };

  return require;
}


function testEntries (path, entries) {
  return ~entries.indexOf(path)
    ? path
    : NULL;
}


// Format package id 
function formatPackageId(parsed) {
  return parsed.n + '@' + parsed.v;
}


// ## Script Loader
//////////////////////////////////////////////////////////////////////

// never use `document.body` which might be NULL during downloading of the document.
var HEAD = DOC.getElementsByTagName('head')[0];

function loadJS(src) {
  var node = DOC.createElement('script');

  node.src = src;
  node.async = true;

  jsOnload(node, function() {
    HEAD.removeChild(node);
  });

  HEAD.insertBefore(node, HEAD.firstChild);
}


var jsOnload = DOC.createElement('script').readyState

/**
 * @param {DOMElement} node
 * @param {!function()} callback asset.js makes sure callback is not NULL
 */
  ? function(node, callback) {
    node.onreadystatechange = function() {
      var rs = node.readyState;
      if (rs === 'loaded' || rs === 'complete') {
        node.onreadystatechange = NULL;
        callback.call(this);
      }
    };
  }

  : function(node, callback) {
    node.addEventListener('load', callback, false);
  };
  

// Manage configurations
//////////////////////////////////////////////////////////////////////

// ### with tree
// -> neuron uses the range map
// `a@1.2.3` -> `a@1.2.7`
// The structure of the tree is like:
// ```
// <name>: {
//   <version>: {
//     // dependencies and async dependencies
//     <dep-name>: [
//       {
//         <sync-dep-range>: <sync-dep-version>
//         ...
//       },
//       {
//         <async-dep-range>: <async-dep-version>
//         ...
//       }
//     ]
//   }
// }
// ...
// ```
function treeSetter (tree) {
  NEURON_CONF.r = getRangeVersion;
  return tree;
}

// @param {string=} dependentVersion the version of dependent in current context
// @param {string=} dependentName the name of dependent in current context
// @returns {string}
function getRangeVersion (range, name, dependentVersion, dependentName) {
  var tree = NEURON_CONF.tree;

  // See the picture, a range may infer to more than one versions,
  // but the dependency of specific package only leads to a certain version.
  // However, entries and facades will not be depent by other packages,
  // that is why `tree._` exists.
  var dependent = dependentName 
    // global package
    ? mergeObjectArray(tree[dependentName] && tree[dependentName][dependentVersion])
    : tree._;

  // if the range is defined in the tree
  return dependent && dependent[name] && dependent[name][range]
    // If not found in range map, just use the range.
    // Actually, user might save explicit version of dependencies rather than ranges.
    || range;
}


// var neuron_loaded = [];
var NEURON_CONF = neuron.conf = {
  loaded: [],
  // If `config.tree` is not specified, 
  r: justReturn
};


var SETTERS = {

  // The server where loader will fetch modules from
  // if use `'localhost'` as `base`, switch on debug mode
  'path': function(path) {
    // Make sure 
    // - there's one and only one slash at the end
    // - `conf.path` is a directory 
    return path.replace(/\/*$/, '/');
  },

  'loaded': justReturn,
  'tree': treeSetter,
  'combo': justReturn
};


function justReturn(subject) {
  return subject;
}


function config(conf) {
  var key;
  var setter;
  for (key in conf) {
    setter = SETTERS[key];
    if (setter) {
      NEURON_CONF[key] = setter(conf[key]);
    }
  }
}

// @expose
neuron.config = config;


// ## Parses modules to combo
//////////////////////////////////////////////////////////////////////

// NEURON_CONF.tree
// {
//   "a": {
//     "1.2.3": [
//       // sync dependencies
//       {
//         "sync": {
//           "~3.0.0": "3.0.9"
//         }
//       },
//       // async dependencies
//       {
//         "async": {
//           "~2.1.2": "2.1.10"
//         }
//       }
//     ]
//   }
// }
function getAllUnloadedSyncDeps(name, version, path) {
  var found = [];

  var tree = NEURON_CONF.tree;
  if (tree) {
    // Parse dependencies
    parseDeps(name, version, found, path);
  }
  return found;
}


// - parse the dependency tree
// - get all dependencies of a package including recursive dependencies
// - filter out already loaded packages
// @param {Array} found
// @param {Array} loaded 
// @param {Object} tree
function parseDeps(name, version, found, path) {
  var pkg = name + '@' + version;
  var evidence = pkg + (path || '');
  var loaded = NEURON_CONF.loaded;
  
  if (!~loaded.indexOf(evidence)) {
    found.push({
      pkg: pkg,
      name: path || name,
      version: version
    });
    loaded.push(evidence);

    var sync_deps = getSyncDeps(name, version);
    var dep_name;
    var dep_ranges;
    var dep_range;

    // {
    //   "sync": {
    //     "~3.0.0": "3.0.9"
    //   }
    // }
    for (dep_name in sync_deps) {
      dep_ranges = sync_deps[dep_name];
      for (dep_range in dep_ranges) {
        // recursively
        parseDeps(dep_name, dep_ranges[dep_range], found);
      }
    }
  }
}


// Get the synchronous dependencies of a certain package
function getSyncDeps(name, version) {
  var tree = NEURON_CONF.tree;
  var versions = tree[name] || {};
  var deps = versions[version] || [];
  var sync = deps[0] || {};
  return sync;
}


// ## Explode public methods
//////////////////////////////////////////////////////////////////////

// @expose
ENV.define = define;

// @expose
// Attach a module for business facade, for configurations of inline scripts
// if you want a certain biz module to be initialized automatically, the module's exports should contain a method named 'init'
// ### Usage 
// ```
// <code>
//     // require biz modules with configs
//     facade({
//         mod: 'app-main-header-bar',
//         data: {
//             icon: 'http://kael.me/u/2012-03/icon.png'
//         }
//     });
// </code>
//  ```
ENV.facade = function (item) {
  useModuleById(item.entry, function(method) {
    method.init && method.init(item.data);
  });
};

// legacy
// ENV.loader =

// private methods only for testing
// avoid using this method in product environment
// @expose
ENV._use = function (id, callback) {
  useModuleById(id, callback);
};

// @expose
ENV._load = loadJS;


function useModuleById (id, callback) {
  var mod = getModuleById(id);
  mod.f = true;
  useModule(mod, callback);
}


// The logic to load the javascript file of a package
//////////////////////////////////////////////////////////////////////

// server: 'http://localhost/abc',
// -> http://localhost/abc/<relative>
// @param {string} relative relative module url
function absolutizeURL(pathname) {
  var base = NEURON_CONF.path;
  if (!base) {
    err('config.path must be specified');
  }

  base = base.replace('{n}', pathname.length % 3 + 1);

  return pathResolve(base, pathname);
}


// This function should be defined with neuron.config({combo: fn})
// neuron.conf.combo = 
// function generateComboURL (mods) {
//     return '../concat/' + mods.map(function (mod) {
//         return '~mod~' + (mod.pkg + '/' + mod.name).replace(/\/|@/g, '~') + '.js';
//     }).join(',');
// }


// Scenarios:
// 1. facade('a/path');
// -> load a/path -> always
// 2. facade('a');
// -> load a.main
// 3. require('a');
// -> deps on a
// 4. require('./path')
// -> deps on a
// 5. require.async('a')
// -> load a.main -> 
// 6. require.async('./path')
// -> load a/path
// 7. require.async('b/path'): the entry of a foreign module
// -> forbidden

var pkgs = [];

// Load the script file of a module into the current document
// @param {string} id module identifier
function loadByModule(mod) {
  if (mod.l) {
    return;
  }

  // flag to mark the status that a module has already been loaded
  mod.l = true;

  var isFacade = mod.f;
  var isAsync = mod.a;
  var pkg = mod.pkg;

  // if one of the current package's entries has already been loaded,
  // and if the current module is not an entry(facade or async)
  if (~pkgs.indexOf(pkg)) {
    if (!isFacade && !isAsync) {
      return;
    }
  } else {
    pkgs.push(pkg);
  }

  var loaded = NEURON_CONF.loaded;
  var pathname;

  // is facade ?
  var evidence = isFacade
    // if a facade is loaded, we will push `mod.id` of the facade instead of package id
    // into `loaded`
    ? mod.id
    : pkg;

  if (~loaded.indexOf(evidence)) {
    // If the main entrance of the package is already loaded 
    // and the current module is not an async module, skip loading.
    // see: declaration of `require.async`
    if (isAsync) {
      pathname = generateModulePathname(mod);
    } else {
      return;
    }

    // load packages
  } else {
    var combine = NEURON_CONF.combo;

    if (combine) {
      var modules = getAllUnloadedSyncDeps(
        mod.name, 
        mod.version, 

        // If is a facade, we should always load it by `mod.id` not `mod.pkg`
        isFacade && removesLeadingSlash(mod.path)
      );

      if (modules.length > 1) {
        pathname = combine(modules);
      }

      // `getAllUnloadedSyncDeps` will push loaded.
    } else {
      loaded.push(evidence);
    }

    // If no combine configuration, or there's less than 2 packages,
    // load the package file directly
    pathname = pathname
      || generateModulePathname(mod);
  }

  loadJS(absolutizeURL(pathname));
}


function generateModulePathname(mod) {
  var id = mod.main
    // if is a main module, we will load the source file by package

    // 1.
    // on use: 'a@1.0.0' (async or sync)
    // -> 'a/1.0.0/a.js'

    // 2.
    // on use: 'a@1.0.0/relative' (sync)
    // -> not an async module, so the module is already packaged inside:
    // -> 'a/1.0.0/a.js'
    ? mod.pkg + '/' + mod.name + '.js'

    // if is an async module, we will load the source file by module id
    : mod.id;

  return moduleId2RelativeURLPath(id);
}


// 'a@1.0.0/a' -> './a/1.0.0/a.js'
function moduleId2RelativeURLPath (id) {
  return './' + id.replace('@', '/');
}



// Simply use `this`, and never detect the current environment
})(this);

