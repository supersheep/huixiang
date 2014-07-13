(function(){
function mix(a,b){for(var k in b){a[k]=b[k];}return a;}
var _0 = "events@~1.0.5";
var _1 = "util@~1.0.4";
var _2 = "jquery@~1.9.1";
var _3 = "underscore@~1.5.2";
var _4 = "attributes@~1.4.0";
var _5 = "uploader@0.1.0/src/queue.js";
var _6 = "uploader@0.1.0/src/adapter/flash.js";
var _7 = "uploader@0.1.0/src/adapter/ajax.js";
var _8 = "uploader@0.1.0/src/adapter/iframe.js";
var _9 = "uploader@0.1.0/src/template/default.js";
var _10 = "uploader@0.1.0/src/uid.js";
var _11 = "swfuploader@~0.1.0";
var _12 = "json@~1.0.1";
var _13 = "uploader@0.1.0/src/adapter/flash_default_options.js";
var _14 = "request@~0.2.4";
var _15 = "uploader@0.1.0/src/index.js";
var asyncDepsToMix = {};
var globalMap = asyncDepsToMix;
define(_15, [_0,_1,_2,_3,_4,_5,_6,_7,_8,_9], function(require, exports, module, __filename, __dirname) {
'use strict';

var events = require("events");
var util = require("util");
var $ = require("jquery");
var Queue = require("./queue");
var _ = require("underscore");
var attributes = require("attributes");

module.exports = Uploader;

var adapters = {
    flash : require("./adapter/flash"),
    ajax : require("./adapter/ajax"),
    iframe: require("./adapter/iframe")
}


function Uploader(element,config){

    var Theme = config.theme || require("./template/default");
    var self = this;

    this.type = config.type || "flash";
    var adapter = new adapters[this.type](element,config);

    // 初始化上传队列

    this._initQueue();

    adapter.on("load",function(){
        self.emit("load");
    })

    adapter.on("select",function(e){
        var queue = self.get('queue'),
            curId = self.get('currentIndex'),
            files = e.files;

        files = self._processExceedMultiple(files);
        self.emit("select",{files:files});

        console.log("e.files.....",e.files);
        _.forEach(e.files,function(file){
            queue.add(file);
        });
        if (!curId && self.get('autoUpload')) {
            self.upload(queue.getIds("waiting")[0]);
        }
    });

    adapter.on("progress",function(e){
        var queue = self.get("queue");
        console.log("e.file",e.file);
        queue.updateFileStatus(e.file,"progress");
        self.emit("progress",e);
    });

    adapter.on("success",function(e){
        var queue = self.get("queue");
        queue.updateFileStatus(e.file,"success");
        self.emit("success",e);
        self.emit("complete",e);
    });

    adapter.on("error",function(e){
        var queue = self.get("queue");
        queue.updateFileStatus(e.file,"error");
        self.emit("error",e);
        self.emit("complete",e);
    });

    self.on("complete",function(e){
        var queue = self.get("queue");
        var file = e.file;
        self._continue();
    });

    this.set("adapter",adapter);

    this.theme(new Theme("#queue"));
}

util.inherits(Uploader,events);
attributes.patch(Uploader,{
    /**
     * 是否自动上传
     * @type Boolean
     * @default true
     */
    autoUpload:{value:true},
    /**
     * Queue队列的实例
     * @type Queue
     * @default {}
     */
    queue:{value:{}},
    /**
     * 上传方式实例
     * @type UploaderType
     * @default {}
     */
    adapter:{value:{}},
    /**
     * 用于限制多选文件个数，值为负时不设置多选限制
     * @type Number
     * @default -1
     */
    multipleLen:{value:-1},
    /**
     *  当前上传的文件对应的在数组内的索引值，如果没有文件正在上传，值为空
     *  @type Number
     *  @default ""
     */
    currentIndex:{value:''},
    isAllowUpload:{value:true},
    isSuccess:{value:function(){return true;}}
});

Uploader.prototype.upload = function(id){
    var type = this.type = this._getType();
    this.emit("start");
    this.get("adapter").upload(id);
}


Uploader.prototype._initQueue = function () {
    var self = this, queue = new Queue();
    //将上传组件实例传给队列，方便队列内部执行取消、重新上传的操作
    queue.set('uploader', self);

    queue.on('add',function(ev){
        self.emit("add",ev);
    });

    //监听队列的删除事件
    queue.on('remove', function (ev) {
        self.emit("remove",ev);
    });
    self.set('queue', queue);
    return queue;
};


Uploader.prototype.theme = function(theme){
    var self = this;
    var queue = this.get('queue');
    theme.set('uploader',self);
    self.on('add',function(file){
        theme._createItem(file);
    });

    _.forEach(['load','add','remove','start','progress','success','error','complete'],function(ev){
        self.on(ev,function(e){
            var func = theme["_" + ev + "Handler"];
            func && func.call(self,e);;
        });
    });
}

/**
 * 超过最大多选数予以截断
 */
Uploader.prototype._processExceedMultiple = function (files) {
    var self = this, multipleLen = self.get('multipleLen');
    if (multipleLen < 0 || !_.isArray(files) || !files.length) return files;
    return S.filter(files, function (file, index) {
        return index < multipleLen;
    });
};

Uploader.prototype._continue = function(){
    var queue = this.get("queue");
    this.upload(queue.getIds("waiting")[0]);
}

Uploader.prototype._getType = function(){
    return "flash";
}


}, {
    main:true,
    map:mix(globalMap,{"./queue":_5,"./adapter/flash":_6,"./adapter/ajax":_7,"./adapter/iframe":_8,"./template/default":_9})
});

define(_5, [_0,_1,_4,_3,_10], function(require, exports, module, __filename, __dirname) {
var events = require("events");
var util = require("util");
var attributes = require("attributes");
var uid = require("./uid");
var _ = require("underscore");

module.exports = Queue;


function Queue(){

}

util.inherits(Queue,events);
attributes.patch(Queue,{
    uploader:{value:{}},
    files:{value:[]}
});

Queue.prototype.getFile = function (id) {
    var self = this;
    var files = self.get('files');
    return _.filter(files,function(file){
        return file.id == id;
    })[0];
};

Queue.prototype.getIds = function(status){
    var files = this.get("files");
    function matchStatus(file){
        return file.status == status;
    }

    function getId(file){
        return file.id;
    }

    return _.map(_.filter(files,matchStatus),getId);
};

Queue.prototype.remove = function(id){
    var files = this.get("files");
    if(!files){return;}
    if(!id){id = files[0].id}
    var new_files = [];
    var file;
    _.forEach(files,function(f){
        if(f.id == id){
            file = f;
        }else{
            new_files.push(f);
        }
    });

    if(file){
        this.set("files",new_files);
        this.emit("remove",{
            file:file
        });
    }
}

Queue.prototype.updateFileStatus = function(file,status){
    file = this.getFile(file.id);
    if(file){
        file.status = status;
    }
    return true;
}

Queue.prototype.clear = function(){
    var self = this;

    function _remove(){
        var files = self.get("files");
        if(files.length){
            self.remove();
            _remove();
        }else{
            self.fire("clear");
        }
    }
    _remove();
}

Queue.prototype.add = function(file){
    var files = this.get('files');
    var uploader = this.get('uploader');
    file.status = "waiting";
    files.push(file);
    this.emit("add",{
        file:file
    });
};


}, {
    map:mix(globalMap,{"./uid":_10})
});

define(_6, [_2,_11,_0,_3,_1,_12,_13], function(require, exports, module, __filename, __dirname) {
var $ = require("jquery");
var SWFUpload = require("swfuploader");
var events = require("events");
var _ = require("underscore");
var util = require("util");
var JSON = require("json");

var ERRORS = {
    "-200" : "HTTP_ERROR"                  ,
    "-210" : "MISSING_UPLOAD_URL"          ,
    "-220" : "IO_ERROR"                    ,
    "-230" : "SECURITY_ERROR"              ,
    "-240" : "UPLOAD_LIMIT_EXCEEDED"       ,
    "-250" : "UPLOAD_FAILED"               ,
    "-260" : "SPECIFIED_FILE_ID_NOT_FOUND" ,
    "-270" : "FILE_VALIDATION_FAILED"      ,
    "-280" : "FILE_CANCELLED"              ,
    "-290" : "UPLOAD_STOPPED"              ,
    "-300" : "JSON_PARSE_FAILED"           ,
    "-310" : "CUSTOM_DEFINED_ERROR"
};

var default_options = require("./flash_default_options");

module.exports = FlashUploader;
FlashUploader.errors = ERRORS;
function FlashUploader(elem, config){
    var self = this;
    var isSuccess = _.isFunction(config.isSuccess) ? config.isSuccess : function(){return true;};

    var handlers = {
        swfupload_loaded_handler:function(){
            self.emit("load");
        },
        file_dialog_complete_handler:function(numFilesSelected, numFilesQueued, numFilesInQueue){
            console.log(arguments);
            var files = [];
            var stats = this.getStats();
            var total = _.reduce(_.values(stats),function(a,b){
                return a+b;
            },0) - stats.in_progress;
            for(var i = total - numFilesSelected; i < total; i++){
                files.push(this.getFile(i));
            }


            console.log("stats",stats);
            console.log("total",total);
            console.log("args",arguments);

            if(files.length){
                self.emit("select",{
                    files:files
                });
            }
        },
        upload_start_handler:function(file){
            self.emit("start",{
                file:file
            });
        },
        file_queued_handler:function(file){
            console.log("queued",file);
        },
        file_queue_error_handler:function(file,code,message){

            console.log("queued error",file);
        },
        upload_progress_handler:function(file,uploaded,total){
            self.emit("progress",{
                file:file,
                uploaded:uploaded,
                total:total
            });
        },
        upload_error_handler:function(file,code,message){
            self.emit("error",{
                file:file,
                code:code,
                message:message
            });
        },
        // file:
        // The file object that was successfully uploaded
        // data:
        // The data that was returned by the server-side script (anything that was echoed by the file)
        // response:
        // The response returned by the server—true on success or false if no response.
        // If false is returned, after the successTimeout option expires, a response of true is assumed.
        upload_success_handler:function(file,data,response){
            var data;


            try{
                data = JSON.parse(data);
            }catch(e){
                self.emit("error",{
                    file:file,
                    code:"-300",
                    message:"error parsing JSON"
                });
                return;
            }

            if(!isSuccess(data)){
                self.emit("error",{
                    file:file,
                    code:"-310",
                    message:"error custom",
                    data:data
                })
            }else{
                self.emit("success",{
                    file:file,
                    data:data,
                    res:response
                });
            }
        },
        upload_complete_handler:function(){}
    };


    elem = $(elem);
    var id = FlashUploader._renderButton(elem);

    var custom_configs = {
        post_params: config.data || {},
        upload_url: config.action,
        file_queue_limit : config.limit,
        button_placeholder_id: id,
        file_types:config.types || "*.jpg;*.png;*.bmp",
        file_post_name: config.name || "file",
        button_width: elem.width(),
        button_height: elem.height()
    }


    var swf_config;
    swf_config = _.extend({},default_options);
    swf_config = _.extend(swf_config,handlers);
    swf_config = _.extend(swf_config,custom_configs);
    swf_config = _.extend(swf_config,config.swf_config);

    this.swfu = new SWFUpload(swf_config);
};

util.inherits(FlashUploader,events);
FlashUploader.instanceCount = 0;


FlashUploader.prototype.upload = function(indexOrId){

    this.swfu.startUpload(indexOrId);
}

FlashUploader.prototype.cancel = function(){

};

FlashUploader._renderButton = function(elem){

    var id = "swfu_holder_" + (FlashUploader.instanceCount+1);
    var holder = $("<div class='swfu_wrapper'><div id='" + id + "' /></div>");

    elem.css("position","relative");
    holder.css({
        "position":"absolute",
        "top":0,
        "left":0,
        "width": elem.width(),
        "height": elem.height()
    });
    holder.appendTo(elem);
    return id;
};
}, {
    map:mix(globalMap,{"./flash_default_options":_13})
});

define(_7, [_14], function(require, exports, module, __filename, __dirname) {

var ajax = require("request").Ajax;



}, {
    map:globalMap
});

define(_8, [], function(require, exports, module, __filename, __dirname) {

}, {
    map:globalMap
});

define(_9, [_2,_3,_4], function(require, exports, module, __filename, __dirname) {
var $ = require("jquery");
var _ = require('underscore');
var attributes = require('attributes');
var EMPTY='';


module.exports = Template;

function Template(container){
    this.container = $(container);

    var self = this;

     var tpl = '<li id="J_upload_item_<%=id%>">\
                <div class="pic" style="display:none"><img /></div>\
                <div class="name"><%=name%></div>\
                <div class="status"></div>\
                <div class="progress">\
                    <div class="percent" style="background-color:#39d;"></div>\
                </div>\
                <span class="remove">x</span>\
            </li>';

    this.set('tpl',tpl);
}

attributes.patch(Template,{
    uploader:{value:{}},
    tpl:{value:EMPTY}
});


Template.prototype._createItem = function(event){
    var self = this;
    var container = this.container;
    var file = event.file;
    var item = $(_.template(this.get('tpl'),file));
    item.find(".remove").on("click",function(){
        var uploader = self.get("uploader");
        uploader.get("queue").remove(file.id);
    });
    file.block = item;
    item.appendTo(container);
};

Template.prototype._removeHandler = function(e){
    var file = e.file;
    file.block && file.block.remove();
}

Template.prototype._progressHandler = function(e){
    var file = e.file;
    var elem = $("#J_upload_item_" + file.id);
    elem.find(".percent").css("width",e.uploaded/e.total*100 + "%");
}

Template.prototype._successHandler = function(e){
    var file = e.file;
    var data = e.data;
    var elem = $("#J_upload_item_" + file.id);
    elem.find(".pic").show();
    elem.find("img").attr("src",data.path);
    elem.find(".progress").hide();
    elem.find(".status").addClass("ok").html("成功");
}

Template.prototype._completeHandler = function(e){
}

Template.prototype._errorHandler = function(e){
    console.log("ERROR",e);
    var file = e.file;
    var data = e.data;
    var elem = $("#J_upload_item_" + file.id);
    elem.find(".progress").hide();
    elem.find(".status").addClass("fail").html("失败");
}
}, {
    map:globalMap
});

define(_10, [], function(require, exports, module, __filename, __dirname) {
var count = 0;

module.exports = function(){
    return count++;
}
}, {
    map:globalMap
});

define(_13, [_11], function(require, exports, module, __filename, __dirname) {
var SWFUpload = require("swfuploader");
module.exports = {
    flash_url : "http://www.dianping.com/shoppic/res/swfupload.swf",
    post_params: {},
    file_size_limit : "100 MB",
    file_types_description : "All Files",
    file_upload_limit : 0,
    // Due to some bugs in the Flash Player the server response may not be acknowledged and no uploadSuccess event is fired by Flash.
    // set this value to 0, SWFUpload will wait indefinitely for the Flash Player to trigger the uploadSuccess event.
    assume_success_timeout: 0,
    custom_settings : {
        progressTarget : "fsUploadProgress",
        cancelButtonId : "btnCancel"
    },
    debug: false,

    // Button settings
    // button_image_url: "images/TestImageNoText_65x29.png",
    button_cursor : SWFUpload.CURSOR.HAND,
    button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
    // button_text: '<span class="theFont">Hello</span>',
    // button_text_style: ".theFont { font-size: 16; }",
    button_text_left_padding: 12,
    button_text_top_padding: 3
};

}, {
    map:globalMap
});
})();