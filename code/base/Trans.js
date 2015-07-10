/**
 * @Description
 * 请求封装，
 *  1.支持ajax  jsonp请求
 *  2.自动转化跨域模式，跨域支持见./xd/XDRequest
 *  
 * 
 * @example

var Trans = require("Trans")

var request = new Trans({
  // 请求的url参数
  url:"",
  // 请求method  get post
  method:"get",
  // 返回数据类型  json  jsonp :将采用jsonp方式请求  html：请求的为html
  dataType:"json",
  // 请求参数
  data:{},
  // 超时时间，单位毫秒。
  timeout:30*1000
})

// 发送请求  参数为 对象，
// 请求返回的是 promise 方式
request.request(args,option).done(function(data){
  
}).fail(function(data){
  
})

// 重新设置url ：注意，重新设置url只能设置域名之后的路径。
request.resetUrl(url)

// 设置参数。
request.setArgs(args)

// 清空请求参数
request.clearArgs();
 * 
 */

define(function(require){
   
  var currentOrigin = $.parseURL(location.href).origin;
  var XDRequest = require("./xd/XDRequest");
  
  // 判断是否支持跨域
  // var isSupportCORS = (function(){
    // if ('withCredentials' in new XMLHttpRequest()) {
        // /* supports cross-domain requests */
       // return true;
    // }
    // else{
      // // ie ?
      // if(typeof XDomainRequest !== "undefined"){
        // return true;
      // }else{
        // return false;
      // }
    // }
  // });
  var isSupportCORS = false;
  
  function Trans(option){
    // 兼容以前的Trans({})写法
    if(!(this instanceof Trans)){
      return new Trans(option);
    }
    var _this = this;
    var opt = {
      url:"",
      method:"get",
      dataType:"json",
      data:{},
      timeout:30 * 1000
    }
    _this.opt = $.extend(opt,option);
    
    // 判断是否跨域
    var url = $.parseURL(_this.opt.url);
    // 判断是否同域名  以及是否支持ajax2跨域
    if(url.origin && currentOrigin != url.origin && !isSupportCORS && this.opt.dataType != "jsonp"){
      // TODO 跨域处理请求 xd 
      _this.trans = XDRequest(url.origin);
    }else{
      _this.trans = $.ajax;
    }
    
    if(this.opt.type == "jsonp"){
      this.opt.dataType = "jsonp"
    }
  }
  
  
  $.extend(Trans.prototype,{
    request:function(args,option){
      var opt = {
        success:$.noop,
        fail:$.noop,
        timeout:$.noop,
        timeout:15 * 1000
      }
      $.extend(opt,option)
      
      var deffer = $.Deferred();
      var _this = this;
      $.extend(_this.opt.data,args);
      
      var ajax = _this.trans({
         url:_this.opt.url,
         type:_this.opt.method,
         dataType:_this.opt.dataType,
         traditional:true,
         data:_this.opt.data,
         timeout:_this.opt.timeout
      }).done(function(data){
        deffer.resolve(data);
      }).fail(function(data){
         deffer.reject(data);
      });
      return deffer;
    },
    setArgs:function(args){
      $.extend(this.opt.data,args);
    },
    resetUrl:function(url){
      this.opt.url = url;
    },
    clearArgs:function(args){
      if(args){
        for(var i in args){
          if(this.opt.data[i]){
            delete this.opt.data[i];
          }
        }
      }else{
        this.opt.data = {};
      }
    }
  })
  
  return Trans;
})
