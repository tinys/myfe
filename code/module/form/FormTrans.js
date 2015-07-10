/**
 * 上传文件
 * 
 */
define(function(require){
  
  var supportAjax2 = window.FormData || false;
  
  // 支持formdata提交的 使用ajax2提交 不支持的，用iframe方式提交
  
  
  function UploadForm(form){
    this.form = form;
  }
  UploadForm.supportAjax2 = supportAjax2;
  
  function submitForm(form,timeout){
    var iframeId = "_uploadFileIframe_";
    timeout = timeout || 30* 1000;
    var deffer = $.Deferred();
    // 页面加载完毕
    function iframeLoad(){
      var src = iframe.get(0).src;
      if(src == "" || src == "about:blank"){
        return;
      }
      resolve();
    }
    var isResolve = false;
    //  获取iframe的值，并且返回
    function resolve(){
      if(isResolve){
        return;
      }
      var iframeEl = iframe.get(0);
      try{
        var body = iframeEl.contentWindow.document.body;
        var text = body.innerHTML;
        // 低版本浏览器 没有JSON
        var obj = eval('('+text+')');
        deffer.resolve(obj);
      }catch(e){
        deffer.reject(e);
      }
      isResolve = true;
      
      if(window.addEventListener){
         iframe.off("load",iframeLoad);
         iframe.off("error",iframeLoadErr)
      }else{
         iframe.get(0).detachEvent("load",iframeLoad);
         iframe.get(0).detachEvent("error",iframeLoadErr)
      }
    }
    function timeoutfun(){
      deffer.reject();
    }
    function iframeLoadErr(){
      deffer.reject();
    }
    var st = new Date().getTime(),__loopSetTimeout;
    function loop(){
      var now = new Date().getTime();
      if(now - st > timeout){
        timeoutfun();
        return;
      }
      if(__loopSetTimeout){
        clearTimeout(__loopSetTimeout);
      }
      try{
        // body
        var iframeEl = iframe.get(0);
        var doc = iframeEl.contentWindow.document;
        if(doc.readyState == "complete"){
          try{
            resolve();
          }catch(e){}
          return;
        }
      }catch(e){}
      // 查看内容
      
      __loopSetTimeout = setTimeout(function(){
        loop();
      },100)
    }
    
    var iframe = $("#"+iframeId);
    if(iframe.length){
      iframe.remove();
    }
    $(document.body).append('<iframe src="" id="'+iframeId+'" name="'+iframeId+'" style="width:0px;height:0px;border:0px;display:none;"></iframe>');
    iframe = $("#"+iframeId);
    
    if(window.addEventListener){
       iframe.on("load",iframeLoad);
       iframe.on("error",iframeLoadErr)
    }else{
       iframe.get(0).attachEvent("load",iframeLoad);
       iframe.get(0).attachEvent("error",iframeLoadErr)
    }
    
    form.target = iframeId;
    form.submit();
    
    loop();
    
    return deffer;
  }
  
  $.extend(UploadForm.prototype,{
    request:function(args){
      var _this = this;
      
      if(supportAjax2){
        var deffer = $.Deferred();
        var formData = new FormData(_this.form);
        if(args){
          for(var i in args){
            formData.append(i,args[i]);
          }
        }
        var oReq =  new XMLHttpRequest();
        oReq.onload = function(){
          if(oReq.status == 200){
            try{
              deffer.resolve(JSON.parse(oReq.responseText))
            }catch(e){
              deffer.reject();
            }
          }
          if(oReq.status == 404){
            deffer.reject();
          }
        }
        oReq.onreadystatechange = function(){
          if(oReq.readyState ==4){
            if(oReq.status != 200){
              deffer.reject();
            } 
          }
        };
        oReq.addEventListener("error", function(){
          deffer.reject();
        }, false);
        oReq.addEventListener("abort", function(){
          deffer.reject();
        }, false);
        oReq.open("post", _this.form.action, true);
        oReq.send(formData);
        return deffer;
      }else{
        return submitForm(_this.form);
      }
    }
  })
  
  return UploadForm;
})
