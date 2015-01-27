/**
 * hash change变化 
 * 
 * 
 */
define(function(require){
  
  var EventEmitter = new require("./EventEmitter");
  var listener = new EventEmitter();
  
  var hashchange = 'hashchange',  DOC = document,  documentMode = DOC.documentMode,
      supportHashChange = ('on' + hashchange in window) && ( documentMode === void 0 || documentMode > 7 );
  
  function getHash(string){
    if(!string){
      string = location.href;
    }
    return location.href.replace(/^[^#]*#?(.*)$/, '$1');
  }
  
  function change(e){
    var href = location.href;
    var hash = getHash(href);
    
    listener.trigger("change",hash);
  }
  
  // 暂时不支持ie6
  if(supportHashChange){
    var win = $(window);
    win.on("hashchange",change);
  }
  
  listener.getHash = getHash;
  
  return listener;
})
