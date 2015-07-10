/**
 * alert确认框
 * 
 */
define(function(require){
 var BaseLayer = require("./BaseLayer");
  
 var template =  '<div class="msg-box">'+
                    '<div class="msg-content">'+
                      '<%if(msg){%><p><%=msg%></p><%}%>'+
                    '</div>'+
                    '<p class="more-btns"><a href="#" class="actSure module-btn"><%=ok%></a><a href="#" class="actCancel module-btn cancel"><%=cancel%></a></p>'+
                  '</div>';
 
 
 
 var alertTemplate  = $.template(template);
 var alertLayer = false;
 
 var getAlertLayer = function(html){
   
   if(!alertLayer){
     alertLayer = BaseLayer({
       html:"" ,
       style:{
         left:"center",
         top:'center'
       },
       className:"alert-layer"
     });
   }
   
   return alertLayer;
 }
 return function(opt,okcallback,cancelcallback){
   var option = {
     msg:"",
     ok:"确定",
     cancel:"取消"
   };
   $.extend(option,opt);
   
   var html = alertTemplate.render(option);
   var layer = getAlertLayer();
   var dom = layer.getDOM();
   dom.html(html);
   dom.delegate(".actSure","click",function(){
     okcallback && okcallback();
     dom.undelegate();
     layer.hide();
     return false;
   })
   dom.delegate(".actCancel","click",function(){
     cancelcallback && cancelcallback();
     dom.undelegate();
     layer.hide();
     return false;
   })
   
   layer.show({
     left:"center",
     top:'center'
   });
 }
})
