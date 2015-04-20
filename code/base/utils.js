$.encodeHTML = function (source) {
    if(!source){
      return source;
    }
    return String(source)
                .replace(/&/g,'&amp;')
                .replace(/</g,'&lt;')
                .replace(/>/g,'&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
};
$.decodeHTML = function(str){
  if(!str){
    return str;
  }
  return str.replace(/\n/g,"<br/>")
}
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
$.joinUrl = function(url,param,noHash){
  if(!url){
    url = location.href;
  }
  if(!param){
    return url;
  }
  var Url = $.parseURL(url);
  
  var args = [];
  for(var i in param){
    if(!i){
      continue;
    }
    args.push(i+"="+encodeURIComponent(param[i]));
  }
  var query = Url.query?(Url.query+"&"+args.join("&")):args.join("&");
  if(query){
    query = "?"+query;
  }
  var path = Url.path;
  if(path){
    path = "/"+path;
  }
  var hash = noHash?"":(Url.hash?("#"+ Url.hash):"");
  return Url.origin+path+query+hash;
}
$.parseURL = function(a){
  if(!a){
    return null;
  }
  var b = /^((?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?)(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/, 
    c = ["url","origin", "scheme", "slash", "host", "port", "path", "query", "hash"], 
    d = b.exec(a), e = {};
  for (var f = 0, g = c.length; f < g; f += 1)
      e[c[f]] = d[f] || "";
  return e;
}
$.getURL = function(url){
  url = url || location.href;
  // 去掉hash
  return url.replace(/#.*/, '');
}
$.buildDate = function(date){
  if(typeof date == "string"){
    date = date.replace(/-/g,"/");
    if(date.indexOf("/") >=0){
      date = new Date(date);
    }else{
      if(!isNaN(parseInt(date))){
        date = new Date(parseInt(date));
      }
    }
  }else if(typeof date == "number"){
    // 给的是秒
    if((date+"").length <=10 ){
      date = date * 1000;
    }
    date = new Date(date);
  }else if(!(date instanceof Date)){
    return false;
  }
  return date
}
$.formatDate = function(dd,fmt){
  var date = $.buildDate(dd);
  if(!date){
    return dd;
  }
  var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))  {
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  } 
  
  for(var k in o){
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
    }
  }
  return fmt;   
}
$.getLimitString = function(str,length,suffix){
  if(!str){
    return str;
  }
  suffix = suffix || "..";
  if(str.length >length){
    str = str.substring(0,length)+suffix;
  }
  return str;
}
$.merge = function(opt,option){
  if(!opt || !option){
    return;
  }
  for(var i in opt){
    if(option[i] != undefined){
      opt[i] = option[i];
    }
  }
}
$.LS = (function(){
  var that = {};
  var LS = window.localStorage,
      SS = window.sessionStorage;
  that.save = function(key,val,session){
    if(typeof val == "object"){
      val = JSON.stringify(val);
    }
    try{
      if(session){
        SS.setItem(key,val);
      }else{
        LS.setItem(key,val);
      }
    }catch(e){
      return false;
    }
    return true;
  }
  that.get = function(key,session,isRemove){
    var val = null;
    try{
      if(session){
        val = SS.getItem(key);
        isRemove && SS.removeItem(key);
      }else{
        val = LS.getItem(key);
        isRemove && LS.removeItem(key);
      }
    }catch(e){
    }
    return val;
  }
  that.shift = that.pop = function(key,session){
    return that.get(key,session,true);
  }
  return that;
})();
// fixed zepto has not noop;
$.noop = function(){};
