/**
 * 视图
 * 
 * @classdesc 继承EventEmitter。实现试图 数据抓取，渲染模板，事件绑定功能。
 * @example
var myView = new View({
  // container 
  el:"",
  // 模板：可以是selector(#viewTemplate) 可以直接是模板字符串<%%><%%>(EJS写法)
  template:"",
  
  // 数据获取接口
  url:"",
  // 获取数据参数
  args:{},
  // 获取数据方式,默认为get
  method:"get",
  
  // 数据源对象，如果不写，将通过上面的url args创建。view将监听起requeststart ,request fail事件
  model:"" 
})
// 初始化列表
myView.init();
// View 默认事件 重新设置参数
<a class="actSetArgs" actData="p=1&filter=1"></a>
// 刷新
<a class="actRefresh"></a>


// 创建新View 继承View.
var ListView = View.extend({
  // 初始化，尽量不要覆盖
  initialize:function(option){
    // 如果覆盖，请使用 this._super() 来调用父类方法，以初始化父类
    this._super()
  },
  // 事件扩展
  events:{
    "click .actShow":"actShow"
  },
  actShow:function(e){
  }
})
 */
define(function(){
  var Base = require("./EventEmitter"),
      Trans = require("./Trans");
  var AView = require("./AView");
  
  var Model = require("./Model")
  
  var View = AView.extend({
    initialize:function(option){
      var opt = {
        el:"",
        template:"",
        
        url:"",
        args:{},
        method:"get",
        
        model:""
      };
      $.extend(opt,option);
      var _this = this;
      _this._super(option);
      if(!_this.$el){
        return;
      }
      
      if(!opt.model){
        if(opt.url){
          _this.model = new Model(opt);
        }
      }else{
        _this.model = opt.model;
      }
      
      if(_this.model){
        _this.model.on("requeststart",function(){
          _this.showloading();
        })
        _this.model.on("request",function(data){
          _this.render(data);
          
          _this.trigger("request",data);
          _this.trigger("render",data);
        });
        _this.model.on("fail",function(data){
          _this.showfail();
        });
      }
      
      if(opt.template){
        if(typeof opt.template == "string"){
          if(opt.template.indexOf("<%") < 0){
            _this.template = $.template($(opt.template).html());
          }else{
            _this.template = $.template(opt.template);
          }
        }else{
          _this.template = opt.template;
        }
      }
    },
    events:{
      // 重新设置参数
      "click .actSetArgs":"resetArgs",
      // 刷新
      "click .actRefresh":"actRefresh"
    },
    resetArgs:function(e){
      var _this =this;
      var target = $(e.target);
      var args = $.queryToJson(target.attr("actData"));
      _this.model.request(args);
      return false;
    },
    actRefresh:function(){
      this.model.request();
      return false;
    },
    init:function(args){
      this.model.request(args);
    },
    request:function(args){
      this.model.request(args);
    },
    setData:function(data){
      var _this = this;
      _this.render(data);
      _this.trigger("request",data);
    },
    render:function(data){
      var _this = this;
      _this.$el.html(_this.template.render(data));
      
    },
    loadingHTML:'<div class="loading">loading...</div>',
    failHTML:'<div class="fail">请求数据失败,请<a href="javascript:;" class="actRefresh">重试</a></div>',
    showloading:function(){
      var html = typeof this.loadingHTML == "function"?this.loadingHTML():this.loadingHTML;
      this.$el.html(this.loadingHTML)
    },
    showfail:function(){
      var html = typeof this.failHTML == "function"?this.failHTML():this.failHTML;
      this.$el.html(html)
    }
  })
  
  return View;
})
