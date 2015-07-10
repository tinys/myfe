/**
 * 文件上传
 * 
 * @example
 <div id="fileUpload" action="/house/broker/upload.action" actData="">
   <input type="file" name="file" class="actSelectFiles">
 </div>
 
 var fileUpload = new FileUpload({
   el:"#fileUpload",
   accept:"image"
 })
 fileUpload.on("success",function(){
   console.log(data)
 })
 // 支持批量上传会调用这个
 fileUpload.on("upload",function(){
   console.log(data)
 })
 */
define(function(require){
  var Form = require("../form/Form"),
      FormTrans = require("../form/FormTrans");
      
  var FileUploadForm = Form.extend({
    resetParam:function(args){
      if(!args){
        return;
      }
      var _this = this;
      var form = _this.$el;
      form.children().remove();
      
      for(var i in args){
        var input = $("<input type='hidden' name='"+i+"' value='"+args[i]+"'>");
        form.append(input)
      }
      
    },
    addFile:function(file){
      var _this = this;
      _this.$el.find("[type='file']").remove();
      _this.$el.append(file);
    },
    submitFile:function(supportMultiple){
      var _this = this;
      $.Toast.getInstance().showLoading("上传中...")
      if(FormTrans.supportAjax2 && !supportMultiple){
        _this.uploadByStep();
      }else{
        _this.submit();
      }
    },
    uploadByStep:function(){
      var _this = this;
      var inputFile = _this.$el.find("[type='file']").get(0);
      var  files = inputFile.files;
      if(files && !files.length){
        return;
      }
      var totalCount = files.length,uploadCount = 0;
      var _currentData = _this.getFormValue();
      
      function uploadByForm(){
        var cloneForm = _this.$el.get(0).cloneNode(true);
        $(cloneForm).find(".actSelectFiles").remove();
        
        $(document.body).append(cloneForm);
        
        $.Toast.getInstance().showLoading("上传中("+(uploadCount+1)+"/"+totalCount+")...")
        
        var trans = new FormTrans(cloneForm);
        var args = {};
        args[inputFile.name] = files [uploadCount];
        
        trans.request(args).done(function(data){
          $(cloneForm).remove();
          if(uploadCount == totalCount-1){
            try{
               _this.trigger("success",data,_currentData);
            }catch(e){
              console.error(e);
            }
           
          }else{
            try{
               _this.trigger("upload",data,_currentData);
            }catch(e){
              console && console.error(e);
            }
            
            uploadCount++;
            uploadByForm();
          }
        }).fail(function(data){
          $(cloneForm).remove();
          _this.trigger("fail",data);
        })
      }
      uploadByForm();
    }
  })
  
  var FileUpload = $.AView.extend({
    initialize:function(opt){
      var option = {
        // form
        el:"",
        apiMutiple:false,
        accept:"image"
      }
      
      $.extend(option,opt);
      var el = $(option.el)
      if(!el.length){
        return false;
      }
      var _this = this;
      
      _this._super(option);
      
       
      var action = el.attr("action"),
          args   = el.attr("actData");
      
      _this._createUploadForm(action);
      
      _this.form = new FileUploadForm(_this._form);
      _this.form.resetParam($.queryToJson(args));
      _this.initAccept(option.accept);
      
      
      _this.form.on("success",function(data,args){
        _this.trigger("success",data,args)
      })
      _this.form.on("upload",function(data,args){
        _this.trigger("upload",data,args)
      })
      _this.form.on("fail",function(data,args){
        _this.trigger("fail",data,args)
      })
      
      
      _this.form.on("success",function(){
        $.Toast.getInstance().showSuccess("上传成功")
      })
      _this.form.on("fail",function(){
        $.Toast.getInstance().showError("上传失败")
      })
    },
    events:{
      "change .actSelectFiles":"actSelectFiles",
      // drag
    },
    _createUploadForm:function(action){
      var _this = this;
      var form = $("<form></form>");
      form.attr("action",action);
      form.attr("method","post");
      form.attr("enctype","multipart/form-data");
      form.css("display","none");
      $(document.body).append(form);
      _this._form = form;
    },
    initAccept:function(type){
      var _this = this;
      if(type == 'image'){
        _this.$el.find("[type='file']").attr("accept","image/gif,image/jpeg,image/png")
      }
    },
    // 上传文件
    actSelectFiles:function(e){
      // 判断选择文件 
      var _this = this;
      var target = e.currentTarget;
      if(!target.value){
        return;
      }
      if(!_this.checkType(target)){
         _this.trigger("fileTypeNotAccept");
        return false;
      }
      var parentNode = target.parentNode;
      _this.form.addFile(target);
      var cloneTarget = target.cloneNode();
      parentNode.appendChild(cloneTarget);
      
      _this.form.submitFile(_this.opt.supportMultiple);
    },
    checkType:function(target){
      var _this = this;
      var needVaue = _this.opt.accept;
      function checkName(name){
        if(!needVaue){
          return true;
        }
        name = name.substring(name.lastIndexOf("\.")+1);
        
        if(needVaue == "image"){
          return $.inArray(name,["jpg","png","gif"]) >=0;
        }else if(needVaue == "csv"){
          return $.inArray(name,["csv"]) >=0;
        }
        
        return true;
      }
      var value = target.value;
      return checkName(value);
    }
  });
  
  return FileUpload;
})
