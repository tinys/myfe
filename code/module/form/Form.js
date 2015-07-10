/**
 * form 验证+提交 
 * 
 *   支持普通表单以及 含有附件的表单(在本域名下上传附件，暂不支持跨域附件)
 * 
 * @description
 *  
 */
define(function(){
  var Base = $.AView;
  
  // validate 
  var validateEl = require("./validateFormEle"),
      Trans = $.Trans,
      FormTrans = require("./FormTrans");
  
  var Form = Base.extend({
    initialize:function(el){
      var _this = this;
      _this._super({
        el:el
      });
    },
    events:{
      "click .actSubmit":"actSubmit",
      "blur .ntValidate":"checkValidate",
      "change select":"checkValidate",
      "click input[type='radio']":"checkValidate",
      "keyup .actShowNum":"actShowNum",
      "click .actSubmitForm":"actSubmitForm"
      
      // "keydown .ntValidate":"removeError",
    },
    actShowNum:function(e){
      var _this = this;
      var target = $(e.target);
      _this._checkLength(target);
    },
    _checkLength:function(target){
      var _this = this;
      var maxLength = $.queryToJson(target.attr("validatedata")).maxLength;
      if(maxLength){
        maxLength = parseInt(maxLength);
        var valLength = Math.round($.bLength($.trim(target.val()))/2);
        var showNum = valLength;
        var showNumEl = target.parent().find(".actShowNumText");
        showNumEl.html("<span "+(showNum > maxLength?"class='overflow'":"")+">"+Math.abs(showNum)+"</span>/"+maxLength)
      }
    },
    checkValidate:function(e){
      var target = e.currentTarget;
      if(validateEl(target)){
        validateEl.hideError(target);
      }
    },
    removeError:function(e){
      var target = e.currentTarget;
      validateEl.hideError(target);
      
    },
    _validate:function(el){
      return validateEl(el)
    },
    getFormValue:function(){
      var form = this.$el.get(0);
      var element = form.elements;
      var args = {};
      for(var i = 0,len = element.length;i < len;i++){
        var el = $(element[i]);
        // 如果不让提交 continue
        if(el.prop("disabled")){
          continue;
        }
        
        if(!this._validate(el)){
          el.focus();
          return false;
        }
        
        
        
        var name = el.attr("name");
        if(name){
          // checkbox radio 判断select
          var type = el.attr("type");
          if(type){
            type = type.toLowerCase();
            if(type == "checkbox" || type == "radio"){
              if(!el.get(0).checked){
                continue;
              }
            }
            if(type == "file" && form.getAttribute("enctype") != "multipart/form-data"){
              continue;
            }
            
          }
          if(args[name] === undefined){
            args[name] = el.val();
          }else{
            if($.isArray(args[name])){
              args[name] = args[name].concat(el.val());
            }else{
              args[name] = [args[name]].concat(el.val());
            }
          }
        }
      }
      return args;
    },
    actSubmit:function(e){
      var _this = this;
      var target = $(e.target);
      _this.submit(target);
      return false;
    },
    actSubmitForm:function(){
      var _this = this;
      var values = _this.getFormValue();
      if(values === false){
        return false;
      }
      _this.$el.submit();
      return false;
    },
    submit:function(target){
      var _this = this;
      // 防治重复提交
      if(_this.isTransing){
        return false;
      }
      var status = _this.trigger("beforeGetArgs");
      if(status === false){
        return;
      }
      var values = _this.getFormValue();
      if(values === false){
        return false;
      }
      var status = _this.trigger("beforeSubmit",values);
      if(status===false){
        return  false;
      }else if(status){
        $.extend(values,status);
      }
     
      // form 提交方式，如果是上传文件，就得特殊方式处理
      var req = false;
      if(_this.$el.attr("enctype") === "multipart/form-data"){
        req = new FormTrans(_this.$el.get(0));
      }else{
        // submit
        req = new Trans({
          url:_this.$el.attr("action"),
          method:_this.$el.attr("method")
        });
      }
      _this.isTransing = true;
      req.request(values).done(function(data){
        try{
           _this.trigger("success",data,values,target);
        }catch(e){
        }
        _this.isTransing = false;
      }).fail(function(){
        _this.isTransing = false;
        _this.trigger("fail");
      })
    },
    // 显示状态，输入目标input元素，显示消息。并添加状态 type:warn  error log
    showStatus:function(target,msg,type){
      var className = "has-wraning";
      type = type || "warn";
      className = "has-"+type;
      
      var container = target.closest(".form-inline");
      if(container.length){
        container.addClass(className);
      }
      var status = container.find(".status");
      if(!status.length ){
        status = $("<span class='status'></span>")
      }
      status.html(msg);
      status.show();
    },
    hideStatus:function(target){
      var container = target.closest(".form-inline");
      container.find(".status").hide();
    },
    destroy:function(){
      var _this = this;
      _this._super();
    }
  })
  
  return Form;
})
