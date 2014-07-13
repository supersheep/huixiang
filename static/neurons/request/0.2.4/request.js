(function(){
function mix(a,b){for(var k in b){a[k]=b[k];}return a;}
var _0 = "request@0.2.4/lib/ajax.js";
var _1 = "request@0.2.4/lib/jsonp.js";
var _2 = "class@~2.0.0";
var _3 = "json@~1.0.0";
var _4 = "lang@~1.0.0";
var _5 = "asset@~1.0.0";
var _6 = "request@0.2.4/lib/index.js";
var asyncDepsToMix = {};
var globalMap = asyncDepsToMix;
define(_6, [_0,_1], function(require, exports, module, __filename, __dirname) {
'use strict';

var request = module.exports = {};

var Ajax = request.Ajax = require('./ajax');
var JSONP = request.JSONP = require('./jsonp');
}, {
    main:true,
    map:mix(globalMap,{"./ajax":_0,"./jsonp":_1})
});

define(_0, [_2,_3,_4], function(require, exports, module, __filename, __dirname) {
'use strict';

/*!
 * module  ajax
 * author  Kael Zhang
 */


var Class = require('class');
var JSON = require('json');
var lang = require('lang');

function standardXMLHttpRequest(){
    return new XMLHttpRequest();
};

function isXHRSuccess(xhr){
    var pass = false, s;

    try{
        s = xhr.status;

        // IE sometimes incorrectly returns 1223 which should be 204
        // ref:
        // http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
        pass = s >= 200 || s < 300 || s === 1223;

    }catch(e){}

    return pass;
};


function NOOP(){};

function LAMBDA(data){
    return data;
};

function returnTrue(){
    return true;
};

function extendQueryString(query, extra){
    return query + (query.indexOf('?') > -1 ? '&' : '?' ) + extra;
};


/**
  ref: http://www.w3.org/TR/XMLHttpRequest2/#the-xmlhttprequest-interface
    const unsigned short UNSENT = 0;
    const unsigned short OPENED = 1;
    const unsigned short HEADERS_RECEIVED = 2;
    const unsigned short LOADING = 3;
    const unsigned short DONE = 4;
    readonly attribute unsigned short readyState;
 */
var DONE = 4;

var WIN = window;

var EMPTY = '';
var POST = 'POST';
var GET = 'GET';
var STR_JSON = 'json';

var WITH_CREDENTIALS = 'withCredentials';


var REGEX_TRIM_EMPERSAND = /^&+|&+$/;
var REGEX_TRIM_HASH = /#.*$/;

var Xhr = WIN.ActiveXObject ?

    // fallback
    function() {
        if (WIN.XMLHttpRequest) {
            try {
                return standardXMLHttpRequest();
            } catch(e) {}
        }

        try {
            return new WIN.ActiveXObject('Microsoft.XMLHTTP');
        } catch(e) {
        }
    }
:
    standardXMLHttpRequest;


var X_REQUESTED_WITH = {
    'X-Requested-With': 'XMLHttpRequest'
};

var header_presets = {
    Accept: {
        xml     : 'aplication/xml, text/xml',
        html    : 'text/html',
        script  : 'text/javascript, application/javascript',
        json    : 'application/json, text/javascript',
        text    : 'text/plain',
        '*'     : '*/*'
    },

    'X-Request': {
        json    : 'JSON'
    }
};

var response_filter = {
    xml    : 'responseXML',
    text   : 'responseText'
};

// XMLHttpRequest2
var xhr_tester = Xhr();

// progress support
var is_progress_supported = 'onprogress' in xhr_tester;

// credentials support, for cross domain ajax request
var is_credentials_supported = WITH_CREDENTIALS in xhr_tester;


// @private
var Ajax = Class({
    Implements: 'attrs events',

    initialize: function(options){
        var bind = lang.bind;

        this.set(options);

        this.xhr = Xhr();

        bind('_stateChange', this);

        if(is_progress_supported){
            bind('_loadstart', this);
            bind('_progress', this);
        }
    },

    _stateChange: function(){
        var
        xhr = this.xhr,
        response;

        if (xhr.readyState === DONE && this.running){
            this.running = false;

            xhr.onreadystatechange = NOOP;

            clearTimeout(this.timer);

            response = this._parseResponse(xhr);

            this.emit(
                !this.parseError && this.get('isXHRSuccess')(xhr) && this.get('isSuccess')(response) ? 'success' : 'error',
                response, xhr
            );
        }
    },

    _parseResponse: function(xhr){
        var
        santitizer  = this.get('santitizer'),
        parser      = this.get('parser'),
        type        = this.get('dataType'),

        rt,
        data_filter = response_filter;

        rt = santitizer(xhr[data_filter[type] || data_filter.text] || xhr[data_filter.text]);

        if(type.indexOf(STR_JSON) > -1){
            try{
                rt = JSON.parse(rt);
                this.parseError = false;

            }catch(e){
                rt = {};
                this.parseError = true;
            }
        }

        return parser(rt);
    },

    send: function(data){
        var method  = this.get('method'),
            url     = this.get('url'),
            timeout = this.get('timeout'),
            user    = this.get('user'),
            async   = this.get('async'),

            xhr = this.xhr;

        this.running = true;

        data = this._tidyRequest(data);

        if(method === GET){

            /**
             * if options.cache is false, force reloading
             */
            if(!this.get('cache')){
                url = extendQueryString(url, '_nr_force=' + lang.guid());
            }

            if(data){
                url = extendQueryString(url, data);
                data = undefined;
            }
        }

        if (is_progress_supported){
            xhr.onloadstart = this._loadstart;
            xhr.onprogress  = this._progress;
        }

        // socket
        if(user){
            xhr.open(method, url, async, user, this.get('password'));

        // passing null username, generates a login popup on Opera
        }else{
            xhr.open(method, url, async);
        }

        /**
         * for firefox 3.5+ and other xmlhttprequest2 supported browsers
         * ref:
         * https://developer.mozilla.org/en/HTTP_access_control#Requests_with_credentials
         * http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-withcredentials
         */
        if (user && WITH_CREDENTIALS in xhr){
            xhr[WITH_CREDENTIALS] = true;
        }

        xhr.onreadystatechange = this._stateChange;

        lang.each(this.get('headers'), function(header, key){

            // for cross domain requests, try/catch is needed
            try {
                xhr.setRequestHeader(key, header);
            } catch (e){}
        });

        this.emit('request');

        xhr.send(data);

        !async && this._stateChange();


        var self = this;

        if(timeout){
            this.timer = setTimeout(function(){
                self.cancel();

            }, timeout);
        }

        return this;
    },

    // @returns {string} query string
    _tidyRequest: function(data){
        data = (data === undefined ? this.get('data') : data) || EMPTY;

        if (lang.isObject(data)){
            data = lang.toQueryString(data);

        }

        return data;
    },

    _loadstart: function(event){
        this.emit('loadstart', [event, this.xhr]);
    },

    _progress: function(event){
        this.emit('progress', [event, this.xhr]);
    },

    cancel: function(){
        var xhr = this.xhr;

        if (this.running){
            this.running = false;


            xhr.abort();
            clearTimeout(this.timer);
            xhr.onreadystatechange = NOOP;

            if (is_progress_supported){
                xhr.onprogress = xhr.onloadstart = NOOP;
            }

            this.xhr = Xhr();
            this.emit('cancel');
        }

        return self;
    }

}, {
    url: {
        value: EMPTY,

        getter: function(v){
            return String(v).replace(REGEX_TRIM_HASH, EMPTY) || location.pathname;
        }
    },

    method: {

        // GET is recommended
        value: GET,

        setter: function(v){
            v = ('' + v).toUpperCase();

            // make sure is uppercase 'GET' or 'POST'
            return v === GET || v === POST ? v : GET;
        }
    },


    // @type {string}
    // if dataType is 'json', an empty responseText will be treated as an Error by default;
    // you can config santitizer option to avoid this:
    //     santitizer -> function(rt){ return rt || {}; }
    dataType: {
        value: STR_JSON,
        setter: function(v){
            return v || '*';
        }
    },

    async: {
        value: true
    },

    timeout: {
        value: 0
    },

    cache: {
        value: false
    },

    user: {
        value: EMPTY
    },

    password: {
        value: EMPTY
    },

    headers: {
        getter: function(headers){
            if(!lang.isObject(headers)){
                headers = {};
            }

            var

            data_type = this.get('dataType'),
            method = this.get('method'),
            presets = header_presets;

            lang.mix(headers, X_REQUESTED_WITH, false);

            lang.each(presets, function(preset, key){
                var header = preset[data_type];

                if(header){
                    headers[key] = header;
                }

                if(method === POST){
                    headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
                }
            });

            return headers;
        }
    },

    /**
     * parse the final data
     */
    parser: {
        value: LAMBDA
    },

    /**
     * sanitize the data from the responseText before everything takes its part
     * it will be really useful if the responsed data is nonstandard
     */
    santitizer: {
        value: LAMBDA
    },

    isSuccess: {
        value: returnTrue
    },

    isXHRSuccess: {
        value: isXHRSuccess
    },

    data: {}
});


xhr_tester = null;

module.exports = Ajax;


/**
 2013-02-04  Kael:
 - completely migrate to neuron with class attributes
 - fix issue#1

 2011-11-03  Kael:
 - fix a bug about request headers

 2011-10-24  Kael:
 - migrate to Neuron

 2011-08-27  Kael:
 - complete main functionalities
 - minimize the dependency on mootools
 - remove non-standard ecma5 methods
 - dealing with Header:Accepts according to expected data type
 - add some support to XMLHttpRequest2, such as progress, credentials(user, password)
 - add santitizer and parser configurations

 TODO:
 A. add support to xmlParser
 B. add queue supported
 C. add complete cross domain support
 D. check compatibility with XMLHttpRequest2
 E. test Content-type and Accepts


 */
}, {
    map:globalMap
});

define(_1, [_2,_4,_5], function(require, exports, module, __filename, __dirname) {
'use strict';

/*!
 * module  jsonp
 * author  Kael Zhang
 */


// JSONP Request


var Class = require('class');
var lang = require('lang');
var asset = require('asset');

/**
 * @private
 * clean/check the symbol of empersand('&') on the end/beginning of a query

 * @param query {query} the string to be tidied
 * @param hasFirst {Boolean}
 *      if true, will check whether there is a '&' at first. if there isn't, one '&' will be added
 *      if false, 
 */
function _tidyEmpersand(str, hasFirst, hasLast) {
    if (str) {
        var e = '&',
            len = str.length - 1,
            f = str[0] === e,
            l = str[len] === e;
    
        if (!hasFirst) {
            str = f ? str.substr(1) : str;
        } else {
            str = f ? str : e + str;
        }

        len = str.length - 1;

        if (!hasLast) {
            str = l ? str.substr(0, len) : err;
        } else {
            str = l ? str : str + e;
        }
    }

    return str || '';
};

var _counter = 0;
var JSONP_CALLBACK_PUBLIC_PREFIX = '_JSONPCallback';

var JSONP = Class({

    Implements: 'events attrs',

    initialize: function (options) {
        this.set(options);
    },

    // @returns {string} query string
    _tidyRequest: function(data){
        data = (data === undefined ? this.get('data') : data) || '';
        
        if (lang.isObject(data)){
            data = lang.toQueryString(data);
        
        }

        if(!this.get('cache')){
            data += '&_nr_force' + (+ new Date);
        }
        
        return data;
    },

    /**
     * @private
     * generate a query url
     */
    _getQuestURL: function(url, key, query, index) {
        url = url.split('?');

        return url[0] + '?' + _tidyEmpersand(url[1], false, true) + _tidyEmpersand(query, false, true) + key + '=' + JSONP._HOLDER_NAME + '._' + index;
    },

    // @param options 
    //  {Object} jsonp request data
    //  {String} jsonp request query string

    // @note: no more support Element type
    send: function (data) {
        var query = this._tidyRequest(data),
            src,
            script,
    
            // generate a unique, non-zero jsonp request id
            uid = ++ _counter,
            K = NR,
            request = JSONP._HOLDER,
            timeout = this.get('timeout');

        // formatting data -------------------------------------------------------
        
        src = this._getQuestURL(this.get('url'), this.get('callbackKey'), query, uid);

        if (src.length > 2083){
            return this.emit('error', src);
        }

        var self = this;

        // JSONP request start
        request['_' + uid] = function () {
            self.__success.apply(self, arguments);

            delete request['_' + uid];
        }
        
        this._clear();
        this.script = asset.js(src, false, {
            remove: true
        });

        this.emit('request');

        if (timeout) {
            setTimeout(function(){
                self.emit('timeout');
                self.emit('error');
                self.cancel();
                
            }, timeout);
        }

        return uid;
    },

    // @private
    __success: function() {
        this.emit.apply(this,['success'].concat(arguments));
    },

    // TODO
    // bug, could not really cancel jsonp request
    cancel: function() {
        return this._clear().emit('cancel');
    },

    _clear: function(){
        this.script = null;
        return this;
    }

}, {
    // @type {string} JSONP request uri
    url: {
        value: ''
    },
    
    callbackKey: {
        value: 'callback'
    },
    
    data: {
    },
    
    timeout: {
        value: 0
    },

    cache: {
        value: false
    }
});


// Set the global namespace to hold JSONP callback functions
// @param {string} namespace
JSONP.setNS = function(namespace){
    var callback_prefix = '';
    var ns;

    if(namespace){
        // namespace = 'NR'
        ns = window[namespace];

        if(Object(ns) !== ns){
            ns = window[namespace] = {};
        }

        // 'NR.'
        callback_prefix = namespace + '.';
    }else{
        ns = window;
    }

    JSONP._HOLDER_NAME = callback_prefix + JSONP_CALLBACK_PUBLIC_PREFIX;

    JSONP._HOLDER = ns[JSONP_CALLBACK_PUBLIC_PREFIX] || (ns[JSONP_CALLBACK_PUBLIC_PREFIX] = {});
};

JSONP.setNS('NR');

module.exports = JSONP;


/**
 change log
 2011-11-01  Kael
 - migrate to Neuron
 */
}, {
    map:globalMap
});
})();