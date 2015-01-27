/**
 * 事件触发器,事件超类
 * 
 * @module base/EventEmitter
 * @see base/EventEmitter
 * @classdesc 之所以不用jquery的对象事件，是因为jquery对象不单纯.另外无法使用单纯的事件和实现对象继承.
 * 
 * @example
 * // 返回一个对象
 * var obj = new EventEmitter();
 * // 添加一个事件
 * obj.on("show",function(param1){
 *   console.log(param1)
 * })
 * // 触发一个事件,将console.log({a:1})
 * obj.trigger("show",{a:1});
 * 
 * // 添加一次事件，以后trigger将不会触发
 * obj.once("show",function(){})
 * 
 * // 移除事件 只写名称，则将会移除所有该类事件。如果说明参数都不填写，则移除所有事件.
 * obj.off("show")
 * 
 * // 销毁对象，解除所有事件绑定
 * obj.destroy();
 * 
 * // 返回一个新的对象，继承 EventEmitter,参数必须为对象。该对象作为BaseModel的原型链上的参数
 * var BaseModel = EventEmitter.extend({
 *  // 保留对象，尽量不要覆盖此对象
 *  //_initialize_:function(){}
 *  // 当外部调用 new BaseModel时候调用。 
 *  initialize:function(){
 *   // 初始化父类
 *    this._super(); 
 *  }
 * });
 */
define(function(){
  'use strict' 
  
  if (typeof Object.create != 'function') {
    Object.create = (function() {
      var Object = function() {};
      return function (prototype) {
        if (arguments.length > 1) {
          throw Error('Second argument not supported');
        }
        if (typeof prototype != 'object') {
          throw TypeError('Argument must be an object');
        }
        Object.prototype = prototype;
        var result = new Object();
        Object.prototype = null;
        return result;
      };
    })();
  }
  if (!Object.keys) {
    Object.keys = (function() {
      'use strict';
      var hasOwnProperty = Object.prototype.hasOwnProperty,
          hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
          dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
          ],
          dontEnumsLength = dontEnums.length;
  
      return function(obj) {
        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
          throw new TypeError('Object.keys called on non-object');
        }
  
        var result = [], prop, i;
  
        for (prop in obj) {
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }
  
        if (hasDontEnumBug) {
          for (i = 0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
              result.push(dontEnums[i]);
            }
          }
        }
        return result;
      };
    }());
  }
  
  function Base(){
  }
  
  // 继承 EventEmitter
  Base.extend = function(props){
    var _super = this;
    
    var _superPropotype = _super.prototype;
    
    function Clas(){
      // 严格模式下 this不能指向window，如果直接调用，this为 undefined
      this && _super(this,arguments);
      this && this._initialize_ && this._initialize_.apply(this,arguments);
    };
    
    var prototype = Clas.prototype = Object.create(_superPropotype);
    
    for(var i in props){
      if(i === "constructor"){
        return;
      }
      var prop = props[i];
      if(typeof prop === "function" && _superPropotype[i] && typeof _superPropotype[i] === "function"){
        prop = (function(name,fn){
          return function(){
            var tmp = this._super;
            this._super = _superPropotype[name];
            var ret = fn.apply(this,arguments);
            this._super = tmp;
            return ret;
          }
        })(i,prop);
      }else if(typeof prop === "object" &&  _superPropotype[i] && typeof _superPropotype[i] === "object"){
        // object 继承 TODO 没有支持更深层次的嵌套
        for(var j in _superPropotype[i]){
          if(!prop[j]){
            prop[j] = _superPropotype[i][j];
          }
        }
      }
      prototype[i] = prop;
    }
    Clas.extend = Base.extend;
    
    return Clas;
  }
  /**
   * 事件触发，作为一个事件基类，所有对象，有本身事件需要触发的皆可以使用本对象 
   * @exports EventEmitter;
   * @constructor
   * 
   */
  var EventEmitter = Base.extend({
    _initialize_:function(){
      var _this = this;
      _this._eventList = {};
      
      this.initialize && this.initialize.apply(this,arguments);
    },
    on:function(type,fn){
      if(!type || !fn){
        throw "type of fn is required";
      }
      var _this = this;
      var list = _this._eventList[type];
      if(!list){
        list = [];
        _this._eventList[type] = list;
      }
      list.push(fn);
    },
    off:function(type,fn){
      var _this = this;
      if(!type){
        _this._eventList = {};
        return;
      }
      var list =  _this._eventList[type];
      if(list && list.length){
        if(!fn){
          while(list.pop()){}
          return;
        }
        for(var i = 0,len = list.length; i < len; i++){
          if(list[i] == fn || list[i] == fn.fn){
            (function(i){
              setTimeout(function(){
                list.splice(i,1)
              },1)
            })(i);
            return;
          }
        }
      }
    },
    trigger:function(type){
      if(!type){
        return;
      }
      var _this = this;
      var args = Array.prototype.slice.call(arguments,1);
      
      var list = _this._eventList[type];
      if(list && list.length){
        for(var i = 0 ; i < list.length;i++){
          if(list[i].apply(_this,args) === false){
            return false;
          }
        }
      }
    },
    once:function(type,fn){
      var _this = this;
      if(!type || !fn){
        return;
      }
      var delefn = function(){
        fn.apply(_this,arguments);
        _this.off(type,delefn)
      }
      delefn.fn = fn;
      _this.on(type,delefn);
    },
    destroy:function(){
      var _this =this;
      _this._eventList = null;
    }
  })
  
  return EventEmitter;
})
