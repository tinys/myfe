/**
 * 验证表单元素
 * validate:需要验证的方法
 * validatename:提示语
 * validatedata:验证方法需要的数据。目前密码要求的长度为6，后续如果需要验证复杂度，需要在这里添加
 * <input type="password" name="password" id="password" placeholder="请输入密码" validate="notNull,minLength" validatedata="minLength=6" validatename="密码">
 * 
 * 目前验证方法有：
 * notNull   是否为空
 * isTel     手机号--中国
 * isInteger 整数
 * minValue  最小值
 * isSame    是否一致
 * maxLength 最大长度
 * minLength 最小长度
 * length    长度
 * isChecked 是否选中
 * 
 * 扩展方法
 * validateEl.extend(name,function(val){
 *   return $.trim(val);
 * },function(name,data){
 *   return name+"不能为空"
 * })
 */
define(function(require){
  var validate = {
    notNull:function(val){
      return $.trim(val);
    },
    // 验证是否是电话号码
    isTel:function(val){
      var reg = /^(13[0-9]|14(5|7)|15(0|1|2|3|5|6|7|8|9)|18[0-9])\d{8}$/;
      return reg.test(val);
    },
    isInteger:function(val){
      if(!val){
        return true;
      }
      return /^-?\d+$/.test(val);
    },
    isNumber:function(val,ele,data){
      if(!val){
        return true;
      }
      if(/^(-?\d+)(\.\d+)?$/.test(val)){
        if(data){
          data = parseInt(data);
          val = parseInt((parseFloat(val) * Math.pow(10,data)))/Math.pow(10,data)
          ele.value = val+"";
        }
        
        return true;
      }else{
        return false;
      }
    },
    minValue:function(val,ele,data){
      if(!val){
        return true;
      }
      val = parseInt(val);
      data = parseInt(data);
      return val>data;
    },
    // 是否相同
    isSame:function(val1,ele,data){
      var obj = $(data);
      if(!obj.length){
        return false;
      }
      return val1 == obj.val();
    },
    maxLength:function(val,ele,data){
      val = $.trim(val);
      data = parseInt(data);
      return $.bLength(val)/2 <= data;
    },
    minLength:function(val,ele,data){
      val = $.trim(val);
      data = parseInt(data);
      return val.length >= data;
    },
    length:function(val,ele,data){
      val = $.trim(val);
      data = parseInt(data);
      return val.length == data;
    },
    isChecked:function(val,ele){
      return ele.checked;
    },
    // 是否是合法的，禁止 xss输入带< >
    isValidate:function(val,ele){
      return val.indexOf(">") < 0 && val.indexOf("<") <0;
    },
    le:function(value,ele,data){
      var target = $(data);
      var val  = target.val();
      if(!val){
        return true;
      }
      
      return parseInt(value) <= parseInt(val);
    },
    ge:function(value,ele,data){
      var target = $(data);
      var val  = target.val();
      if(!val){
        return true;
      }
      
      return parseInt(value) >= parseInt(val);
    },
    afterDate:function(value,ele,data){
      if(!value){
        return true;
      }
      if(!data){
        data = new Date();
        data.setHours(0);
        data.setMinutes(0)
        data.setSeconds(0)
      }else{
        data = $.buildDate(data);
      }
      var v = $.buildDate(value);
      return v.getTime() > data.getTime();
    },
    beforeDate:function(value,ele,data){
      if(!value){
        return true;
      }
      if(!data){
        data = new Date();
        data.setHours(0);
        data.setMinutes(0)
        data.setSeconds(0)
      }else{
        data = $.buildDate(data);
      }
      var v = $.buildDate(value);
      return v.getTime() <= data.getTime();
    }
  }
  var validateMsg = {
    
  }
  var validateEl =  function(element,showMsg){
      element = $(element);
      if(!element.length){
        return true;
      }
      function showError(fun,name,data){
        var text = "";
        switch(fun){
          case "notNull":
            text = name + "不能为空";
            break;
          case "isTel":
            text = "请输入正确的"+name;
            break;
          case "isSame":
            text = name+"输入不一致";
            break;
          case "isChecked":
            text = name+"没有选中";
            break;   
          case "length":
            text = name+"长度为"+data;
            break;
          case "maxLength":
            text = name+"最大长度为"+data;
            break;
          case "minLength":
            text = name+"最小长度为"+data;
            break;
          case "isInteger":
            text = name+"应为整数";
            break;
          case "isNumber":
            text = name+"应为数字格式";
            break;
          case "minValue":
            text = name +"应该大于"+data;
            break;
          case "isValidate":
            text = name +"不合法，禁止输入带<>的字符";
            break;
          case "le":
            var target = $(data).attr("validateName")
            text = name + " 不能大于"+target;
            break;
          case "ge":
            var target = $(data).attr("validateName")
            text = name + " 不能小于"+target;
            break;
          case "afterDate":
            var time = data;
            if(!data){
              time = "当前时间"
            }
            text = name +"不能小于"+time
            break;
          case "beforeDate":
            var time = data;
            if(!data){
              time = "当前时间"
            }
            text = name +"不能大于"+time
            break;
        }
        if(!text && validateMsg[fun]){
          text = validateMsg[fun](name,data);
        }
        text && showMsg!==false && validateEl.showError(element,text);
      }
      
      var validateFuns = element.attr("validate");
      if(validateFuns){
        var vs = validateFuns.split(","),
            val = element.val(),ele = element.get(0),
            vName = element.attr("validateName");
        var validateData = element.attr("validateData");
        if(validateData){
          validateData = $.queryToJson(validateData);
        }else{
          validateData = {};
        }
        
        for(var i = 0 ; i < vs.length;i++){
          var fun = vs[i];
          if(validate[fun] && !validate[fun].call(null,val,ele,validateData[fun])){
            // show error
            showError(fun,vName,validateData[fun]);
            
            return false;
          }
        }
        validateEl.hideError(ele);
      }
      return true;
  }
  // 显示错误信息
  validateEl.showError = function(element,msg){
   
    validateEl.showStatus(element,msg,"has-error")
  }
  validateEl.showStatus = function(element,msg,status){
    var container = $(element).closest(".form-inline");
    container.addClass(status);
    var status = container.find(".status");
    if(!status.length){
      status = $("<span class='status'></span>");
      container.append(status);
    }
    status.html(msg);
    status.show();
    
    // var top = $(container).offset().top;
    // $("html,body").animate({scrollTop:top},300)
    // element.focus();
  }
  validateEl.showWarn = function(element,msg){
    validateEl.showStatus(element,msg,"has-warnning")
  }
  
  validateEl.hideError = function(element){
    var container = $(element).closest(".form-inline");
    container.removeClass("has-error has-warnning");
    container.find(".status").hide();
  }
  validateEl.extend = function(name,validateFun,showMsgFun){
    if(name){
      validate[name] = validateFun;
      validateMsg[name] = showMsgFun;
    }
  }
  validateEl.validate = validate;
  return validateEl;
})
