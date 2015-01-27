/**
 * 试图。
 *  基础事件绑定
 * 
 *  
 */
define(function(require){
  
  var Base = require("./EventEmitter");
  var AbstractView = Base.extend({
    initialize:function(option){
      var opt = {
        el:""
      };
      $.extend(opt,option);
      var _this = this;
      var dom = $(opt.el);
      
      if(!dom.length){
        console && console.error("need a real dom");
        return;
      }
      _this.opt = opt;
      _this.$el = dom;
      // 事件绑定
      // delegate events
      function addDelegate(events){
        for(var i in events){
          var evt = events[i],
              nameType = i.split(" ");
          dom.delegate(nameType[1],nameType[0],$.proxy(_this[evt],_this));
        }
      }
      addDelegate(_this.events);
    },
    events:{
    },
    destrory:function(){
      var _this = this;
      _this._super();
      _this.$el.undelegate();
      _this.opt = null;
      _this.$el = null;
    }
  })
  
  return AbstractView;
})