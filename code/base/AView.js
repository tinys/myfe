/**
 * 抽象View（视图）。提供基础行为、事件绑定。
 *  传入一个节点，提供基础行为绑定。
 * 
 * @super EventEmitter
 * @example
 * 
var view = new AView({
  el:""
});
// 继承AView
var View = AView.extend({
  events:{
    "click .actSetArgs":"actSetArgs"
  },
  actSetArgs:function(e){
    var target = $(e.currentTarget);
    alert($.queryToJson(target.attr("actData")).a);
    return false;
  }
})

<div id="view"><a class="actSetArgs" actData="a=1">test</a></div>
var myView = new View({
  el:"#view"
})

// 销毁视图，取消事件绑定。如果有自己行为，需要覆盖
myView.destroy();
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