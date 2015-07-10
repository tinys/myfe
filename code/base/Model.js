/**
 * 数据模型
 *  提供数据封装，装载数据、保存数据。
 * 
 * 初始化参照 Trans.
 * 
 * @example
var model = new Model({
  url:"",
  type:"get",
  // json  jsonp html
  dataType:"json",
  data:{}
});

// 事件
requeststart 开始发送请求
request 数据请求成功
fail    数据请求失败

// 拉去数据
model.fetch(args);
或者
model.request(args);

// 设置数据
model.setData(data);

// 更新数据，这个在mvvm框架中实现 view model 自己联动
model.update(index,data);

// 获得当前请求参数 对这个参数进行修改实际相当于 setArgs了
model.getArgs();
 */
define(function(require){
  var Base = require("./EventEmitter"),
      Trans = require("./Trans");
      
  var Model = Base.extend({
    initialize:function(option){
      var opt = {
        url:"",
        type:"get",
        // json  jsonp html
        dataType:"json",
        data:{}
      };
      $.extend(opt,option);
      
      var _this = this;
      
      _this.opt = opt;
      _this.opt.url && (_this.trans = new Trans(opt));
    },
    fetch:function(args){
      this.request.apply(this,arguments);
    },
    _triggerSuccess_:function(data){
      var _this = this;
      data = _this.parse?_this.parse(data):data;
      _this.data = data;
      _this.trigger("request",data);  
    },
    // 对请求来的数据或者装载的数据进行解析，让他符合规范
    parse:function(data){
      return data;
    },
    // 填充数据
    setData:function(data){
      this._triggerSuccess_(data);
    },
    update:function(index){
      this.trigger("update",index,this.data);
    },
    clearArgs:function(resetArgs){
      this.trans.clearArgs(resetArgs);
    },
    resetUrl:function(url){
      this.trans.resetUrl(url);
    },
    request:function(args,resetArgs){
      var _this = this;
      _this.trigger("requeststart");
      
      function success(data){
       _this._triggerSuccess_(data,_this.getArgs());
      }
      
      function fail(data){
        _this.trigger("fail",data);
      }
      
      // 不需要的参数,避免参数叠加
      if(resetArgs){
        _this.trans.clearArgs(resetArgs);
      }
      
      return _this.trans.request(args).done(function(data){
        success(data);
      }).fail(function(data){
        fail(data);
      })
    },
    // // 取消请求
    // cancel:function(){
//       
    // },
    getArgs:function(){
       return this.trans ? this.trans.opt.data:{};
    },
    destroy:function(){
      var _this = this;
      _this.opt = null;
      _this.data = null;
      _this.trans = null;
      
      _this._super();
    }
  });
  
  return Model;
})
