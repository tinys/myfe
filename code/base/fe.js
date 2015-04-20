/**
 * 链家web 公共组件
 * 
 * 1.cmd 代码
 * 2.jquery
 * 3.基础组建
 *   1) util
 *   2）mvc
 *   3）事件稀释
 *   4) ui相关 
 */
/*
require("./cmd");
require("../../../dep/zepto/zepto");

require("./EventEmitter");
require("./Trans");
// model view

require("./template");
require("./Model");
require("./AView");
require("./View");
require("./ListView");

require("./utils");

 */
;(function(){
  
  // 绑定 
  var config = {
    "EventEmitter":require("./EventEmitter"),
    "Trans":require("./Trans"),
    "Model":require("./Model"),
    "View":require("./View"),
    "AView":require("./AView"),
    "ListView":require("./ListView")
  }
  
  for(var i in config){
    $[i]= config[i];
  }
})();
