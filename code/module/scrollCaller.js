/**
 * 监听win事件滚动，降隔100ms执行，做到scroll事件稀释
 * 
 * 
 * @example
 * var scrollCaller = require("scrollCaller");
 * 
 * var caller = scrollCaller(function(top){
 *   
 * });
 * caller.destroy();
 * 
 */
define(function(require){
  var timer = false,
      win = $(window);
  
  var callbacks = [];
  
  function calllbackCaller(){
    var st = win.scrollTop();
    for(var len = callbacks.length-1;len>=0;len--){
      try{
        callbacks[len].call(win,st);
      }catch(e){
        console.error && console.error(e.stack);
      }
    }
  }
  
  function winListener(){
    if(timer){
      clearTimeout(timer);
    }
    timer = setTimeout(function(){
      calllbackCaller();
    },30)
  }
  
  function eventListener(add){
    if(add){
      win.scroll(winListener)
    }else{
      win.unbind("scroll",winListener)
    }
  }
  function addCall(fun){
    if(!callbacks.length){
      eventListener(true);
    }
    callbacks.push(fun);
  };
  
  function removeCall(fun){
    var index = $.inArray(fun,callbacks);
    if(index >=0){
      callbacks.splice(index,1);
    }
    if(!callbacks.length){
      eventListener(false);
    }
  }
  
  return function(fun){
    if(!fun){
      throw "fun is required";
    }
    addCall(fun);
    
    return {
      destroy:function(){
        removeCall(fun);
      }
    }
    
  }
})
