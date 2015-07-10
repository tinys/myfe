/**
 * 
 * <input type="text" suggestData="url=http://devbj.lianjia.com:8002/api/resblockSuggestion/"  name="keyword" class="autoSuggest" autocomplete="off" placeholder="请输入小区名称或房源编号">
 */
define(function(require){
  var View = $.View,
      AView = $.AView;
  
  var SuggestView = View.extend({
    template:'<ul><%if(typeof list != "undefined" && list){for(var i = 0 ,len = list.length;i < len;i++){%><li class="actSelect" actData="index=<%=i%>&value=<%=list[i].value%>&name=<%=list[i].name%>"><%=list[i].name%></li><%}}%></ul>',
    initialize:function(option){
      var _this = this;
      var opt = {
        template:_this.template,
        hoverClass:"hover",
        enterDefault:true
      }
      $.extend(opt,option);
      _this._super(opt);
      
      _this.on("render",function(data){
        if(_this.$el.find(".actSelect").length){
          _this.$el.show();
        }else{
          _this.$el.hide();
        }
      })
    },
    events:{
      "click .actSelect":"actSelect",
      "mouseenter .actSelect":"actMouse",
      "click ul":"stop"
    },
    actSelect:function(e){
      var target = $(e.currentTarget);
      this.select(target);
      return false;
    },
    actMouse:function(e){
      var _this = this;
      var target = $(e.currentTarget);
      target.parent().find("."+_this.opt.hoverClass).removeClass(_this.opt.hoverClass);
      target.addClass(_this.opt.hoverClass);
    },
    pre:function(){
      var _this = this;
      var list = _this.$el.find(".actSelect");
      
      var cur = _this._getCurSelectIndex(),index = 0;
      if(cur !== false){
        index = cur==0 ? list.length-1 : (cur-1);
      }
      list.removeClass(_this.opt.hoverClass)
      list.eq(index).addClass(_this.opt.hoverClass);
    },
    next:function(){
      var _this = this;
      var list = _this.$el.find(".actSelect");
      
      var cur = _this._getCurSelectIndex(),index = 0;
      if(cur !== false){
        index = cur==(list.length-1) ? index : (cur + 1);
      }
      list.removeClass(_this.opt.hoverClass)
      list.eq(index).addClass(_this.opt.hoverClass);
    },
    enter:function(){
      var _this = this;
      var cur = _this._getCurSelectIndex(),index = -1;
      if(cur !== false){
        index = cur;
      }else if(_this.opt.enterDefault){
        index = 0;
      }
      if(index >=0){
        var list = _this.$el.find(".actSelect");
        _this.select(list.eq(index));
      }else{
        _this.trigger("select",null);
      }
      return index;
    },
    _getCurSelectIndex:function(){
      var _this = this;
      var selectEle = this.$el.find("."+this.opt.hoverClass);
      if(selectEle.length){
        return _this.$el.find(".actSelect").index(selectEle);
      }
      return false;
    },
    select:function(target){
      var _this = this;
      var data = $.queryToJson(target.attr("actData"));
      _this.trigger("select",data,target);
      this.hide();
    },
    stop:function(){
      return false;
    },
    show:function(){
      if(this.$el.find(".actSelect").length){
        this.$el.show();
      }
    },
    hide:function(){
      this.$el.hide();
    },
    showloading:$.noop,
    showfail:$.noop
  });
  
  var AutoSuggest =  AView.extend({
    initialize:function(option){
      var _this = this;
      var opt = {
        el:"",
        listEl:"",
        url:"",
        param:"keyword"        
      }
      $.extend(opt,option);
      // if(opt.el){
        // opt.el = $(opt.el).parent();  
      // }
      _this._super(opt);
      
      _this.input = _this.opt.input || _this.$el.find(".autoSuggest");
      if(!_this.$el){
         return;
      }
      if(!opt.url){
        var suggestData = $(_this.input).attr("suggestData");
        if(suggestData){
          $.extend(_this.opt,$.queryToJson(suggestData,true))
        }
      }
      _this._disable = false;
      _this._initSuggest();
    },
    events:{
      "focus .autoSuggest":"focus",
      "blur .autoSuggest":"blur",
      "keyup .autoSuggest":"keyup",
      "keydown .autoSuggest":"keydown"
      // "click .autoSuggest":"click"
    },
    _initSuggest:function(){
      var _this = this;
      var parEl = _this.$el;
      
      
      if(!_this.opt.listEl){
        var el = $('<div class="suggest-wrap" style="position:absolute;"></div>');
        $(document.body).append(el);
        var suggestWrapper = el;
        var inputPos = _this.input.offset();
        suggestWrapper.css({
          top:inputPos.top+_this.input.height()+"px",
          left:inputPos.left+"px"
        })
        _this.opt.listEl = suggestWrapper;
      }
      _this.opt.listEl.css({
        "width":_this.input.outerWidth()
      });
      var opt = {
      }
      $.extend(opt,_this.opt);
      
      opt.el = _this.opt.listEl;
      
      _this.suggestView = new SuggestView(opt);
      _this.delegateBodyEvent = function(){
        _this.suggestView.hide();
      }
      _this.suggestView.on("select",function(data){
        if(data){
          _this.input.val(data.name) ;
          _this.selectData = data;
          _this.trigger("select",data);
        }else{
          _this.trigger("selectNoData");
        }
      })
      _this.suggestView.on("render",function(){
        //reset position
        var inputPos = _this.input.offset();
        
        _this.suggestView.$el.css({
          top:inputPos.top+_this.input.height()+"px",
          left:inputPos.left+"px"
        })
      })
    },
    getSelect:function(){
      var _this = this;
      var inputVal  = _this.input.val();
      if(this.selectData && this.selectData.name == inputVal){
        return this.selectData;
      }
      return false;
    },
    getSuggestData:function(){
      return this.suggestView.model.toJson();
    },
    keydown:function(e){
      var _this = this;
      if(this._disable){
        return;
      }
      // 特殊的keyup
      // if(e.keyCode == 13){
        // if(_this.suggestView.enter() < 0){
          // return;
        // }
      // }
      if($.inArray(e.keyCode,[9,27,38,40,13]) >=0){
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      // 阻止上下 左右 enter 事件
    },
    click:function(){
      // return false;
    },
    focus:function(){
      $(document.body).click(this.delegateBodyEvent);
      this.setVal();
    },
    blur:function(){
      var _this = this;
      setTimeout(function(){
        $(document.body).off("click",this.delegateBodyEvent);
        _this.suggestView.hide();
      },300);
    },
    keyup:function(e){
      var _this = this;
      if(_this._disable){
        return;
      }
      switch(e.keyCode){
        // tap
        case 9:
           _this.suggestView.next();
          break;
        // 上
        case 38:
          _this.suggestView.pre();
          break;
        // 下
        case 40:
          _this.suggestView.next();
          break;
        // 确认
        case 13:
          if(_this.suggestView.enter() < 0){
            return;
          }
          break;
        // esc
        case 27:
          _this.suggestView.hide();
          break;
        default:
          _this.setVal();
          break;
      }
      if($.inArray(e.keyCode,[38,40,13]) >=0){
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    _reqTimeout_:false,
    _timeout:300,
    setVal:function(){
      var _this = this;
      if(_this._reqTimeout_){
        clearTimeout(_this._reqTimeout_);
      }
      _this._reqTimeout_ = setTimeout(function(){
        var index = $.TextAreaUtil.getCursorPosition(_this.input.get(0));
        var val = _this.input.val().substring(0,index);
        if(!val && _this.opt.empty){
          return;
        }
        var arg = {};
        arg[_this.opt.param] = val;
        _this.suggestView.request(arg);
        
      },_this._timeout)
    },
    disable:function(disable){
      var _this = this;
      _this._disable = disable;
      if(disable){
        _this.suggestView.hide();
      }else{
        _this.suggestView.show();
      }
    },
    isDisable:function(){
      return this._disable
    },
    destroy:function(){
      var _this = this;
      _this.suggestView.destroy();
      _this._super();
    }
  });
  
  
  return AutoSuggest;
})
