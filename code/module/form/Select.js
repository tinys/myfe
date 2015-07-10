/**
 * 模拟下拉选项
 * 需要填入 selectTemplate  selectUrl selectKey
 * <input type="text" class="ntSelect" 
 * selectTemplate="#selectTemplate" 
 * selectUrl="/customer/showing/searchAccompany" 
 * selectKey="keyword">
 * 
 * @example
 
 模板中 actSelect 这个样式是必须的
 <script type="text/template">
<ul>
<%if(typeof data != "undefined" && data){for(var i = 0 ,len = data.length;i < len;i++){%>
<li class="actSelect" actData="<%=$.jsonToQuery(data[i])%>"><%=data[i].name%>(<%=data[i].usercode%>)</li>
<%}}%>
</ul>
 </script>
 var select = new Select($(".ntSelect"));
 select.on("select",function(data){
   console.log(data);
 })
 */
define(function(require){
  var AutoSuggest = require("../AutoSuggest");
  
  var Select = AutoSuggest.extend({
    initialize:function(input){
      var _this = this;
      input = $(input);
      if(!input.length){
        return;
      }
      input.addClass("autoSuggest");
      var opt = {
        el:input.parent(),
        url:input.attr("selectUrl"),
        template:input.attr("selectTemplate"),
        param:input.attr("selectKey"),
        input:input
      }
      _this._super(opt);
    }
  })
  
  return Select;
})
