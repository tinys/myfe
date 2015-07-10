/**
 * 路由分发
 */
define(function(require){
  
  var hashListener = require("./hashListener");
  
  var Router = $.EventEmitter.extend({
    initialize:function(opt){
      var _this = this;
      
      _this.opt = opt;
      function renderHash(hash){
        var key = _this.routes[hash];
        
        if(key && _this[key] && $.isFunction(_this[key])){
          _this[key].call(_this,hash);
        }
        
      }
      
      hashListener.on("change",function(hash){
        
        renderHash(hash);
      });
      
      var hash = hashListener.getHash();
      if(!hash || !_this.routes[hash]){
        _this.index("");
      }else{
        renderHash(hash);
      }
    },
    routes:{
    },
    index:function(hash){
    }
  });
  
  return Router;
})

