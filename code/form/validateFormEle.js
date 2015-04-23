/**
 * 验证表单元素
 * validate:需要验证的方法
 * validatename:提示语
 * validatedata:验证方法需要的数据。目前密码要求的长度为6，后续如果需要验证复杂度，需要在这里添加
 * <input type="password" name="password" id="password" placeholder="请输入密码" validate="notNull,minLength" validatedata="minLength=6" validatename="密码">
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
      val = parseInt(val);
      
      if(isNaN(val)){
        return false;
      }
      return true;
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
      return val.length <= data;
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
    }
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
            text = name+"应为数字格式";
            break;
          case "minValue":
            text = name +"应该大于"+data;
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
      }
      return true;
  }
  
  validateEl.showError = function(element,text){
    $.Toast.getInstance().showError(text);
  };
  
  return validateEl;
})
