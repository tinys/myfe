$.stringFormat = function (source, opts) {
    source = String(source);
    var data = Array.prototype.slice.call(arguments, 1);
    var toString = Object.prototype.toString;

    if ( data.length ) {
        data = data.length == 1 ? 

            /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
            (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) 
            : data;
        return source.replace(/#\{(.+?)\}/g, function (match, key){
            var replacer = data[key];

            // chrome 下 typeof /a/ == 'function'
            if('[object Function]' == toString.call(replacer)){
                replacer = replacer(key);
            }
            return ('undefined' == typeof replacer ? '' : replacer);
        });
    }
    return source;
};

$.replaceTpl = function (tpl, data, label) {
    var t = String(tpl),
        s = label || /#\{([^}]*)\}/mg,
        trim = String.trim ||
            function (str) {
                return str.replace(/^\s+|\s+$/g, '')
            };
    return t.replace(s, function (value, name) {
        //从模板获取name,容错处理
        return value = data[trim(name)];
    });
};

$.strHTML = function (source, opts) {
    source = String(source);
    var data = Array.prototype.slice.call(arguments, 1);
    var toString = Object.prototype.toString;

    if ( data.length ) {
        data = data.length == 1 ? 

            /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
            (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) 
            : data;
        return source.replace(/#\{(.+?)\}/g, function (match, key){
            var replacer = data[key];

            // chrome 下 typeof /a/ == 'function'
            if('[object Function]' == toString.call(replacer)){
                replacer = replacer(key);
            }
            return ('undefined' == typeof replacer ? '' : $.encodeHTML(replacer));
        });
    }
    return source;
};

$.showIframeImg = function (parent, url) {
    var stylesTpl = '' 
        + '<style>' 
        + 'body{margin:0;padding:0}img{width:#{0}px;height:#{1}px;}'
        + '</style>';
    
    var item = $(parent);
    var height = item.height();
    var width = item.width();
    var styles = $.stringFormat(stylesTpl, width, height);

    var frameid = 'frameimg' + Math.round(Math.random() * 1000000000); 
    window.betafang[frameid] = ''
        + '<head>' + styles + '</head>'
        + '<body><img id="img-' + frameid + '" src=\'' + url + '\' />' 
        + '</body>'; 
    parent.append(''
        + '<iframe style="display:none" id="' + frameid + '" src="javascript:parent.betafang[\'' + frameid + '\'];"' 
        + ' frameBorder="0" scrolling="no" width="' + width + '" height="' + height + '"></iframe>'
    );
    
};

/**
 * 异步加载script jquery是采用jsonp方式，不采用
 * 
 */
$.loadScript = function(option){
  var opt = {
    url:"",
    charset:"utf-8",
    complete:$.noop,
    fail:$.noop
  }
  $.extend(opt,option);
  
  if(!opt.url){
    throw "url is requireed"
  }
  var isloaded = false;
  var script = document.createElement("script"),
      head = document.getElementsByTagName("head")[0],
      result = $.Deferred();
  
  function success(){
    if(isloaded){
      return false;
    }
    isloaded = true;
    script.onload = null;
    script.onerror = null;
    
    opt.complete && opt.complete();
    result.resolve();
    head.removeChild(script);
  }
  function fail(){
    if(isloaded){
      return false;
    }
    isloaded = true;
    
    opt.fail && opt.fail();
    head.removeChild(script);
    result.reject();
  }
  script.onload = success;
  script.onerror = fail;
  script.onreadystatechange = function(state){
    if(script.readyState == "complete"){
      success();
    }
  }
  
  
  script.type="text/javascript";
  script.src = opt.url;
  script.charset=opt.charset;
  
  head.appendChild(script);
  
  return result;
}

$.TextAreaUtil = (function(win){
  var util = {
    getCursorPosition : function(element) {
      var result = element.value.length;
      //处理兼容
      if (document.selection) {
        //ie
        element.focus();
        var ds = document.selection
        var range = ds.createRange();
        var g = range.duplicate();
        g.moveToElementText(element);
        g.setEndPoint("EndToEnd", range);
        element.selectionStart = g.text.length - range.text.length;
        element.selectionEnd = element.selectionStart + range.text.length;
        result = element.selectionStart;
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

/**
 * IE浏览器判断函数
 */
$.browser = $.browser || {};
$.browser.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) 
    ? (document.documentMode || + RegExp['\x241']) 
    : undefined;
define(function(){
  require("../base/utils");
})
