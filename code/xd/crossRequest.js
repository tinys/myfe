/**
 * 跨域请求
 * 
 */
/*
require("./Messenger");
 */
define(function(require){
  
  
  
  var globalMessanger = new Messenger('LIANJIA_CROSS_MESSAGE', 'LIANJIA-CROSS');
  globalMessanger.listen(function (msg) {
     msg = JSON.parse(msg);
     var name = msg.name;
     if(globalMessanger.targets[name]){
       if(msg.type == "state"){
         globalMessanger.targets[name].readyState = "ready";
         globalMessanger.targets[name].dealReady();
       }else{
         globalMessanger.targets[name].deal(msg.data,msg.success);
       }
     }
  });
  var PageMessage = {};
  
  var Message = function(domain,name){
    var _this = this;
    _this.domain =  domain;
    name = name || $.parseURL(domain).host.replace(/\./g,"-")
    _this.name = name;
    _this.init();
  }
  
  $.extend(Message.prototype,{
    init:function(){
      var _this = this;
      var iframeUrl = _this.domain+"/xd/api/?name="+_this.name;
      
      var iframe = $('<iframe id="'+_this.name+'" tabindex="-1" src="'+iframeUrl+'" style="display:none" width=0 height=0 title="empty" />');
      iframe.appendTo(document.body);
      _this.iframe = iframe.get(0).contentWindow;
      globalMessanger.addTarget(_this.iframe, _this.name);
      
      _this.reqArray = [];
      
      globalMessanger.targets[_this.name].deal = function(msg,success){
        globalMessanger.targets[_this.name].isRequest = false;
        
        var request = _this.reqArray.shift(),msgData = false;
        try{
          msgData = msg;
        }catch(e){
        }
        success?request.defer.resolve(msgData):request.defer.reject(msgData);
        _this.next();
      };
      globalMessanger.targets[_this.name].dealReady = function(){
        _this.next();
      };
    },
    next:function(){
      var _this = this;
      if(!globalMessanger.targets[_this.name].readyState){
        return;
      }
      if(_this.reqArray.length && !globalMessanger.targets[_this.name].isRequest){
        globalMessanger.targets[_this.name].isRequest = true;
        var request = _this.reqArray[0];
        var cmd = {
          type:"request",
          data:request.request
        } 
        var str = JSON.stringify(cmd);
        globalMessanger.targets[_this.name].send(str);
      }
    },
    request:function(args){
      var _this = this;
      
      var defer = $.Deferred();
      _this.reqArray.push({
        defer:defer,
        request:args
      })
      _this.next();
      return defer;
    }
  })
  
  return function(domain,name){
    if(PageMessage[domain]){
      return PageMessage[domain];
    }
    return PageMessage[domain] = new Message(domain,name);
  };
})
