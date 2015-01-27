/**
 * 数据模型
 *  控制数据来源以及数据处理
 * 
 */
define(function(require){
  var Base = require("./EventEmitter"),
      Trans = require("./Trans");
      
  var Model = Base.extend({
    initialize:function(option){
      var opt = {
        url:"",
        method:"get",
        dataType:"json",
        // ajax  jsonp iajax
        type:"ajax",
        args:{},
        
        // 默认数据
        data:false
      }
      
      $.extend(opt,option);
      if(opt.url){
        var urlParsed = $.parseURL(opt.url);
        var params = $.queryToJson(urlParsed.query);
        $.extend(opt.args,params);
        if(Object.keys(params).length){
          var str = "";
          if(urlParsed.scheme){
            str+=urlParsed.scheme+":"
          }
          if(urlParsed.slash){
            str+=urlParsed.slash
          }
          if(urlParsed.host){
            str+=urlParsed.host
          }
          if(urlParsed.port){
            str+=":"+urlParsed.port
          }
          if(urlParsed.path){
            str+="/"+urlParsed.path
          }
          opt.url = str;
        }
      }
      
      
      var _this = this;
      
      _this.opt = opt;
      _this.parse = _this.parse || opt.parse;
      _this.trans = Trans(opt);
    },
    fetch:function(args){
      this.request.apply(this,arguments);
    },
    _triggerSuccess_:function(data){
      var _this = this;
      data = _this.parse?_this.parse(data):data;
      _this.trigger("request",data);  
    },
    request:function(args){
      var _this = this;
      _this.trigger("requeststart");
      
      var _args = _this.opt.args;
      $.extend(_args,args);
      
      function success(data){
       _this._triggerSuccess_(data,_args);
      }
      
      function fail(data){
        _this.trigger("fail",data);
      }
     
      
      return _this.trans.request(_args).done(function(data){
        success(data);
      }).fail(function(data){
        fail(data);
      })
    },
    // // 取消请求
    // cancel:function(){
//       
    // },
    getArgs:function(){
       return this.opt.args;
    },
    destroy:function(){
      var _this = this;
      _this.opt = null;
      _this.data = null;
      _this.trans = null;
      
      _this._super();
    }
  });
  
  return Model;
})
