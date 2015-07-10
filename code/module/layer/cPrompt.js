/**
 * 对话输入框
 * 
 */
define(function(require){
  var BaseLayer = require("./BaseLayer");
  
  var template = '<div class="msg-box  prompt-layer">'+
                  '<h3 class="title"><%=title%><span class="error"></span></h3>'+
                  '<p>'+
                    '<input type="text" name="prompt" value="<%=value%>" placeholder="<%=defaultValue%>">'+
                  '</p>'+
                  '<div class="module-btns more-btns">'+
                    '<a href="#" class="module-btn actSure" ><%=ok%></a>'+
                    '<a href="#" class="module-btn cancel actCancel" ><%=cancal%></a>'+
                 '</div>'+
                '</div>';
  var _promptTemplate = false;
  function getPromptTemplate(){
    if(!_promptTemplate){
      _promptTemplate = $.template(template);
    }
    return _promptTemplate;
  }
  return function(opt,onok,oncancel){
    var option = {
      title:"",
      value:"",
      // 标题
      defaultValue:"",
      ok:"确定",
      cancal:"取消"
    };
    
    $.extend(option,opt);
    
    var html = getPromptTemplate().render(option);
    
    var layer = BaseLayer({
      html:html,
      className:"alert-layer",
      esc:"close"
    });
    
    var node = layer.getDOM();
    
    node.delegate(".actSure","click",function(){
      var value = node.find("input").val();
      
      var result = onok && onok.call(layer,value);
      if(result){
        node.find(".error").html(result);
        node.find(".error").show();
      }else if(result !== false){
        layer.destroy();
      }
      return false;
    });
    
    layer.showMsg = function(result){
      node.find(".error").html(result);
      node.find(".error").show();
    };
    
    node.delegate(".actCancel","click",function(){
      oncancel && oncancel();
      layer.hide();
      layer.destroy();
      return false;
    });
    
    layer.show({
      left:"center",
      top:"center"
    })
    node.find("input").focus();
    return layer;
  }
})
