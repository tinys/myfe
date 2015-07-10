/**
 * 基础浮层
 * 
 */
define(function(){
  var win = $(window);
  
  var Shadow = {
    _shadowLayer:false,
    
    _init:function(){
      var _this = this;
      
      if(!_this._shadowLayer){
        _this._shadowLayer = $("<div style='position:absolute;position:fixed;left:0px;top:0px;width:100%;height:100%;z-index:99991;background-color:#000;'></div>");
        $(document.body).append(_this._shadowLayer);
      }
      
      return _this._shadowLayer;
    },
    show:function(opacity){
      var _this = this;
      if(!_this._shadowLayer){
        _this._init();
      }
      _this._shadowLayer.css("opacity",opacity);
      _this._shadowLayer.show();
      return _this._shadowLayer.css("z-index");
    },
    hide:function(){
      var _this = this;
      if(_this._shadowLayer){
        _this._shadowLayer.hide();
      }
    }
  };
  
  return function(option){
    var opt = {
      html:"",
      style:{
        position:"absolute",
        // 大小默认100%
        // width:"auto",
        // height:"auto",
        
        // 位置，默认居中
        top:"center",
        left:"center"
      },
      // 默认样式明为空
      className:"",
      shadow:.8,
      // esc 关闭
      esc:false ,// close,destroy
      body:false // close destroy
    };
    
    $.extend(opt,option);
    
    var _this = {
      _div:false
      
    }
    var that = new $.EventEmitter();   
    
    function initDiv(){
      if(!_this._div){
        _this._div = $('<div style="display:none"></div>');
        _this._div.css(opt.style);
        
        $(document.body).append(_this._div);
        _this._div.html(opt.html);
        _this._div.addClass(opt.className);
        that.trigger("domReady");
      }
      return _this._div;
    }
    
    function init(){
      // init div
      initDiv();
       
      
      function doEsc(e){
        if(e.keyCode == 27){
          var rs = that.onEsc();
          if(!rs){
            return
          }
          
          if(opt.esc == "close"){
            that.hide();
          }else if(opt.esc == "destroy"){
            that.destroy();
          }
        }
      }
      
      function listenEsc(flag){
        if(flag){
          win.on("keyup",doEsc)
        }else{
          win.off("keyup",doEsc)
        }
      }
      function doBodyClick(){
        if(opt.body == "close"){
          that.hide();
        }else if(opt.body == "destroy"){
          that.destroy();
        }
      }
      function listenBody(flag){
        if(flag){
          $("html,body").on("click",doBodyClick);
        }else{
          $("html,body").off("click",doBodyClick);
        }
      }
      // init event
      if(opt.esc){
        listenEsc(true)
        that.on("destroy",function(){
          listenEsc(false)
        })
      }
      if(opt.body){
        _this._div.on("click",function(e){
          e.stopPropagation()
        })
        listenBody(true)
        
        that.on("destroy",function(){
          listenBody(false)
        })
      }
    }
    
    that.init = init;
    
    that.show = function(position,ani){
      if(!_this._div){
        init();
      }
      var zIndex = 100001;
      if(opt.shadow != 0 && opt.shadow !== false){
        zIndex = Shadow.show(opt.shadow)-0+1;
      }
      var styles = {
        left:"0px",
        top:"0px"
      };
      _this._div.css("z-index",zIndex);
      
      if(position){
        // cal position
        if(position.left){
          // left 
          styles.left = position.left;
        }
        // right
        if(position.top){
          // left 
          styles.top = position.top;
        }
        if(styles.left == "center"){
          styles.left = (win.width()-_this._div.outerWidth())/2+"px";
        }
        if(styles.top == "center"){
          var st = _this._div.css("position")=="fixed"?0:win.scrollTop();
          
          styles.top = Math.max(st+(win.height()-_this._div.height())/2,0)+"px";
        }
        _this._div.css(styles);
      }
      
      _this._div.show();
      that.trigger("show");
    };
    
    that.hide = function(){
      if(opt.shadow != 0 && opt.shadow !== false){
        Shadow.hide();
      }
      _this._div.hide();
      that.trigger("hide")
    };
    
    that.getDOM = function(){
      if(!_this._div){
        init();
      }
      return _this._div;
    };
    
    that.setHTML = function(html){
      if(!_this._div){
        init();
      }
      _this._div.html(html);
      that.trigger("setHTML")
    };
    
    that.isShow = function(){
      if(!_this._div){
        return false;
      }
      return _this._div.css("display") == "block";
    };
    that.onEsc = function(){
      return true;
    }
    that.destroy = function(){
      that.trigger("destroy");
      if(opt.shadow != 0 && opt.shadow !== false){
        Shadow.hide();
      }
      _this._div.undelegate();
      if(_this._div){
        _this._div.remove();
      }
    };
    
    return that;
  }
})
