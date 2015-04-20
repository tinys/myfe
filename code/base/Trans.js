/**
 * 请求封装，
 *  1.支持ajax  json请求
 *  2.支持跨域请求
 *  
 */

define(function(require){
   
  var currentOrigin = $.parseURL(location.href).origin;
  var XDRequest = require("../xd/XDRequest");
  
  
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
      $.extend(this.opt.args,args);
    },
    resetUrl:function(url){
      this.opt.url = url;
    },
    clearArgs:function(){
      this.opt.data = {};
    }
  })
  
  return Trans;
})
