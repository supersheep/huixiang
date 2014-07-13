(function(){
function mix(a,b){for(var k in b){a[k]=b[k];}return a;}
var _0 = "clone@~0.1.11";
var _1 = "util@~1.0.0";
var _2 = "underscore@^1.5.2";
var _3 = "class@2.0.5/lib/attrs.js";
var _4 = "class@2.0.5/lib/events.js";
var _5 = "events@~1.0.0";
var _6 = "class@2.0.5/index.js";
var asyncDepsToMix = {};
var globalMap = asyncDepsToMix;
define(_6, [_0,_1,_2,_3,_4], function(require, exports, module, __filename, __dirname) {

// Opt in to strict mode of JavaScript, [ref](http://is.gd/3Bg9QR)
// Use this statement, you can stay away from several frequent mistakes 
'use strict';

var clone       = require('clone');
var attributes  = require('./lib/attrs');
var util        = require('util');
var _           = require('underscore');

/**
 * module  oop/class
 * author  Kael Zhang
 
 * unlike mootools
    - NR.Class() will return a pure javascript constructor
    - NR.Class() could inherit from a pure javascript constructor
 */



/**
 relevant javascript reserved words:

 extends
 implements

 */


/**
 Implements: 
     - classes implemented, constructor and destructor will not be inherited
     - implementing A will not make A instantiated

var myClass = NR.Class({
        Implements: [ Interface1, Interface2, 'options' ],
        
        initialize: function(){},
        
        method: function(){}
    }),

    instance = new myClass();
*/


/**
 * @return {Object}
 */
function getPrototype(obj){
    var ret;

    if(obj){
        if(util.isObject(obj)){
            ret = obj;
        }else if(typeof obj === 'string'){
            ret = getPrototype(EXTS[obj.toLowerCase()]);
        
        }else{
            ret = obj.prototype;
        }
    }
    
    return ret;
};


/**
 * @param {Object} host prototype of NR.Class instance
 * @param {Object} alien new prototype methods to be mixed in
 * @param {boolean} override whether new methods/props should override old methods/props
 */
function implementOne(host, alien, override){
    // prototype Object for mixin 
    var proto = getPrototype(alien);
    proto && _.extend(
        host, 
        clone(proto),
        // clone(proto, function(value, key){
        //    return PRIVATE_MEMBERS.indexOf(key) === -1;
        // }),
        
        // methods of an interface have second lowest priority
        override
    );
};


/**
 * implement a class with interfaces
 */
function implement(proto, extensions, override){
    if(typeof extensions === 'string'){
        extensions = extensions.trim().split(/\s+/);
    }

    if ( !util.isArray(extensions) ) {
        extensions = [extensions];
    }

    extensions.forEach(function(alien){
        implementOne(this, alien, override);
    }, proto);
};


/**
 * unlink the reference to the prototype and maintain prototype chain,
 * so that the changes of an instance will not ruin all instance references
 */
function resetPrototypeChain(instance){
    var value, key, type, reset;
    
    for(key in instance){
        if ( key !== attributes.KEY ) {
            value = instance[key];

            if(util.isObject(value)){
                var F = function(){};
                F.prototype = value;
                reset = resetPrototypeChain(new F);
            }else{
                reset = clone(value);
            }
            
            instance[key] = reset;
        }
    }
    
    return instance;
};


var INITIALIZE  = 'initialize',
    EXTS        = {};


// @public
// @param {Object} properties
// @param {Object} attrs
function Class(properties, attrs){
    if ( this instanceof Class ) {
        throw new Error('Class should not be used with `new`');
    }

    // -> Class({ key: 123 })
    if(util.isObject(properties)){
        var EXTENDS = 'Extends',
            base = properties[EXTENDS];
        
        delete properties[EXTENDS];
        
        return _Class(base, properties, attrs);
    
    // -> Class(foo)    
    }else{                                     
        var base = util.isFunction(properties) ? properties : function(){};
        attrs && attributes.set(base, attrs);
        
        return base;
    }
};


/**
 * no arguments checking!
 * @private
 * @param {function()|Class}
 * @param {Object} proto must be an object
 * @param {Object} attrs class attributes
 */
function _Class(base, proto, attrs){
    function newClass(){
        var init = initialize;
        
        /**
         * clean and unlink the reference relationship of the first depth between the instance and its prototype
         * and maintain prototype chain
         */
        resetPrototypeChain(this);
    
        if(init){
            return init.apply(this, arguments);
        }
    };
    
    var IMPLEMENTS = 'Implements',
        newProto,
        
        // so, NR.Class could make a new class inherit from a pure javascript constructor
        // inherit constructor from superclass
        initialize = proto[INITIALIZE] || base,
        exts = proto[IMPLEMENTS];
        
    delete proto[INITIALIZE];
    delete proto[IMPLEMENTS];
    
    // apply super prototypes
    if(base){
        
        // discard the parent constructor
        var F = function(){};
        F.prototype = base.prototype;
        newProto = new F;
        
        // priority high to low:
        // user custom prototype > ext > super class prototype
        exts && implement(newProto, exts, true);
        
        // bring correspondence with `util` of node.js
        newClass.super_ = base;
        _.extend(newProto, proto);
        
    }else{
    
        // no super class, directly assign user prototype for performance
        newProto = proto;
        exts && implement(newProto, exts, false);
    }
    
    newClass.prototype = newProto;
    
    // fix constructor
    newProto.constructor = newClass;

    attrs && attributes.set(newClass, attrs);
    
    return newClass;
};


/**
 * @public members
 * ----------------------------------------------------------------------- */


// @deprecated
// use NR.Class instead
// for backwards compact


Class.EXTS = EXTS;


/**
 change log:

 2013-03-05  Kael:
 - now we can Implements a class
 
 2012-10-17  Kael:
 - to prevent further inheritance problems, attributes will always be initialized during the creation of new class
 
 2012-09-03  Kael:
 - fix a bug that attributes of super class could not be overridden
 
 2012-07-20  Kael:
 - remove API: `NR.Class(base, proto)`;
 - now we could add ATTRS by NR.Class method: `NR.Class(properties, attrs)`;
 
 2012-01-30  Kael:
 - remove Class.destroy
 
 2011-11-16  Kael:
 - remove Class from the host(window)
 
 2011-10-19  Kael:
 - adjust the priority of inheritance chain as: user prototype > ext > super class prototype
 
 2011-09-19  Kael:
 - fix a bug the instance fail to clear the reference off its prototype
 
 2011-09-16  Kael:
 - remove a reserved word for possible future use
 - complete class extends
 
 2011-09-13  Kael:
 - refractor the whole implementation about Class
 
 2011-09-12  Kael:
 TODO:
 - A. add destructor support
 - B. make Class faster if there's no Extends
 - C. no merge, use NR.clone instead
 
 */

module.exports = Class;

Class.EXTS.attrs = attributes._EXT;
Class.EXTS.events = require("./lib/events");


}, {
    main:true,
    map:mix(globalMap,{"./lib/attrs":_3,"./lib/events":_4})
});

define(_3, [_1,_0], function(require, exports, module, __filename, __dirname) {
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
    map:globalMap
});

define(_4, [_5,_2], function(require, exports, module, __filename, __dirname) {
'use strict';

var events      = require('events');
var _           = require('underscore');

_.extend(exports, events.prototype);
}, {
    map:globalMap
});
})();