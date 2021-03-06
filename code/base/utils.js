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
$.noneHTML = function(str){
  return $("<div></div>").html(str).text();
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
  if(d)
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
  if($.bLength(str) < length){
    return str;
  }
  suffix = suffix || "..";
  length = length - suffix.length;
  
  var totalLength = str.length,count;
  var realLength = 0;
  for (var i = 0; i < totalLength; i++) {
    var code = str.charCodeAt(i);
    if (code >= 0 && code <= 128) {
      realLength += 1;
    } else {
      realLength += 2;
    }
    if(realLength >=length){
      break;
    }
  }

  return str.substring(0,i)+suffix;
}
$.bLength = function(str){
  if (str == null) return 0;
  if (typeof str != "string"){
    str += "";
  }
  return str.replace(/[^x00-xff]/g,"01").length;
}

$.betweenTime = function(myTime,serverTime){
  var before = $.buildDate(myTime),
      serverTime =  $.buildDate(serverTime);
  if(!serverTime || !before){
    return "";
  }
  var distance = serverTime.getTime() - before.getTime();
  if(distance <0){
    return "将来"
  }
  distance = distance/1000;
  if(distance < 60){
    return "刚刚"
  }
  // 小于 一个小时，提示分钟 
  if(distance < 3600){
    return Math.floor(distance/60)+"分钟之前"
  }
  // 小于24小时，提示小时
  if(distance < 86400){
    return Math.floor(distance/3600)+"小时之前"
  }
  // 小于一个月，显示天
  if(distance < 2592000){
    return Math.floor(distance/86400)+"天前"
  }
  //大于一天，显示时间显示几天前
  return $.formatDate(before,"yyyy-MM-dd");
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
$.TextAreaUtil = (function(win){
  var ds = document.selection;
  var util = {
    getCursorPosition : function(element) {
      var result = 0;
      
      //处理兼容
      if (ds) {
        //ie
        element.focus();
        try{
           var range = null;
          range = ds.createRange();
          var g = range.duplicate();
          g.moveToElementText(element);
          g.setEndPoint("EndToEnd", range);
          
          element.selectionStartIE = g.text.length - range.text.length;
          element.selectionEndIE = element.selectionEndIE + range.text.length;
          result = element.selectionStartIE;
        }catch(e){
          result = element.value.length;
        }
      } else {
        //ff-chrome-opera
        //加层判断
        if (element.selectionStart || element.selectionStart == "0") {
          //ff和opera多是element.value.length
          //chrome
          result = element.selectionStart;
        }
      }
      return result;
    },
    getSelectedText : function(element) {
      var result = "";
      var find = function(el) {
        if (el.selectionStart != undefined && el.selectionEnd != undefined) {
          return el.value.slice(el.selectionStart, el.selectionEnd);
        } else {
          return "";
        }
      }
      if (win.getSelection) {
        //ff-chrome-opera
        result = find(element);
      } else {
        //ie
        result = document.selection.createRange().text;
      }
      return result;
    }
  }
  return util;
})(window);