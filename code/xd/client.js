/**
 * 跨域网站js。
 * 页面要最小化请求。一个请求搞定吧。
 * @param {Object} a
 */
// 占位符。
/*
require("./Messenger");
*/
window.$ = window.$ || {};

$.parseURL = function(a){
  if(!a){
    return null;
  }
  var b = /^(?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/, 
    c = ["url", "scheme", "slash", "host", "port", "path", "query", "hash"], 
    d = b.exec(a), e = {};
  for (var f = 0, g = c.length; f < g; f += 1)
      e[c[f]] = d[f] || "";
  return e;
};
$.queryToJson = function(str,encode){
  if(!str){
    return{};
  }
  var param = str.split("&"),obj = {};
  for(var i = 0 , len = param.length;i< len;i++){
    var item = param[i].split("=");
    if(item[0]){
      obj[item[0]] = item[1]?(encode?decodeURIComponent(item[1]):item[1]):""
    }
  }
  return obj;
}
$.jsonToQuery = function(obj,encode){
  var rs = [];
  if(obj){
    for(var i in obj){
      rs.push(i+"="+((encode?encodeURIComponent(obj[i]):obj[i])))
    }
  }
  return rs.join("&");
}
$.joinUrl = function(url,param){
  if(!url){
    url = location.href;
  }

  var args = [];
  for(var i in param){
    if(!i){
      continue;
    }
    args.push(i+"="+encodeURIComponent(param[i]));
  }

  if(url.indexOf("?")<0){
    url +="?"
  }

  return url + (url.indexOf("&")>=0?(url+"&"+args.join("&")):args.join("&"));
}

$.ajax = (function(){
  function getXHR(){
    if(window.XMLHttpRequest){
      return new  window.XMLHttpRequest();
    }else{
      try {
        return new window.ActiveXObject( "Microsoft.XMLHTTP" );
      } catch( e ) {
        try{
          return new ActiveXObject("Msxml2.XMLHTTP");
        }catch(e2){
          
        }
      }
    }
  }
  return function(option){
    var opt = {
      url:"",
      type:"get",
      dataType:"json",
      data:{},
      header:{},
      async:true
    };
    
    for(var i in option){
      opt[i] = option[i];
    }
    
    var cbList = {
      // 0 未请求 1.success -1:fail
      state:0,
      data:null,
      success:[],
      header:{},
      fail:[]
    };
    
    function success(){
      var fun = null;
      while(fun = cbList.success.shift()){
        fun.call(null,cbList.data)
      }
    }
    
    function fail(){
      var fun = null;
      while(fun = cbList.fail.shift()){
        fun.call(null,cbList.data)
      }
    }
    function callback(){
      if(xhr.readyState === 4){
        xhr.onreadystatechange = function(){};
        cbList.data = xhr.responseText;
        if(xhr.status == 200){
          try{
            if(opt.dataType == "json"){
              cbList.data = JSON.parse(cbList.data);
            }
            success();
          }catch(e){
            fail();
          }
        }else{
          fail();
        }
      }
    }
    
    var that = {};
    var xhr = getXHR();
    
    if(!xhr){
      return false;
    }
    opt.header["Content-Type"] || (opt.header["Content-Type"] = "application/x-www-form-urlencoded");
    opt.header["X-Requested-With"] || (opt.header["X-Requested-With"] = "XMLHttpRequest");
    
    opt.type = opt.type.toLowerCase();
    if(opt.type == "get"){
      opt.url = $.joinUrl(opt.url,opt.data);
    }
    
    xhr.open(opt.type,opt.url,opt.async,null,null);
    xhr.onreadystatechange = callback;
    
    try {
        for (var k in opt.header)
            xhr.setRequestHeader(k, opt.header[k])
    } catch (exp) {
    }
    
    xhr.send(opt.type == "get"?"":$.jsonToQuery(opt.data,true))
    
    that.success = function(cb){
      if(cbList.state === 0){
        cbList.success.push(cb);
      }else if(cbList.state === 1){
        cb.call(null,cbList.data)
      }
      return that;
    };
    that.fail = function(cb){
      if(cbList.state === 0){
        cbList.fail.push(cb);
      }else if(cbList.state === -1){
        cb.call(null,cbList.data)
      }
      return that;
    }
    
    return that;
  }
})();
(function(){
  var name = $.queryToJson($.parseURL(location.href).query).name;
  
  var messenger = new Messenger(name, 'LIANJIA-CROSS');
  
  messenger.listen(function (msg) {
      var msg = JSON.parse(msg);
      if(msg.type == "request"){
        $.ajax(msg.data).success(function(data){
          messenger.send(JSON.stringify({
            type:"data",
            name:name,
            success:true,
            data:data
          }));
        }).fail(function(data){
          messenger.send(JSON.stringify({
            type:"data",
            name:name,
            success:false,
            data:data
          }));
        })
      }
  });
  messenger.addTarget(window.parent, 'LIANJIA_CROSS_MESSAGE');
  messenger.send(JSON.stringify({
    type:"state",
    name:name,
    data:"ready"
  }));
})();
