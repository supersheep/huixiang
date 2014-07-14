(function(){
function mix(a,b){for(var k in b){a[k]=b[k];}return a;}
var _0 = "util@~1.0.0";
var _1 = "clone@~0.1.11";
var _2 = "attributes@1.4.0/index.js";
var asyncDepsToMix = {};
var globalMap = asyncDepsToMix;
define(_2, [_0,_1], function(require, exports, module, __filename, __dirname) {
'use strict';

var attrs       = exports;
var util        = require('util');
var clone       = require('clone');

var GETTER      = 'getter';
var SETTER      = 'setter';
var VALIDATOR   = 'validator';
var READ_ONLY   = 'readOnly';
var WRITE_ONCE  = 'writeOnce';

attrs.KEY = '_ATTRS';

function NOOP (){};

function mix (receiver, supplier, override){
    var key;

    if(arguments.length === 2){
        override = true;
    }

    for(key in supplier){
        if(override || !(key in receiver)){
            receiver[key] = supplier[key]
        }
    }

    return receiver;
}


attrs._mix = mix;


/**
 * setter for class attributes
 * @private
 * @param {boolean} ghost inner use
     if true, setValue will ignore all flags or validators and force to writing the new value

 * @return {boolean} whether the new value has been successfully set
 */
function setValue(host, attr, value){
    var pass = true,
        setter,
        validator,
        v;

    if(!attr){
        return false;
    }

    if(attr[READ_ONLY]){
        pass = false;

    }else{
        validator = getMethod(host, attr, VALIDATOR);

        pass = !validator || validator.call(host, value);
    }

    if(pass && attr[WRITE_ONCE]){
        delete attr[WRITE_ONCE];
        attr[READ_ONLY] = true;
    }

    if(pass){
        setter = getMethod(host, attr, SETTER);

        if(setter){
            // if setter is defined, always set the return value of setter to attr.value
            attr.value = setter.call(host, value);
        }else{

            // mix object values
            attr.value = value;
        }
    }

    return pass;
};


/**
 * getter for class attributes
 */
function getValue(host, attr){
    var getter = getMethod(host, attr, GETTER),
        v = attr.value;

    return getter ?

          // getter could based on the value of the current value
          getter.call(host, v)
        : v;
};


function getMethod(host, attr, name){
    var method = attr[name];

    return typeof method === 'string' ? host[method] : method;
};


/**
 * @private
 * @param {Object} host
 * @param {Object} sandbox shadow copy of the attributes of a class instance
 * @param {undefined=} undef
 */
function createGetterSetter(host, sandbox){
    var undef;

    function _get (host, key) {
        var attr = sandbox[key];

        return attr ? getValue(host, attr) : undef;
    }

    function _getAll (host) {
        var s = sandbox,
            key,
            ret = {};

        for(key in s){
            ret[key] = _get(host, key, s);
        }

        return ret;
    }

    function _addAttr (key, setting){
        sandbox[key] || (sandbox[key] = util.isObject(setting) ?

                            // it's important to clone the setting before mixing into the sandbox,
                            // or host.set method will ruin all references
                            clone(setting) :
                            {}
                        );
    }

    host.set = function(key, value){
        var

        attr, obj,
        pass = true;

        if(util.isObject(key)){
            obj = key;

            for(key in obj){

                // even if fail to pass, we should continue setting
                pass = !!setValue(this, sandbox[key], obj[key]) && pass;
            }

        }else{
            pass = !!setValue(this, sandbox[key], value);
        }

        return pass;
    };

    host.get = function(key){
        return arguments.length ? _get(this, key) : _getAll(this);
    };

    host.addAttr = function (key, setting) {
        if ( util.isObject(key) ) {
            var k;

            for (k in key){
                _addAttr(k, key[k]);
            }

        } else {
            _addAttr(key, setting);
        }
    };

    host.removeAttr = function(key){
        delete sandbox[key];
    };
};


function createPublicMethod(name){
    return function(){
        // @private
        // sandbox
        var sandbox = createSandBox(this);

        // .set and .get methods won't be initialized util the first .set method excuted
        createGetterSetter(this, sandbox);

        return this[name].apply(this, arguments);
    };
};


function createSandBox(host){
    var attributes = host[attrs.KEY];

    return attributes ? clone(attributes) : {};
};


var EXT = attrs._EXT = {};

['addAttr', 'get', 'set', 'removeAttr'].forEach(function(name){
    EXT[name] = createPublicMethod(name);
});


// patch utility methods and attributes
attrs.patch = function (host, attributes) {
    if ( typeof host === 'function' ) {
        host = host.prototype;
    }

    mix(host, EXT);

    attrs.set(host, attributes);
};


// set attributes
attrs.set = function (host, attributes) {
    if ( typeof host === 'function' ) {
        host = host.prototype;
    }

     // mixed by `util.inherits`
    var parent_attrs = host[attrs.KEY];

    if ( parent_attrs ) {
        mix(attributes, parent_attrs, false);
    }

    host[attrs.KEY] = attributes;
};


/**
 2012-02-23  Kael:
 - fix a fatal reference exception for .addAttr method

 2012-01-30  Kael:
 - remove .setAttrs methdo. sandbox will be initialized by the first execution of .set, .get, or .addAttr method

 2011-10-24  Kael:
 - setAttrs method will return this
 - prevent addAttr method from affecting the existing attr object

 2011-10-18  Kael:
 TODO:
 - ? A. optimize setAttrs method, lazily initialize presets after they are called

 2011-09-20  Kael:
 - attr setter will return true or false to tell whether the new value has been successfully set

 2011-09-17  Kael:
 - TODO[09-15].A

 2011-09-15  Kael:
 - privatize attributes
 - create .get and .set method

 TODO:
 - ? A. ATTRs inheritance

 */

}, {
    main:true,
    map:globalMap
});
})();