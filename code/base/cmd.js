/**
 * 链家fe基础类
 * 1.实现amd 模块注册
 * 2.
 */
;(function(win){
  "use strict"
  
  if(win.define){
    return;
  }
  
  var define,require;
  
 
  define = function(){
    
  }
  
  define.amd = {
    version:"1.0.0",
    author:"lianjia.com"
  };
  
  require = function(){
    
  };
  
  require.config = function(){
    
  };
  
  win.define = define;
  win.require = require;
})(typeof window?window:this);