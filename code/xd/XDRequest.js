/**
 * 跨域请求
 *
 */
define(function() {
  var crossRequest = require("./crossRequest");
  var Request = function(domain,path) {
    var req = crossRequest(domain);
    
    return function(option){
      return req.request(option);
    }
  }

  return Request;
})
