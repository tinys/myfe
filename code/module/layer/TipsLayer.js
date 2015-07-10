/**
 * 类似tips样式的浮层。
 * 随着目标展示
 * 
 * 子类的使用场景：
 *  给子类一个el
 *    代理查看
 *      点击后，show(button,data)
 */
define(function(require){
  var BaseLayer = require("./BaseLayer")
  
  return function(option){
    var opt = {
      // top left right bottom 显示在那里？
      show:"top",
      offsetTop:0,
      offsetLeft:0,
      layer:{
        className:""
      }
    };
    
    $.extend(opt,option);
    
    var layerOption = {
      body:"close",
      className:opt.layer.className,
      html:""
    }
    var that = BaseLayer(layerOption);
    
    var show = that.show;
    
    that.show = function(element){
      var dom = that.getDOM();
      
      var offset = element.offset();
      var top = offset.top, 
          left = offset.left;
      
      dom.css({
        "display":"block",
        "opacity":"0"
      })
      var width = dom.outerWidth(),height = dom.outerHeight();
      
      // 判断位置
      var showLeft = left,
          showTop = top;
      
      if(opt.show == "top"){
        showTop = top - height - opt.offsetTop;
        // 太靠上了。往下面吧
        if(showTop <0){
          showTop = top + element.height()+opt.offsetTop;
        }
        dom.find(".slide_icon").css({
          "left":element.outerWidth()/2+"px"
        })
        showLeft = left - opt.offsetLeft;
      }
      dom.css({
        "opacity":"1",
        "left":showLeft+"px",
        "top":showTop+"px"
      })
      
      that.trigger("show");
    };
    
    return that;
  }
})
