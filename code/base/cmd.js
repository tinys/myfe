/**
 * cmd规范注册
 * 1.模块注册
 * 2.模块配置
 * 3.透露模块信息，进行缓存
 * 
 */
;(function(win){
  "use strict"
  
  if(win.define){
    return;
  }
  
  var define,require;
  
  var _cache_ = {
  },
  _execute_ = {};
  /*
   * define(name,deps,body)
   */
  define = function(){
    var name,deps,body;
    var args = arguments;
    if(args.length == 3){
      name = args[0];
      deps = args[1];
      body = args[2];
    }else if(args.length ==2){
      name = args[0];
      body = args[1];
    }else if(args.length ==1){
      body = args[0];
    }else{
      return;
    }
    // 重复注册 
    if(_cache_[name]){
      return;
    }
    _cache_[name] = {
      name:name,
      deps:deps,
      body:body
    }
  }
  
  define.amd = {
    version:"1.0.0",
    author:"lianjia.com"
  };
  function extend(source,dest){
    for(var i in dest){
      source[i] = dest[i];
    }
  }
  
  function getDefined(name){
    
    if(_execute_[name]){
      return _execute_[name].body;
    }
    if(_cache_[name]){
      _execute_[name] = {
        name:name,
        body:execute(_cache_[name])
      };
      return _execute_[name].body;
    }
    console && console.warn(name+" is not defined");
    return undefined;
  }
  
  /*  
   * 
   name:name,
   deps:deps,
   body:body
   * 
   */
  function execute(obj){
    var moduleRequire = function(){
      var deps,callabck;
      var args = arguments;
      if(!args.length){
        return null;
      }
      var refer = "";
      if(moduleRequire.module){
        refer = moduleRequire.module.name;
      }
      deps = args[0];
      if(isArray(deps)){
        // 异步？
        asycLoad(refer,deps,args[1]);
      }else{
        var modName = getModuleName(refer,deps)
        return getDefined(modName);
      }
    };
    
    if(isFunction(obj.body)){
      moduleRequire.module = obj;
      var deps = [],exports={},module={exports:exports,name:obj.name};
      if(!obj.deps){
        deps.push(moduleRequire);
        deps.push(exports);
        deps.push(module);
      }else{
        for(var i = 0 ,len = obj.deps.length;i < len;i++){
          var depObject ;
          if(obj.deps[i] == "require"){
            depObject = moduleRequire;
          }else{
            var modName = getModuleName(obj.name,obj.deps[i]);
            depObject = getDefined(modName)
          }
          deps.push(depObject);
        }
      }
      var rs ;
      try{
        rs = obj.body.apply(null,deps);
      }catch(e){
        console && console.error(obj,e);
      }
      
      if(rs == undefined){
        // 没有return 返回
        var len = 0;
        for(var i in exports){
          len++;
        }
        if(len){
          rs = exports;
        }
      }
      return rs;
    }
    return obj.body;
  }
  
  require = function(){
    var deps,callabck;
    var args = arguments;
    if(!args.length){
      return null;
    }
    var refer = "";
    if(require.module){
      refer = require.module.name;
    }
    deps = args[0];
    if(isArray(deps)){
      // 异步？
      asycLoad(refer,deps,args[1]);
    }else{
      var modName = getModuleName(refer,deps)
      return getDefined(modName);
    }
  };
  
  var config = {
    baseUrl:"",
    paths:{},
    urlArgs:""
  }
  require.config = function(option){
    extend(config,option);
  };
  
  // 合并路径
  function joinUrl(){
    var args = arguments,rs = [];
    for(var i = 0 ,len = args.length; i < len;i++){
      if(!args[i]){
        continue;
      }
      if(args[i].charAt(0) == "/"){
        args[i] = args[i].substring(1);
      }
      if(args[i].charAt(args[i].length-1) == "/"){
        args[i] = args[i].substring(0,args[i].length-1);
      }
      rs.push(args[i]);
    }
    return rs.join("/")
  }
  var DIRNAME_RE = /[^?#]*\//
  var DOT_RE = /\/\.\//g;
  var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//;
  var MULTI_SLASH_RE = /([^:/])\/+\//g
  // 相对路径 
  function relatePath(s,d){
    return realpath(joinUrl(s,d));
  }
  function dirname(path) {
    if(!path){
      return path ;
    }
    return path.match(DIRNAME_RE)[0]
  }
  function realpath(path) {
    // /a/b/./c/./d ==> /a/b/c/d
    path = path.replace(DOT_RE, "/")
  
    /*
      @author wh1100717
      a//b/c ==> a/b/c
      a///b/////c ==> a/b/c
      DOUBLE_DOT_RE matches a/b/c//../d path correctly only if replace // with / first
    */
    path = path.replace(MULTI_SLASH_RE, "$1/")
  
    // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
    while (path.match(DOUBLE_DOT_RE)) {
      path = path.replace(DOUBLE_DOT_RE, "/")
    }
  
    return path
  }
  // 添加尾部
  function fixedSuffix(url){
    var suffix= ".js";
    var index = url.indexOf(suffix);
    if(index < 0){
      url += suffix
    }
    if(config.urlArgs){
      if(url.indexOf("?") < 0){
        url+="?"
      }
      if(url.indexOf("&") >= 0){
        url+="&"
      }
      url+=config.urlArgs
    }
    return url;
  }
  function getLoadedPath(sModule,destModule){
    if(config.paths[destModule]){
      return fixedSuffix(joinUrl(config.baseUrl,config.paths[destModule]));
    }
    // 相对路径
    if(destModule.charAt(0) == "."){
      var myPath = joinUrl(config.baseUrl,sModule);
      return fixedSuffix(relatePath(myPath,destModule));
    }
    return fixedSuffix(joinUrl(config.baseUrl,destModule));
  }
  
  function getModuleName(sModule,destModule){
    if(destModule.charAt(0) == "."){
      var relatePath = realpath(joinUrl(dirname(sModule),destModule));
      return relatePath;
    }
    return destModule;
  }
  
  function asycLoad(refer,deps,cb){
    
    function loadModel(module,callback){
      var path = getLoadedPath(refer,module);
      singleLoadScript(realpath(path),callback)
    }
    function iteraDeps(depList){
      var mod = deps.shift();
      if(!mod){
        cb && cb.apply(this,depList);
        return;
      }
      while(_cache_[mod]){
        depList.push(getDefined(mod));
        mod = deps.shift();
      }
      if(!mod){
        cb && cb.apply(this,depList);
        return;
      }
      loadModel(mod,function(success){
        if(success){
          var modName = getModuleName(refer,mod);
          var modObj = getDefined(modName);
          depList.push(modObj);
        }else{
          depList.push(null);
        }
        iteraDeps(depList);
      })
    }
    iteraDeps([]);
  }
  
  function isFunction(obj){
    return typeof obj === 'function';
  }
  function isArray(arr){
    return Object.prototype.toString.call(arr) === "[object Array]"
  }
  
  var isLoading = {};
  function singleLoadScript(path,cb){
    if(isLoading[path]){
      if(isLoading[path].loaded){
        fn.apply(null,[loaded == 1?true:false]);
      }else{
        isLoading[path].list.push(cb);
      }
      return;
    }
    isLoading[path] = {
      loaded:0,
      list:[]
    };
    isLoading[path].list.push(cb);
    
    function executeCB(success){
      var fn ;
      isLoading[path].loaded = success?1:-1;
      while(fn = isLoading[path].list.shift()){
        try{
          fn.apply(null,[success]);
        }catch(e){
          console && console.error(path,e)
        }
      }
    }
    scriptLoader({
      url:path,
      complete:function(){
        executeCB(true);
      },
      fail:function(){
        executeCB(false);
      }
    })
  }
  var Ready = (function(DOC){
    var isReady = false;
    
    var _cbList_ = [];
    
    function _ready(){
      if(isReady){
        return;
      }
      isReady = true;
      
      var cb;
      while(cb = _cbList_.shift()){
        cb.apply(null);
      }
    }
    if(/complete|loaded|interactive/.test(document.readyState) && document.body){
      _ready();
    }else{
      window.addEventListener('DOMContentLoaded', _ready, false)
    }
    
    return function(cb){
      if(isReady){
        cb.apply(null);
      }else{
        _cbList_.push(cb);
      }
    }
  })(document);
  
  function scriptLoader(option){
    Ready(function(){
      _scriptLoader(option);
    })
  }
  
  function _scriptLoader(option){
    var opt = {
      url:"",
      charset:"utf-8",
      complete:function(){},
      fail:function(){}
    }
    extend(opt,option);
    
    if(!opt.url){
      throw "url is requireed"
    }
    var isloaded = false;
    var script = document.createElement("script"),
        head = document.getElementsByTagName("head")[0];
    
    function success(){
      if(isloaded){
        return false;
      }
      isloaded = true;
      script.onload = null;
      script.onerror = null;
      
      opt.complete && opt.complete();
      head.removeChild(script);
    }
    function fail(){
      if(isloaded){
        return false;
      }
      isloaded = true;
      
      opt.fail && opt.fail();
      head.removeChild(script);
    }
    script.onload = success;
    script.onerror = fail;
    script.onreadystatechange = function(state){
      if(script.readyState == "complete" || script.readyState == "loaded"){
        success();
      }
    }
    
    
    script.type="text/javascript";
    script.src = opt.url;
    script.charset=opt.charset;
    
    head.appendChild(script);
    
  }
  var interactiveScript;

  /**
   * 获取当前script标签
   * 用于ie下define未指定module id时获取id
   *
   * @inner
   * @return {HTMLScriptElement} 当前script标签
   */
  function getCurrentScript() {
      if (
          interactiveScript
          && interactiveScript.readyState === 'interactive'
      ) {
          return interactiveScript;
      }
      if(document.currentScript){
        return document.currentScript;
      }

      var scripts = document.getElementsByTagName('script');
      var scriptLen = scripts.length;
      while (scriptLen--) {
          var script = scripts[scriptLen];
          if (script.readyState === 'interactive') {
              interactiveScript = script;
              return script;
          }
      }
  }
  
  (function(){
    var script = getCurrentScript();
    if(script){
      var url = script.getAttribute("src");
      config.baseUrl = dirname(url);
    }
    _execute_.require = {
      name:require,
      body:require
    };
  })();
  
  win.define = define;
  win.require = require;
  define.getBaseUrl = function(){
    return config.baseUrl;
  }
})(typeof window?window:this);