/**
 * toast
 */
define(function(require){
  var BaseLayer = require("./BaseLayer");
  
  
  var loading = '<div class="info-con"><div class="page-loading">'+
                    '<div class="loading-house">'+
                    '</div>'+
                    '<p>加载中...</p>'+
                  '</div></div>';
  
  /*
   <div class="toast-info">
  <div class="info-con">
    <div class="success">
      <span class="info-icon"></span>
      <p>登录成功</p>
    </div>
    <div class="fail">
      <span class="info-icon"></span>
      <p>登录失败</p>
    </div>
  </div>
</div>
   */
  var toast = false
  return {
    getInstance:function(){
      if(!toast){
         toast = BaseLayer({
          "fixed":true,
          "className":"toast-info",
          "top":"center",
          "shadow":false
        })
        $.extend(toast,{
          showLoading:function(msg){
           var _this = this;
           
           _this.getDOM().html('<div class="info-con success"><span class="info-icon">'+(msg || "加载中...")+'</span></div>');
           
           _this.show({
             left:"center",
             top:"center"
           }); 
           return _this;
          },
          hideState:function(){
            this.hide();
          },
          showMessage:function(){
            
          },
          showSuccess:function(msg,time){
            var _this = this;
            // 默认1.5s
            time = time || 1500;
            _this.getDOM().html('<div class="info-con success"><span class="info-icon">'+msg+'</span></div>');
           
           _this.show({
             left:"center",
             top:"center"
           });
           setTimeout(function(){
             _this.hide();
           },time)
           return _this;
          },
          showFail:function(msg,time){
            var _this = this;
            // 默认1.5s
            time = time || 1500;
            _this.getDOM().html('<div class="info-con fail"><span class="info-icon">'+msg+'</span></div>');
           
           _this.show({
             left:"center",
             top:"center"
           });
           setTimeout(function(){
             _this.hide();
           },time)
           return _this;
          },
          showError:function(msg,time){
            this.showFail(msg,time);
          }
        })
      }
      return toast;
    }
  };
})
