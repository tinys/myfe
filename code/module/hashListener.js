/**
 * hash change变化
 *
 *
 */
define(function(require) {

  var EventEmitter = $.EventEmitter;
  var listener = new EventEmitter();

  var hashchange = 'hashchange', DOC = document, documentMode = DOC.documentMode, supportHashChange = ('on' + hashchange in window) && (documentMode ===
  void 0 || documentMode > 7 );

  function getHash(string) {
    if (!string) {
      string = location.href;
    }
    return location.href.replace(/^[^#]*#?(.*)$/, '$1');
  }
  function setHash(string){
    location.href = location.href.replace(/#.*/, '')+string;
  }
  function change(e) {
    var href = location.href;
    var hash = getHash(href);
    listener.trigger("change", hash);
  }

  if (supportHashChange) {
    var win = $(window);
    win.on("hashchange", change);
  } else {
    function addHashListener(){
      var iframe = null, history_hash,last_hash = getHash();
      if (!iframe) {
        var el = $('<iframe tabindex="-1" style="display:none" widht=0 height=0 title="empty" />').appendTo( document.body )[0],
        fn, iframe = el.contentWindow, timeoutID;
        fn = function() {
          $(el).off("load",fn)
          
          var doc = iframe.document
          doc.open();
          doc.write("<!doctype html><html><body>" + getHash() + "</body></html>")
          doc.close();
          timeoutID = setInterval(poll, 50)
        }
        $(el).on("load",fn)
        
        function setHistory(hash, history_hash) {
          var doc = iframe.document;
          if (hash !== history_hash) {//只有当新hash不等于iframe中的hash才重写
            //用于产生历史
            doc.open();
            doc.write("<!doctype html><html><body>" + hash + "</body></html>");
            doc.close();
          }
        }
  
        function poll() {
          var hash = getHash(), //取得主窗口中的hash
          history_hash = iframe.document.body.innerText;
          //取得现在iframe中的hash
          if (hash !== last_hash) {//如果是主窗口的hash发生变化
            setHistory( last_hash = hash, history_hash)
            change();
          } else if (history_hash !== last_hash) {//如果按下回退键，
            location.href = location.href.replace(/#.*/, '') + history_hash;
          }
        }
  
      }
    }
    $(document.body).ready(function(){
      addHashListener();
    })
  }

  listener.getHash = getHash;
  listener.setHash = setHash;
  return listener;
})
