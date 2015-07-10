/**
 * alert确认框
 * 
 */
define(function(require){
 var BaseLayer = require("./BaseLayer");
  
 var template =  '<div class="msg-box ">'+
                    '<div class="msg-content">'+
                      '<%if(title){%><p><%=title%></p><%}%>'+
                      '<%if(msg){%><p><%=msg%></p><%}%>'+
                    '</div>'+
                    '<p class="module-btns"><a href="#" class="actSure module-btn"><%=ok%></a></p>'+
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
 return function(opt,callback){
   var option = {
     title:"",
     msg:"",
     ok:"知道了"
   };
   $.extend(option,opt);
   
   var html = alertTemplate.render(option);
   var layer = getAlertLayer();
   var dom = layer.getDOM();
   dom.html(html);
   dom.delegate(".actSure","click",function(){
     callback && callback();
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
