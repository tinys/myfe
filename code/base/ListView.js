/**
 * 列表view
 * @description
 *  1.继承View 
 *  2.增加分页功能 以及可以指定模板填充el下的那个dom
 * 分页注意：
 *  1.引入模板 view/common/jspager.tpl
 *  2.添加分页元素，属于el子元素
 *    <div class="page-box house-lst-page-box" node-type="pageList" node-val="totalPage=<%=totalPage%>&curPage=<%=curPage%>">
      </div>
   指定位置填充dom
   <div node-type="list"></div>
 */
define(function(require){
  var View = require("./View")
  var ListView = View.extend({
    events:{
      // 分页
      "click .actPage":"showPage"
    },
    render:function(data){
      // find list element
      var _this = this;
      var dom = _this.$el.find('[node-type="list"]');
      if(!dom.length){
        dom = _this.$el;
      }
      data.args = _this.model.getArgs();
      dom.html(_this.template.render(data));
      
      // page
      _this.pageRender();
    },
    showloading:function(){
      var _this = this;
      var dom = _this.$el.find('[node-type="list"]');
      if(!dom.length){
        dom = _this.$el;
      }
      var html = typeof this.loadingHTML == "function"?this.loadingHTML():this.loadingHTML;
      dom.html(html);
    },
    showfail:function(){
      var _this = this;
      var dom = _this.$el.find('[node-type="list"]');
      if(!dom.length){
        dom = _this.$el;
      }
      var html = typeof this.failHTML == "function"?this.failHTML():this.failHTML;
      dom.html(html)
    },
    pageRender:function(){
      var pageDom = this.$el.find('[node-type="pageList"]');
      if(!pageDom.length){
        return;
      }
      var pageTemplateEl = $("#jsPagerTemplate");
      if(pageTemplateEl.length){
        var html = pageTemplateEl.html();
        var template = $.template(html);
        var pageData = $.queryToJson(pageDom.attr("node-val"));
        pageDom.html(template.render(pageData))
      }
    },
    showPage:function(e){
      var _this =this;
      var target = $(e.target);
      var args = $.queryToJson(target.attr("act-data"));
      _this.model.request(args);
      var st = _this.$el.position().top;
      $("html,body").animate({
        scrollTop:st
      },300)
    },
    getDOM:function(){
      return this.$el;
    }
  })
 
  
  return ListView;
})
