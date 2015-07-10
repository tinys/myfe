/**
 * 级联 select
 */
define(function(require){
  return function(dom,option){
    var opt = {
      parse:function(data){
        return data;
      }
    }
    $.extend(opt,option);
    
    
    function _loadSelect(select,url,data){
      var trans = $.Trans({
        url:url
      });
      trans.request(data).done(function(data){
        var data = opt.parse(data);
        var options = [];
        if(data.length){
          for(var i = 0 ; i < data.length;i++){
            options.push('<option value="'+data[i].value+'">'+data[i].text+'</option>')
          }
          empty(select);
          select.append($(options.join("")));
        }
      })
    }
    function empty(select){
      var children = select.children();
      children.each(function(){
        var c = $(this);
        if(c.val()){
          c.remove();
        }
      })
    }
    function loadSelect(select){
      var bindUrl = select.attr("bindUrl"),
          bindListener = select.attr("bindListener");
      
      var lisnterCode = $(bindListener);
      var data = {};
      if(lisnterCode.length){
        if(lisnterCode.val()){
          data[lisnterCode.attr("name")] = lisnterCode.val();
          _loadSelect(select,bindUrl,data)
        }else{
          empty(select);
        }
      }else{
         _loadSelect(select,bindUrl,data)
      }
    }
    
    var actInitSelect = dom.find(".actInitSelect");
    actInitSelect.each(function(){
      var select = $(this);
      loadSelect(select);
      
      var bindListener = $(select.attr("bindListener"));
      if(bindListener.length){
        bindListener.on("change",function(){
          loadSelect(select);
        })
      }
    })
  }
})
