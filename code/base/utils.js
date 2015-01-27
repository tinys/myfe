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
define(function(){})