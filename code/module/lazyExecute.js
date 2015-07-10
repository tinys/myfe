/**
 * 根据元素位置,如果元素在页面中，则执行。否则则scroll执行
 * 
 * 
 */
define(function(require){
  
  var srollCaller = require("./scrollCaller");
  
  
  // 每次滚动都判断队列的位置
  // TODO 优化，对队列按照位置进行排序，如果当前小于或者超出位置。则不再进行循环判断
  var lazyList = [],scroller;
  // 执行队列
  var win = $(window);
  function execute(st){
    var rs = false,sopt;
    
    var winWidth = win.width(),winHeight = win.height();
    
    for(var i = 0,len = lazyList.length; i < len;i++){
      sopt = lazyList[i];
      
      rs = executeInView(sopt,st,winWidth,winHeight);
      if(rs && !sopt.always){
        if(-- sopt.times <= 0){
          lazyList.splice(i,1);
          len --;
          i--;
        }
      }
    }
  }
  
 
  // 判断是否在视图中，执行则返回true
  function executeInView(opt,st,winWidth,winHeight){
    var el = $(opt.el);
    if(!st){
      st = document.documentElement.scrollTop || document.body.scrollTop;
    }
    if(!winWidth){
      winWidth = win.width();
    }
    if(!winHeight){
      winHeight = win.height();
    }
    
    var pos = el.offset();$
    var top  = pos.top - opt.marginTop,
        bottom = top+ el.height() +opt.marginBottom;
    
    var outerTop = st,
        outerBottom = st+winHeight;
    
    if(bottom < outerTop || top > outerBottom){
      return false;
    }
    opt.callback && opt.callback();
    
    return true; 
  }
  
  
  
  function initScroll(){
    scroller = srollCaller(function(st){
      execute(st);
    });
  }
  
  return function(option){
    var opt = {
      el:"",
      marginTop:0,
      marginBottom:0,
      // 执行多少次 默认执行一次，然后移除队列
      times:1,
      always:false,
      callback:$.noop
    };
    
    $.extend(opt,option);
    if(!opt.el){
      return;
    }
    
    var inView = executeInView(opt);
    if(inView && !opt.always){
      return;
    }
    
    lazyList.push(opt);
    if(!scroller){
      initScroll();
    }
    return {
      destroy:function(){
        var index = lazyList.indexOf(opt);
        if(index >=0){
          lazyList.splice(index,1);
        }
      },
      // 暂停监听
      pause:function(){
        var index = lazyList.indexOf(opt);
        if(index >=0){
          lazyList.splice(index,1);
        }
      },
      resume:function(){
        var index = lazyList.indexOf(opt);
        if(index < 0){
          lazyList.push(opt);
        }
      }
    }
  }
})
