/**
 * 下载图片
 * 
 * 
 */
define(function(require){
  
  var readyRg = /complete|loaded|interactive/;
  
  var ImgLoader = (function(){
    var loader = new $.EventEmitter();
    var MAXLOAD = 4,
        MAXRETRY = 2;
    
    var loadQueue = [],currentLoad = 0;
    
    // 消费队列 消费把控
    function processQueue(){
      if(currentLoad >= MAXLOAD){
        return;
      }
      process();
    }
    // 处理者
    function process(){
      if(!loadQueue.length){
        return;
      }
      currentLoad++;
      var obj = loadQueue.shift();
      var loadStartDate = Date.now();
      
      var img = new Image();
      
      function success(){
        currentLoad--;
        obj.success && obj.success(img);
        loader.trigger("load",{
          img:img,
          time:Date.now()-loadStartDate
        });
        processQueue();
      }
      function fail(){
        currentLoad--;
        if(obj.retryTimes >= MAXRETRY){
          obj.fail && obj.fail();
          loader.trigger("fail",{
            src:obj.src
          });
        }else{
          obj.retryTimes++;
          loadQueue.unshift(obj);
        }
        processQueue();
      }
      
      img.onload = success;
      img.onerror = fail;
      img.src = obj.src;
      
      if(/complete|loaded|interactive/.test(img.readyState)){
        success();
      }
      processQueue();
    }
    
    loader.load = function(option){
      var opt = {
        src:"",
        success:$.noop,
        retryTimes:0,
        fail:$.noop
      }
      $.extend(opt,option);
      
      loadQueue.push(opt);
      processQueue();
    }
    
    return loader;
  })();
  
  var lazyExecute = require("./lazyExecute")
  
  
  function addListener(img,failImg){
    img = $(img);
    var isListen = img.data("listen");
    if(isListen){
      return;
    }
    img.data("listen",1);
    
    var src = img.attr("origin-src");
    failImg = failImg || img.attr("src");
    
    lazyExecute({
     el:img,
     marginTop:10,
     callback:function(){
       ImgLoader.load({
          src:img.attr("origin-src"),
          img:img,
          success:function(){
            img.attr("src",src);
          },
          fail:function(){
            // 不替换
            img.attr("src",failImg);
          }
       })
     }
   })
  }
  ImgLoader.lazyLoad = function(container){
    var images = $(container).find(".lazyload");
    images.each(function(){
       var img = this;
       addListener(img);
    })
  }
  return ImgLoader;
})
