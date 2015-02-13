/**
 * 请求封装，
 *  对接口进行统一处理
 */
define(function(require){
  
  function Trans(option){
    // 兼容以前的Trans({})写法
    if(!(this instanceof Trans)){
      return new Trans(option);
    }
    var opt = {
      url:"",
      method:"get",
      dataType:"json",
      args:{},
      type:"ajax" // ajax jsonp ijax
    }
    
    this.opt = $.extend(opt,option);
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
      $.extend(_this.opt.args,args);
      
      var ajax = $.ajax({
         url:_this.opt.url,
         type:_this.opt.method,
         dataType:_this.opt.dataType,
         data:_this.opt.args,
         timeout:_this.opt.timeout,
         
      }).success(function(data){
        if(data && "code" in data){
          if(data.code != 1){
            deffer.reject(data);
            return;
          }
          // 未登录
          if(data.code == -1){
            // 未登录
            $.listener && $.listener.trigger("unlogin");
            return;
          }else if(data.data && !$.isArray(data.data)){
            data = data.data
          };
        }
        
        
        deffer.resolve(data);
      }).fail(function(data){
         deffer.reject(data);
      });
      
      return deffer;
    },
    setArgs:function(args){
      $.extend(this.opt.args,args);
    }
  })
  
  return Trans;
})
